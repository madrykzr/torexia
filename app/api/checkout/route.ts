import { NextRequest, NextResponse } from "next/server";

import { createPaymentRequest } from "@/lib/hitpay";
import { createOrder, patchOrder, type OrderItemInput } from "@/lib/orders";
import { effectivePrice, roundMoney } from "@/lib/constants";
import {
  getPricingForItems,
  getShippingSettings,
  getStockForItems,
} from "@/lib/sanity-content";
import { remainingStock } from "@/lib/stock";
import { shippingFee } from "@/lib/shipping";

type CheckoutBody = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
  items?: Array<{
    name?: string;
    slug?: string;
    kind?: string;
    size?: string | null;
    colour?: string | null;
    price?: number | null;
    qty?: number;
  }>;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { customerName, customerEmail, customerPhone, shippingAddress, items } = body;

  if (!customerName || !customerEmail || !customerPhone) {
    return NextResponse.json(
      { error: "Name, email and phone are required." },
      { status: 400 },
    );
  }
  if (
    !shippingAddress?.line1 ||
    !shippingAddress?.city ||
    !shippingAddress?.state ||
    !shippingAddress?.postcode
  ) {
    return NextResponse.json(
      { error: "A complete shipping address is required." },
      { status: 400 },
    );
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (items.some((i) => !i.qty || !Number.isInteger(i.qty) || i.qty < 1 || i.qty > 50)) {
    return NextResponse.json({ error: "Invalid quantity in your cart." }, { status: 400 });
  }

  // Prices, names and sizes come from Sanity — never from the browser, which
  // could send any number it likes.
  const pricing = await getPricingForItems(
    items.map((i) => ({
      slug: i.slug ?? "",
      kind: i.kind === "product" ? "product" : "collection",
    })),
  );
  const priceOf = (i: NonNullable<CheckoutBody["items"]>[number]) => {
    const p = pricing[`${i.kind === "product" ? "product" : "collection"}:${i.slug ?? ""}`];
    return p ? { ...p, effective: effectivePrice(p.price, p.salePrice) } : null;
  };
  if (items.some((i) => priceOf(i)?.effective == null)) {
    return NextResponse.json(
      {
        error:
          "Some items don't have a fixed price yet — please check out via WhatsApp instead.",
      },
      { status: 400 },
    );
  }
  const badSize = items.find((i) => {
    const p = priceOf(i);
    return p && p.sizes.length > 0 && (!i.size || !p.sizes.includes(i.size));
  });
  if (badSize) {
    return NextResponse.json(
      {
        error: `${priceOf(badSize)?.name ?? "That item"} isn't available in that size. Please update your cart.`,
      },
      { status: 400 },
    );
  }

  const stockBySlug = await getStockForItems(
    items.map((i) => ({
      slug: i.slug ?? "",
      kind: i.kind === "product" ? "product" : "collection",
    })),
  );
  const outOfStockItem = items.find((i) => {
    if (!i.size) return false;
    const remaining = remainingStock(stockBySlug[i.slug ?? ""] ?? [], i.size);
    return remaining != null && remaining < (i.qty ?? 1);
  });
  if (outOfStockItem) {
    const remaining = remainingStock(
      stockBySlug[outOfStockItem.slug ?? ""] ?? [],
      outOfStockItem.size as string,
    );
    const stockNote =
      remaining && remaining > 0 ? ` Only ${remaining} left.` : " It just sold out.";
    return NextResponse.json(
      {
        error: `${outOfStockItem.name ?? "That item"} in size ${outOfStockItem.size} doesn't have enough stock.${stockNote} Please adjust your cart.`,
      },
      { status: 400 },
    );
  }

  const orderItems: OrderItemInput[] = items.map((i) => {
    const p = priceOf(i)!;
    return {
      name: p.name,
      slug: i.slug ?? "",
      kind: i.kind === "product" ? "product" : "collection",
      size: i.size ?? null,
      colour: i.colour ?? null,
      price: p.effective as number,
      qty: i.qty as number,
    };
  });

  // Recomputed server-side — never trust a client-supplied total for the
  // amount actually charged.
  const subtotal = roundMoney(orderItems.reduce((sum, i) => sum + i.price * i.qty, 0));
  const fee = shippingFee(
    shippingAddress.state,
    subtotal,
    await getShippingSettings(),
  );
  const total = roundMoney(subtotal + fee);

  if (subtotal < 0.3) {
    return NextResponse.json({ error: "Order total is too small." }, { status: 400 });
  }

  const order = await createOrder({
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress: {
      line1: shippingAddress.line1,
      line2: shippingAddress.line2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postcode: shippingAddress.postcode,
      country: "Malaysia",
    },
    items: orderItems,
    subtotal,
    shippingFee: fee,
    total,
  });

  const redirectUrl = `${new URL(req.url).origin}/checkout/success?ref=${order.reference}`;

  try {
    const paymentRequest = await createPaymentRequest({
      amount: total,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      referenceNumber: order.reference,
      address: {
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.postcode,
        country: "Malaysia",
      },
      redirectUrl,
      purpose: `Torexia order ${order.reference.slice(0, 8)}`,
    });

    await patchOrder(order.id, { hitpayPaymentRequestId: paymentRequest.id });

    return NextResponse.json({ url: paymentRequest.url });
  } catch (err) {
    await patchOrder(order.id, { status: "failed" });
    const message = err instanceof Error ? err.message : "Payment gateway error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
