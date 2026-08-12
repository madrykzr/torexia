/**
 * One-time patch: add the shopping fields (colours, sizes, fabric, size chart)
 * to collections that were seeded before those fields existed.
 *
 * Only sets these specific fields — any other owner edits are untouched.
 * Also unsets the retired `sizeGuide` image field.
 *
 *   node --env-file=.env.local scripts/patch-collections.mjs
 */
import {createClient} from '@sanity/client'
import {COLLECTION_DETAILS} from './collection-details.mjs'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.',
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

let k = 0
const key = () => `sc${k++}`

async function run() {
  for (const [slug, d] of Object.entries(COLLECTION_DETAILS)) {
    const id = `collection.${slug}`
    const doc = await client.getDocument(id)
    if (!doc) {
      console.log(`  • ${slug} (not found, skipped)`)
      continue
    }
    await client
      .patch(id)
      .set({
        colours: d.colours,
        sizes: d.sizes,
        fabric: d.fabric,
        sizeChartCol1Label: d.sizeChartCol1Label,
        sizeChartCol2Label: d.sizeChartCol2Label,
        sizeChartNote: d.sizeChartNote ?? undefined,
        sizeChart: d.sizeChart.map((r) => ({...r, _key: key()})),
      })
      .unset(['sizeGuide'])
      .commit()
    console.log(`  ✓ ${slug} — ${d.sizeChart.length} chart rows, ${d.colours.length} colours`)
  }
  console.log('\nDone.')
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
