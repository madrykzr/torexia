import crypto from "crypto";

import { writeClient } from "@/sanity/lib/writeClient";
import { getOrderAlertEmails } from "@/lib/sanity-content";
import { emailConfigured, escapeHtml, sendEmail } from "@/lib/email";
import { notifyOrderShipped } from "@/lib/order-notify";
import type { Order } from "@/lib/orders";

const API = "https://api.easyparcel.com";
const VERSION = "2026-06";
const AUTH_DOC_ID = "easyparcel.auth"; // dotted id = hidden from anonymous readers
export const REDIRECT_URI = "https://www.ladytorexia.my/api/easyparcel/callback";

const SENDER = {
  name: "Nor Haslina",
  company: "TOREX VENTURES",
  phone_number_country_code: "MY",
  phone_number: "132209408",
  email: "ladytorexiadmin@gmail.com",
  address_1: "PT 57249B Level 1 Limau Manis Village",
  address_2: "Off Putrajaya, Sg. Merab",
  postcode: "43000",
  city: "Kajang",
  subdivision_code: "MY-10",
  country_code: "MY",
};

const STATE_CODES: Record<string, string> = {
  Johor: "MY-01",
  Kedah: "MY-02",
  Kelantan: "MY-03",
  Melaka: "MY-04",
  "Negeri Sembilan": "MY-05",
  Pahang: "MY-06",
  "Pulau Pinang": "MY-07",
  Perak: "MY-08",
  Perlis: "MY-09",
  Selangor: "MY-10",
  Terengganu: "MY-11",
  Sabah: "MY-12",
  Sarawak: "MY-13",
  "W.P. Kuala Lumpur": "MY-14",
  "W.P. Labuan": "MY-15",
  "W.P. Putrajaya": "MY-16",
};

const DEFAULT_WEIGHT_KG = 0.5;

type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
};

function clientCreds() {
  const id = process.env.EASYPARCEL_CLIENT_ID;
  const secret = process.env.EASYPARCEL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("EasyParcel client credentials are not configured.");
  return { id, secret, basic: Buffer.from(`${id}:${secret}`).toString("base64") };
}

// ---- token storage (encrypted at rest in a private Sanity doc) -------------

function encKey(): Buffer {
  const { secret } = clientCreds();
  return crypto.createHash("sha256").update(`torexia-easyparcel-tokens:${secret}`).digest();
}

function encrypt(tokens: Tokens): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encKey(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(tokens), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64");
}

function decrypt(payload: string): Tokens {
  const buf = Buffer.from(payload, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", encKey(), buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  const out = Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]);
  return JSON.parse(out.toString("utf8")) as Tokens;
}

async function loadTokens(): Promise<Tokens | null> {
  const doc = await writeClient.getDocument<{ payload?: string }>(AUTH_DOC_ID);
  if (!doc?.payload) return null;
  try {
    return decrypt(doc.payload);
  } catch {
    return null;
  }
}

async function saveTokens(tokens: Tokens): Promise<void> {
  await writeClient.createOrReplace({
    _id: AUTH_DOC_ID,
    _type: "easyparcelAuth",
    payload: encrypt(tokens),
    updatedAt: new Date().toISOString(),
  });
}

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
};

function toTokens(res: TokenResponse, previous?: Tokens): Tokens {
  const now = Date.now();
  return {
    accessToken: res.access_token,
    refreshToken: res.refresh_token ?? previous?.refreshToken ?? "",
    expiresAt: now + (res.expires_in ?? 36000) * 1000,
    refreshExpiresAt: res.refresh_token_expires_in
      ? now + res.refresh_token_expires_in * 1000
      : (previous?.refreshExpiresAt ?? now + 300 * 24 * 3600 * 1000),
  };
}

async function tokenRequest(params: Record<string, string>): Promise<TokenResponse> {
  const { basic } = clientCreds();
  const headers = { Authorization: `Basic ${basic}` };
  let res = await fetch(`${API}/oauth/token`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  if (!res.ok && res.status >= 400 && res.status < 500) {
    // Some deployments only accept JSON — retry once in that shape.
    res = await fetch(`${API}/oauth/token`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  }
  const json = (await res.json().catch(() => null)) as (TokenResponse & { error?: string }) | null;
  if (!res.ok || !json?.access_token) {
    throw new Error(`EasyParcel token request failed (${res.status}): ${JSON.stringify(json)?.slice(0, 300)}`);
  }
  return json;
}

/** Exchanges the one-time authorization code and stores the tokens. */
export async function exchangeCode(code: string): Promise<void> {
  const res = await tokenRequest({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });
  await saveTokens(toTokens(res));
}

async function refresh(tokens: Tokens): Promise<Tokens> {
  const res = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: tokens.refreshToken,
  });
  // The refresh token rotates — persist the new one straight away.
  const next = toTokens(res, tokens);
  await saveTokens(next);
  return next;
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  const tokens = await loadTokens();
  if (!tokens) throw new Error("EasyParcel is not connected yet — owner must authorize once.");
  if (forceRefresh || tokens.expiresAt - Date.now() < 5 * 60 * 1000) {
    return (await refresh(tokens)).accessToken;
  }
  return tokens.accessToken;
}

export async function isConnected(): Promise<boolean> {
  return (await loadTokens()) !== null;
}

async function epFetch<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const call = async (token: string) =>
    fetch(`${API}/open_api/${VERSION}${path}`, {
      method: init?.method ?? (init?.body ? "POST" : "GET"),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  let res = await call(await getAccessToken());
  if (res.status === 401) res = await call(await getAccessToken(true));
  const json = (await res.json().catch(() => null)) as T | null;
  if (!res.ok || !json) {
    throw new Error(`EasyParcel ${path} failed (${res.status}): ${JSON.stringify(json)?.slice(0, 400)}`);
  }
  return json;
}

export async function getWalletBalance(): Promise<string> {
  const json = await epFetch<{ data?: Record<string, unknown> }>("/wallet");
  return JSON.stringify(json.data ?? json);
}

// ---- booking ---------------------------------------------------------------

type StoredOrder = Omit<Order, "id" | "status"> & {
  _id: string;
  _rev: string;
  status: string;
  courierRequested?: boolean;
  easyparcelShipmentNo?: string;
  courierBookingClaimedAt?: string;
};

type Quotation = {
  courier?: { service_id?: string; is_pickup?: boolean; courier_name?: string };
  pricing?: { total_amount?: number | string };
};

function localPhone(raw: string): string {
  return raw.replace(/[^\d]/g, "").replace(/^60/, "").replace(/^0/, "");
}

function collectionDate(): string {
  // Tomorrow in Malaysia time (UTC+8), skipping Sunday.
  const d = new Date(Date.now() + 8 * 3600 * 1000 + 24 * 3600 * 1000);
  if (d.getUTCDay() === 0) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

async function parcelFor(order: StoredOrder) {
  const slugs = [...new Set(order.items.map((i) => i.slug))];
  const rows = await writeClient.fetch<{ slug: string; weightKg: number | null }[]>(
    `*[_type == "collection" && slug.current in $slugs]{"slug": slug.current, weightKg}`,
    { slugs },
  );
  const byslug = new Map(rows.map((r) => [r.slug, r.weightKg ?? DEFAULT_WEIGHT_KG]));
  const pieces = order.items.reduce((n, i) => n + i.qty, 0);
  const weight = order.items.reduce(
    (w, i) => w + (byslug.get(i.slug) ?? DEFAULT_WEIGHT_KG) * i.qty,
    0,
  );
  return {
    weight: Math.max(0.1, Math.round(weight * 100) / 100),
    length: 30,
    width: 25,
    height: 5 + 3 * Math.max(0, pieces - 1),
    pieces,
  };
}

function receiverOf(order: StoredOrder) {
  const a = order.shippingAddress;
  const code = STATE_CODES[a.state];
  if (!code) throw new Error(`Unknown delivery state "${a.state}".`);
  return {
    name: order.customerName,
    company: "",
    phone_number_country_code: "MY",
    phone_number: localPhone(order.customerPhone),
    email: order.customerEmail,
    address_1: a.line1,
    address_2: a.line2 ?? "",
    postcode: a.postcode,
    city: a.city,
    subdivision_code: code,
    country_code: "MY",
  };
}

type ShipmentDetails = {
  status?: string;
  shipment_status?: string;
  shipment_number?: string;
  courier?: { name?: string; courier_name?: string } | string;
  awb_number?: string | null;
  awb_url?: string | null;
  tracking_url?: string | null;
};

export async function fetchShipmentDetails(shipmentNo: string): Promise<ShipmentDetails | null> {
  const json = await epFetch<{ data?: ShipmentDetails | ShipmentDetails[] }>(
    "/shipment/details",
    { body: { shipment_number: shipmentNo } },
  );
  const d = json.data;
  return (Array.isArray(d) ? d[0] : d) ?? null;
}

async function failBooking(order: StoredOrder, message: string) {
  await writeClient
    .patch(order._id)
    .set({ courierError: message.slice(0, 500), courierRequested: false })
    .unset(["courierBookingClaimedAt"])
    .commit()
    .catch(() => {});
  console.error("Courier booking failed:", message);
  if (!emailConfigured()) return;
  try {
    const to = await getOrderAlertEmails();
    if (to.length === 0) return;
    const short = order.reference.slice(0, 8);
    await sendEmail({
      to,
      subject: `Courier booking failed for order ${short}`,
      text: `The courier could not be booked for order ${short}.\n\nReason: ${message}\n\nFix the cause (e.g. top up the EasyParcel wallet), then tick "Book courier" again in Studio.`,
      html: `<p>The courier could not be booked for order <b>${escapeHtml(short)}</b>.</p><p>Reason: ${escapeHtml(message)}</p><p>Fix the cause (e.g. top up the EasyParcel wallet), then tick “Book courier” again in Studio.</p>`,
    });
  } catch (e) {
    console.error("Courier failure email failed:", e);
  }
}

/** Books one order with EasyParcel. Idempotent via a revision-checked claim. */
export async function bookCourier(orderId: string): Promise<void> {
  const order = await writeClient.getDocument<StoredOrder>(orderId);
  if (
    !order ||
    order.status !== "paid" ||
    !order.courierRequested ||
    order.easyparcelShipmentNo ||
    order.courierBookingClaimedAt
  ) {
    return;
  }
  try {
    await writeClient
      .patch(orderId)
      .ifRevisionId(order._rev)
      .set({ courierBookingClaimedAt: new Date().toISOString() })
      .commit();
  } catch {
    return; // another invocation won the claim
  }

  try {
    const receiver = receiverOf(order);
    const parcel = await parcelFor(order);
    const dims = { weight: parcel.weight, width: parcel.width, length: parcel.length, height: parcel.height };

    const quote = await epFetch<{
      data?: { quotations?: Quotation[] }[];
    }>("/shipment/quotations", {
      body: {
        shipment: [
          {
            sender: { postcode: SENDER.postcode, subdivision_code: SENDER.subdivision_code, country: "MY" },
            receiver: { postcode: receiver.postcode, subdivision_code: receiver.subdivision_code, country: "MY" },
            ...dims,
            parcel_value: order.subtotal,
          },
        ],
      },
    });
    const quotations = (quote.data?.[0]?.quotations ?? []).filter((q) => q.courier?.service_id);
    if (quotations.length === 0) throw new Error("No courier service is available for this route.");
    const price = (q: Quotation) => Number(q.pricing?.total_amount ?? Infinity);
    const cheapest = (list: Quotation[]) => [...list].sort((a, b) => price(a) - price(b))[0];
    const pickups = quotations.filter((q) => q.courier?.is_pickup);
    const chosen = cheapest(pickups.length ? pickups : quotations);

    const booked = await epFetch<{
      data?: {
        order_details?: { order_number?: string };
        shipments?: {
          shipment_number?: string;
          courier?: { courier_name?: string; name?: string } | string;
          awb_number?: string | null;
          awb_url?: string | null;
          awb_urls_by_format?: { A4?: string; A5?: string; A6?: string };
          tracking_url?: string | null;
          pricing_breakdown?: { total_paid_amount?: number | string };
        }[];
      }[];
    }>("/shipment/submit_orders", {
      body: {
        shipment: [
          {
            reference: order.reference.slice(0, 8),
            service_id: chosen.courier!.service_id,
            collection_date: collectionDate(),
            ...dims,
            item: [
              {
                content: "Modest wear",
                ...dims,
                currency_code: "MYR",
                value: order.subtotal,
                quantity: parcel.pieces,
              },
            ],
            sender: SENDER,
            receiver,
            feature: {},
          },
        ],
      },
    });
    const shipment = booked.data?.[0]?.shipments?.[0];
    const shipmentNo = shipment?.shipment_number;
    if (!shipmentNo) {
      throw new Error(
        `EasyParcel did not return a shipment number. Reply: ${JSON.stringify(booked).slice(0, 380)}`,
      );
    }

    // AWB / tracking are often empty straight after booking — ask for the truth.
    const details = await fetchShipmentDetails(shipmentNo).catch(() => null);
    const courierRaw = details?.courier ?? shipment?.courier ?? chosen.courier?.courier_name;
    const courierName =
      typeof courierRaw === "string"
        ? courierRaw
        : (courierRaw?.courier_name ?? courierRaw?.name ?? chosen.courier?.courier_name ?? "Courier");
    const awbNumber = details?.awb_number ?? shipment?.awb_number ?? undefined;
    const awbUrl =
      details?.awb_url ?? shipment?.awb_urls_by_format?.A6 ?? shipment?.awb_url ?? undefined;
    const trackingUrl = details?.tracking_url ?? shipment?.tracking_url ?? undefined;
    const cost = Number(shipment?.pricing_breakdown?.total_paid_amount ?? price(chosen));

    await writeClient
      .patch(orderId)
      .set({
        courierName,
        courier: courierName,
        easyparcelShipmentNo: shipmentNo,
        courierCost: Number.isFinite(cost) ? cost : undefined,
        courierBookedAt: new Date().toISOString(),
        courierRequested: false,
        status: "shipped",
        ...(awbNumber ? { trackingNumber: awbNumber } : {}),
        ...(awbUrl ? { awbUrl } : {}),
        ...(trackingUrl ? { trackingUrl } : {}),
        ...(details?.shipment_status || details?.status
          ? { courierStatus: details.shipment_status ?? details.status }
          : {}),
      })
      .unset(["courierError", "courierBookingClaimedAt"])
      .commit();
    await notifyOrderShipped(orderId);
  } catch (err) {
    await failBooking(order, err instanceof Error ? err.message : String(err));
  }
}

/** Finds every paid order ticked "Book courier" and books it. */
export async function bookPendingCouriers(): Promise<void> {
  const ids = await writeClient.fetch<string[]>(
    `*[_type == "order" && status == "paid" && courierRequested == true && !defined(easyparcelShipmentNo) && !defined(courierBookingClaimedAt) && !(_id in path("drafts.**"))]._id`,
  );
  for (const id of ids) await bookCourier(id);
}

/** Webhook refresh: re-read the courier's truth and store it on the order. */
export async function syncShipment(shipmentNo: string): Promise<void> {
  const order = await writeClient.fetch<{ _id: string; trackingNumber?: string } | null>(
    `*[_type == "order" && easyparcelShipmentNo == $no && !(_id in path("drafts.**"))][0]{_id, trackingNumber}`,
    { no: shipmentNo },
  );
  if (!order) return;
  const d = await fetchShipmentDetails(shipmentNo);
  if (!d) return;
  const set: Record<string, string> = {};
  if (d.awb_number) set.trackingNumber = d.awb_number;
  if (d.awb_url) set.awbUrl = d.awb_url;
  if (d.tracking_url) set.trackingUrl = d.tracking_url;
  const status = d.shipment_status ?? d.status;
  if (status) set.courierStatus = status;
  if (Object.keys(set).length) await writeClient.patch(order._id).set(set).commit();
  await notifyOrderShipped(order._id);
}

// ---- OAuth connect helpers ------------------------------------------------

export function signState(adminKey: string): string {
  const ts = String(Date.now());
  const mac = crypto.createHmac("sha256", adminKey).update(ts).digest("hex");
  return `${ts}.${mac}`;
}

export function verifyState(state: string, adminKey: string): boolean {
  const [ts, mac] = state.split(".");
  if (!ts || !mac || Date.now() - Number(ts) > 15 * 60 * 1000) return false;
  const expected = crypto.createHmac("sha256", adminKey).update(ts).digest("hex");
  return mac.length === expected.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}

export function authorizeUrl(state: string): string {
  const { id } = clientCreds();
  const q = new URLSearchParams({ client_id: id, redirect_uri: REDIRECT_URI, state });
  return `${API}/oauth/login?${q}`;
}

export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}
