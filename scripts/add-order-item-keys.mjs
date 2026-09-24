/**
 * One-off: adds the missing `_key` to line items on orders created before the
 * checkout started writing them, so Studio can edit those orders.
 * Run with:  node --env-file=.env.local scripts/add-order-item-keys.mjs
 */
import crypto from "crypto";
import {createClient} from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-07-04",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: "raw",
});

const orders = await client.fetch(`*[_type=="order" && count(items[!defined(_key)]) > 0]{_id, items}`);
for (const o of orders) {
  const items = o.items.map((i) => (i._key ? i : {...i, _key: crypto.randomUUID().slice(0, 12)}));
  await client.patch(o._id).set({items}).commit();
  console.log("fixed", o._id);
}
console.log(`Done — ${orders.length} order(s) updated.`);
