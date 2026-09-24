import { NextRequest, NextResponse } from "next/server";

import { getPaymentRequestStatus, mapHitPayStatus } from "@/lib/hitpay";
import { getOrderByReference, patchOrder } from "@/lib/orders";
import { notifyOrderPaid } from "@/lib/order-notify";

// Authoritative status check for the success page — never trust the redirect
// alone. Also self-heals the order status if the webhook hasn't arrived yet.
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("ref");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const order = await getOrderByReference(reference);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  let status = order.status;
  if (status === "pending" && order.hitpayPaymentRequestId) {
    try {
      const hitpayStatus = await getPaymentRequestStatus(order.hitpayPaymentRequestId);
      const mapped = mapHitPayStatus(hitpayStatus.status);
      if (mapped !== "pending") {
        await patchOrder(order.id, { status: mapped });
        status = mapped;
        if (mapped === "paid") await notifyOrderPaid(order.id);
      }
    } catch {
      // Leave it pending — the webhook (or a later page load) can still catch up.
    }
  }

  return NextResponse.json({
    status,
    order: {
      items: order.items,
      subtotal: order.subtotal,
      total: order.total,
      customerName: order.customerName,
    },
  });
}
