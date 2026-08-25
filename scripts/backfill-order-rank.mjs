/**
 * One-off migration: backfills the `orderRank` field (used by
 * @sanity/orderable-document-list for the new drag-to-reorder "Items" list
 * in Studio) on every existing `collectionItem` document, preserving the
 * exact sequence the old manual `order` number field already encoded —
 * instead of resetting to Studio's default order.
 *
 * Items are grouped by their parent collection (ranks only need to be
 * consistent within a collection, since every query filters by collection
 * before sorting) and assigned fresh ranks via the same LexoRank algorithm
 * the plugin itself uses, in (order asc, name asc) sequence — matching
 * exactly how the site sorted them before this migration.
 *
 * Also unsets the now-schema-less `order` field once orderRank is set.
 * Idempotent-ish: safe to re-run, though it will re-rank using whatever
 * `order`/name values remain (items already unset just keep their prior
 * orderRank and get skipped).
 *
 * Requires a write token:
 *   Run:  npm run backfill:order-rank   (loads .env.local)
 */
import {createClient} from '@sanity/client'
import {LexoRank} from 'lexorank'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run backfill:order-rank   (loads .env.local)',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-04',
  token,
  useCdn: false,
})

async function main() {
  const items = await client.fetch(
    `*[_type == "collectionItem" && !defined(orderRank)]{
      _id, name, order, "collectionId": collection._ref
    }`,
  )

  if (items.length === 0) {
    console.log('Nothing to backfill — every item already has an orderRank.')
    return
  }

  const byCollection = new Map()
  for (const item of items) {
    const key = item.collectionId ?? 'unassigned'
    if (!byCollection.has(key)) byCollection.set(key, [])
    byCollection.get(key).push(item)
  }

  const tx = client.transaction()
  for (const [collectionId, group] of byCollection) {
    group.sort((a, b) => {
      const orderDiff = (a.order ?? 100) - (b.order ?? 100)
      if (orderDiff !== 0) return orderDiff
      return (a.name ?? '').localeCompare(b.name ?? '')
    })

    let rank = LexoRank.min()
    for (const item of group) {
      rank = rank.genNext().genNext()
      tx.patch(item._id, {
        set: {orderRank: rank.toString()},
        unset: ['order'],
      })
      console.log(`  ${collectionId}  ${item.name}  ->  ${rank.toString()}`)
    }
  }

  await tx.commit()
  console.log(`\nBackfilled orderRank for ${items.length} item(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
