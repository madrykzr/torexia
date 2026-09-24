import crypto from "crypto";

import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";

export type OrderStatus = "pending" | "paid" | "shipped" | "failed" | "cancelled";

export type OrderItemInput = {
  name: string;
  slug: string;
  kind: "collection" | "product";
  size: string | null;
  colour: string | null;
  price: number;
  qty: number;
};

export type OrderAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
};

export type OrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: OrderAddress;
  items: OrderItemInput[];
  subtotal: number;
  total: number;
};

export type Order = OrderInput & {
  id: string;
  reference: string;
  status: OrderStatus;
  hitpayPaymentRequestId: string | null;
  hitpayPaymentId: string | null;
};

const ORDER_FIELDS = `
  "id": _id, reference, status,
  customerName, customerEmail, customerPhone,
  shippingAddress, items, subtotal, total,
  hitpayPaymentRequestId, hitpayPaymentId
`;

export async function createOrder(input: OrderInput): Promise<Order> {
  const reference = crypto.randomUUID();
  const created = await writeClient.create({
    _type: "order",
    reference,
    status: "pending" as OrderStatus,
    ...input,
  });
  return {
    id: created._id,
    reference,
    status: "pending",
    hitpayPaymentRequestId: null,
    hitpayPaymentId: null,
    ...input,
  };
}

export async function getOrderByReference(
  reference: string,
): Promise<Order | null> {
  return client.fetch<Order | null>(
    `*[_type == "order" && reference == $reference][0]{${ORDER_FIELDS}}`,
    { reference },
  );
}

export async function patchOrder(
  id: string,
  fields: Partial<
    Pick<Order, "status" | "hitpayPaymentRequestId" | "hitpayPaymentId">
  >,
): Promise<void> {
  await writeClient.patch(id).set(fields).commit();
}
