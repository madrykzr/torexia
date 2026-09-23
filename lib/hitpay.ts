import crypto from "crypto";

// Server-only HitPay integration. Uses the account's live API key — HitPay
// has no separate sandbox for this business, so every call here hits the
// real API (creating/checking a payment request never charges anyone; only
// a customer actually completing checkout on HitPay's hosted page does).
const HITPAY_API_BASE = "https://api.hit-pay.com/v1";

function apiKey(): string {
  const key = process.env.HITPAY_API_KEY;
  if (!key) throw new Error("Missing HITPAY_API_KEY environment variable.");
  return key;
}

export type HitPayAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
};

export type CreatePaymentRequestInput = {
  amount: number;
  name: string;
  email: string;
  phone: string;
  referenceNumber: string;
  address: HitPayAddress;
  redirectUrl: string;
  purpose: string;
};

export type HitPayPaymentRequest = {
  id: string;
  url: string;
  status: string;
  reference_number?: string;
  amount?: string;
  currency?: string;
};

/**
 * Creates a HitPay hosted payment request. `payment_methods` is deliberately
 * omitted so the hosted checkout shows whatever methods are actually active
 * on the account — avoids hardcoding and hard-failing before FPX is enabled.
 */
export async function createPaymentRequest(
  input: CreatePaymentRequestInput,
): Promise<HitPayPaymentRequest> {
  const res = await fetch(`${HITPAY_API_BASE}/payment-requests`, {
    method: "POST",
    headers: {
      "X-BUSINESS-API-KEY": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currency: "MYR",
      amount: input.amount.toFixed(2),
      name: input.name,
      email: input.email,
      phone: input.phone,
      reference_number: input.referenceNumber,
      redirect_url: input.redirectUrl,
      purpose: input.purpose,
      address: {
        line1: input.address.line1,
        line2: input.address.line2 || undefined,
        city: input.address.city,
        state: input.address.state,
        postal_code: input.address.postcode,
        country: input.address.country || "Malaysia",
      },
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (body && typeof body === "object" && "message" in body
        ? String((body as { message?: unknown }).message)
        : null) || `HitPay create payment request failed (${res.status})`;
    throw new Error(message);
  }
  return body as HitPayPaymentRequest;
}

export async function getPaymentRequestStatus(
  paymentRequestId: string,
): Promise<HitPayPaymentRequest> {
  const res = await fetch(
    `${HITPAY_API_BASE}/payment-requests/${paymentRequestId}`,
    { headers: { "X-BUSINESS-API-KEY": apiKey() } },
  );
  if (!res.ok) {
    throw new Error(`HitPay get payment status failed (${res.status})`);
  }
  return (await res.json()) as HitPayPaymentRequest;
}

/** completed -> paid, failed/expired/canceled -> failed, else pending. */
export function mapHitPayStatus(
  status: string | undefined,
): "pending" | "paid" | "failed" {
  if (status === "completed") return "paid";
  if (status === "failed" || status === "expired" || status === "canceled") {
    return "failed";
  }
  return "pending";
}

/**
 * Verifies the `Hitpay-Signature` header on an Event Webhook delivery:
 * HMAC-SHA256 of the raw JSON body, keyed with the webhook endpoint's own
 * salt (HITPAY_WEBHOOK_SALT — distinct from the account API salt).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const salt = process.env.HITPAY_WEBHOOK_SALT;
  if (!salt || !signatureHeader) return false;

  const computed = crypto.createHmac("sha256", salt).update(rawBody).digest("hex");

  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
