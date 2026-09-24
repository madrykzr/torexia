import { NextRequest, NextResponse } from "next/server";

import { mapHitPayStatus, verifyWebhookSignature } from "@/lib/hitpay";
import { getOrderByReference, patchOrder } from "@/lib/orders";

type HitPayEventPayload = {
  status?: string;
  reference_number?: string;
  id?: string;
  payments?: Array<{ id?: string }>;
};

// Async fallback for customers who close the tab before the redirect
// completes — the success page's confirm call is the primary path.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("hitpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as HitPayEventPayload;
  const reference = payload.reference_number;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  const order = await getOrderByReference(reference);
  if (!order) {
    return NextResponse.json({ received: true });
  }

  // Never overwrite an order the shop has already moved on (paid/shipped) —
  // HitPay can redeliver webhooks. A failed order may still become paid.
  const mapped = mapHitPayStatus(payload.status);
  const canUpdate =
    order.status === "pending" || (order.status === "failed" && mapped === "paid");
  if (mapped !== "pending" && canUpdate) {
    const hitpayPaymentId = payload.payments?.[0]?.id ?? payload.id ?? order.hitpayPaymentId;
    await patchOrder(order.id, {
      status: mapped,
      hitpayPaymentId: hitpayPaymentId ?? undefined,
    });
  }

  return NextResponse.json({ received: true });
}
