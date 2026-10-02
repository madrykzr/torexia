/**
 * One-off: move existing orders to dotted ids ("order.<old id>") so Sanity
 * hides them from anonymous readers. The dataset is public and orders hold
 * customer names, phones and addresses; new orders already get dotted ids
 * (lib/orders.ts). Each order is recreated under its new id and the old one
 * deleted in the same transaction, so nothing is ever half-moved.
 *
 * Run:  npm run privatize:orders          (dry run — only lists)
 *       npm run privatize:orders -- --go  (does it)
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing env. Run with: npm run privatize:orders')
  process.exit(1)
}
const go = process.argv.includes('--go')

const client = createClient({projectId, dataset, apiVersion: '2026-07-04', token, useCdn: false})

// Includes drafts ("drafts.<id>") — a draft with a plain id is just as public.
const orders = await client.fetch(`*[_type == "order" && !(_id match "order.*") && !(_id match "drafts.order.*")]`)
console.log(`${orders.length} order document(s) with a public id.`)

for (const doc of orders) {
  const isDraft = doc._id.startsWith('drafts.')
  const plainId = isDraft ? doc._id.slice('drafts.'.length) : doc._id
  const newId = isDraft ? `drafts.order.${plainId}` : `order.${plainId}`
  console.log(`${go ? 'moving' : 'would move'}: ${doc._id} -> ${newId} (${doc.status})`)
  if (!go) continue
  const {_rev, _updatedAt, ...rest} = doc
  await client.transaction().createOrReplace({...rest, _id: newId}).delete(doc._id).commit()
}
console.log(go ? 'Done.' : 'Dry run only — add --go to apply.')
