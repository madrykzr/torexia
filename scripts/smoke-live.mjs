/**
 * Post-deploy smoke test for the live checkout. Places a test order (creates a
 * HitPay payment page, never charges anyone), sends a correctly-signed and a
 * tampered webhook, checks the order status, then deletes the test order.
 *
 * Run with:  npm run smoke:live            (defaults to https://www.ladytorexia.my)
 *            npm run smoke:live -- http://localhost:3000
 */
import crypto from "crypto";
import {createClient} from "@sanity/client";

const base = process.argv[2] || "https://www.ladytorexia.my";
const {NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_API_WRITE_TOKEN: token, HITPAY_WEBHOOK_SALT: salt} = process.env;

if (!projectId || !dataset || !token || !salt) {
  console.error("Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN, HITPAY_WEBHOOK_SALT (run via npm run smoke:live).");
  process.exit(1);
}

const sanity = createClient({projectId, dataset, apiVersion: "2026-07-04", token, useCdn: false});
const NAME = "SMOKE TEST";
let failed = 0;
const check = (label, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${extra ? " - " + extra : ""}`);
  if (!ok) failed++;
};

async function cleanup() {
  const rows = await sanity.fetch(`*[_type=="order" && customerName==$n]{_id}`, {n: NAME});
  for (const r of rows) await sanity.delete(r._id);
}

console.log(`Smoke testing ${base}\n`);
await cleanup();

try {
  const res = await fetch(base + "/api/checkout", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      customerName: NAME,
      customerEmail: "smoke@example.com",
      customerPhone: "60132209408",
      shippingAddress: {line1: "1 Test St", city: "KL", state: "Selangor", postcode: "40000"},
      items: [{name: "Smoke item", slug: "smoke", kind: "collection", size: "M", colour: "Black", price: 50, qty: 1}],
    }),
  });
  const body = await res.json().catch(() => ({}));
  check("checkout creates a HitPay payment page", res.status === 200 && !!body.url, `status ${res.status}`);

  const order = await sanity.fetch(`*[_type=="order" && customerName==$n][0]{_id,reference,status}`, {n: NAME});
  check("order saved in Sanity as pending", order?.status === "pending");

  if (order) {
    const payload = JSON.stringify({status: "completed", reference_number: order.reference, id: "smoke-test"});
    const sig = crypto.createHmac("sha256", salt).update(payload).digest("hex");
    const post = (s) => fetch(base + "/api/webhooks/hitpay", {method: "POST", headers: {"Content-Type": "application/json", "Hitpay-Signature": s}, body: payload});

    check("tampered webhook is rejected (401)", (await post("00")).status === 401);
    check("signed webhook is accepted (200)", (await post(sig)).status === 200);

    const after = await sanity.fetch(`*[_id==$id][0]{status}`, {id: order._id});
    check("order flips to paid after webhook", after?.status === "paid");

    await sanity.patch(order._id).set({status: "shipped"}).commit();
    await post(sig);
    const shipped = await sanity.fetch(`*[_id==$id][0]{status}`, {id: order._id});
    check("repeated webhook does not undo a shipped order", shipped?.status === "shipped");
  }
} catch (err) {
  check("no unexpected error", false, err.message);
} finally {
  await cleanup();
  console.log("\nTest order cleaned up.");
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
