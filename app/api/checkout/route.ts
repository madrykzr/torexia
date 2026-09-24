import { NextRequest, NextResponse } from "next/server";

import { createPaymentRequest } from "@/lib/hitpay";
import { createOrder, patchOrder, type OrderItemInput } from "@/lib/orders";
import { getShippingSettings } from "@/lib/sanity-content";
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
  if (items.some((i) => i.price == null || !i.qty || i.qty < 1)) {
    return NextResponse.json(
      {
        error:
          "Some items don't have a fixed price yet — please check out via WhatsApp instead.",
      },
      { status: 400 },
    );
  }

  const orderItems: OrderItemInput[] = items.map((i) => ({
    name: i.name ?? "Item",
    slug: i.slug ?? "",
    kind: i.kind === "product" ? "product" : "collection",
    size: i.size ?? null,
    colour: i.colour ?? null,
    price: i.price as number,
    qty: i.qty as number,
  }));

  // Recomputed server-side — never trust a client-supplied total for the
  // amount actually charged.
  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const fee = shippingFee(
    shippingAddress.state,
    subtotal,
    await getShippingSettings(),
  );
  const total = subtotal + fee;

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
