import { writeClient } from "@/sanity/lib/writeClient";
import { emailConfigured, escapeHtml, sendEmail } from "@/lib/email";
import { getOrderAlertEmails } from "@/lib/sanity-content";
import type { Order } from "@/lib/orders";

const STUDIO_URL = "https://www.ladytorexia.my/studio/structure/orders;orders-to-ship";

type StoredOrder = Omit<Order, "id" | "status"> & {
  _id: string;
  _rev: string;
  status: string;
  paidNotifiedAt?: string;
};

function rm(n: number): string {
  return `RM${n}`;
}

function itemLines(order: StoredOrder): string[] {
  return order.items.map(
    (i) =>
      `${i.qty} x ${i.name}${i.size ? `, size ${i.size}` : ""}${i.colour ? `, ${i.colour}` : ""} — ${rm(i.price * i.qty)}`,
  );
}

function addressLines(order: StoredOrder): string[] {
  const a = order.shippingAddress;
  return [
    order.customerName,
    order.customerPhone,
    a.line1,
    ...(a.line2 ? [a.line2] : []),
    `${a.postcode} ${a.city}`,
    `${a.state}, ${a.country ?? "Malaysia"}`,
  ];
}

function htmlList(lines: string[]): string {
  return lines.map((l) => `<div>${escapeHtml(l)}</div>`).join("");
}

/**
 * Sends the "new paid order" alert to the shop and a confirmation to the
 * customer — exactly once per order, even if the confirm route and the HitPay
 * webhook both fire for the same payment. Safe to call repeatedly.
 */
export async function notifyOrderPaid(orderId: string): Promise<void> {
  if (!emailConfigured()) return;

  const order = await writeClient.getDocument<StoredOrder>(orderId);
  if (!order || order.status !== "paid" || order.paidNotifiedAt) return;

  // Claim the send: only one caller can win this revision-checked write.
  try {
    await writeClient
      .patch(orderId)
      .ifRevisionId(order._rev)
      .set({ paidNotifiedAt: new Date().toISOString() })
      .commit();
  } catch {
    return;
  }

  try {
    const shopEmails = await getOrderAlertEmails();
    const short = order.reference.slice(0, 8);
    const items = itemLines(order);
    const address = addressLines(order);
    const money = [
      `Subtotal: ${rm(order.subtotal)}`,
      `Shipping: ${order.shippingFee > 0 ? rm(order.shippingFee) : "Free"}`,
      `Total paid: ${rm(order.total)}`,
    ];

    if (shopEmails.length > 0) {
      await sendEmail({
        to: shopEmails,
        replyTo: order.customerEmail,
        subject: `New paid order ${short} — ${rm(order.total)} — ${order.customerName}`,
        text: [
          `New paid order ${short}`,
          "",
          "SHIP TO",
          ...address,
          "",
          "ITEMS",
          ...items,
          "",
          ...money,
          "",
          `Open in Studio: ${STUDIO_URL}`,
        ].join("\n"),
        html: `<h2>New paid order ${escapeHtml(short)}</h2>
<h3>Ship to</h3>${htmlList(address)}
<h3>Items</h3>${htmlList(items)}
<p>${money.map(escapeHtml).join("<br>")}</p>
<p><a href="${STUDIO_URL}">Open in Studio</a> to mark it shipped.</p>`,
      });
    }

    await sendEmail({
      to: [order.customerEmail],
      subject: `Thank you for your Torexia order (${short})`,
      text: [
        `Hi ${order.customerName},`,
        "",
        "Thank you — we've received your payment and will pack your order soon.",
        "",
        ...items,
        "",
        ...money,
        "",
        "We'll be in touch when it ships.",
        "— Torexia",
      ].join("\n"),
      html: `<p>Hi ${escapeHtml(order.customerName)},</p>
<p>Thank you — we've received your payment and will pack your order soon.</p>
${htmlList(items)}<p>${money.map(escapeHtml).join("<br>")}</p>
<p>We'll be in touch when it ships.<br>— Torexia</p>`,
    });
  } catch (err) {
    // Release the claim so a later call can retry the send.
    await writeClient.patch(orderId).unset(["paidNotifiedAt"]).commit().catch(() => {});
    console.error("Order alert failed:", err);
  }
}
