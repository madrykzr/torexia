import { writeClient } from "@/sanity/lib/writeClient";
import type { Order } from "@/lib/orders";
import { ALL_SIZES, type Size } from "@/lib/types";

type StoredOrder = Omit<Order, "id" | "status"> & {
  _id: string;
  _rev: string;
  status: string;
  stockDeductedAt?: string;
};

/**
 * Deducts a paid order's items from stock — exactly once per order, even if
 * the confirm route and the HitPay webhook both fire for the same payment.
 * Mirrors the claim-then-act pattern in notifyOrderPaid (order-notify.ts):
 * a revision-checked write claims the order first, so only one caller ever
 * proceeds to touch stock.
 */
export async function deductStockForOrder(orderId: string): Promise<void> {
  const order = await writeClient.getDocument<StoredOrder>(orderId);
  if (!order || order.status !== "paid" || order.stockDeductedAt) return;

  try {
    await writeClient
      .patch(orderId)
      .ifRevisionId(order._rev)
      .set({ stockDeductedAt: new Date().toISOString() })
      .commit();
  } catch {
    return; // another caller already claimed this order
  }

  const failures: string[] = [];
  for (const item of order.items) {
    if (!item.size || !ALL_SIZES.includes(item.size as Size)) continue; // untracked size
    try {
      await deductOne(item.kind, item.slug, item.size, item.qty);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures.push(`${item.name} (${item.size}): ${message}`);
    }
  }

  if (failures.length) {
    await writeClient
      .patch(orderId)
      .set({ stockError: failures.join("; ").slice(0, 500) })
      .commit()
      .catch(() => {});
  }
}

async function deductOne(
  kind: "collection" | "product",
  slug: string,
  size: string,
  qty: number,
): Promise<void> {
  const type = kind === "product" ? "collectionItem" : "collection";
  const doc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{_id}`,
    { type, slug },
  );
  if (!doc) return; // referenced product/colourway no longer exists

  // A single atomic decrement, not read-then-write — two orders paying for
  // the last unit at nearly the same moment must not both read "1 left" and
  // both write "0". This can still go below zero if oversold this way; that
  // shows as "Sold out" on the site either way, and the owner can see the
  // exact count (and adjust it) in Studio.
  await writeClient
    .patch(doc._id)
    .dec({ [`stock[size == "${size}"].quantity`]: qty })
    .commit();
}
