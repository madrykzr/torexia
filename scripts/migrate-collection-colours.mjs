/**
 * One-time migration: convert `collection.colours` from a fixed slug list
 * (e.g. ["berry","chocolate"]) into free-form {name, hex} objects, so the
 * owner can add/edit colours directly in Studio without any code changes.
 *
 *   node --env-file=.env.local scripts/migrate-collection-colours.mjs
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing env. Need SANITY project vars + SANITY_API_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({projectId, dataset, apiVersion: '2026-07-04', token, useCdn: false})

// Mirrors data/products.ts COLOURS — the hex values already in use on the site.
const HEX_BY_SLUG = {
  coffee: {name: 'Coffee', hex: '#4a2f22'},
  'soft-pink': {name: 'Soft Pink', hex: '#e7b9c4'},
  'sage-green': {name: 'Sage Green', hex: '#b3c6ac'},
  'sky-blue': {name: 'Sky Blue', hex: '#a9cdda'},
  black: {name: 'Black', hex: '#1c1c1c'},
  sand: {name: 'Sand', hex: '#d8d2c4'},
  berry: {name: 'Berry', hex: '#a0396b'},
  chocolate: {name: 'Chocolate', hex: '#6b4a33'},
  beige: {name: 'Beige', hex: '#e0c9a6'},
}

let k = 0
const key = () => `col${k++}`

async function run() {
  const docs = await client.fetch('*[_type == "collection"]{_id, name, colours}')
  for (const doc of docs) {
    const slugs = Array.isArray(doc.colours) ? doc.colours : []
    // Already migrated (objects, not strings) — skip.
    if (slugs.length > 0 && typeof slugs[0] === 'object') {
      console.log(`  • ${doc.name} (already migrated, skipped)`)
      continue
    }
    const objects = slugs.map((slug) => {
      const known = HEX_BY_SLUG[slug]
      return {
        _type: 'colour',
        _key: key(),
        name: known?.name ?? slug,
        hex: known?.hex ?? '#000000',
      }
    })
    await client.patch(doc._id).set({colours: objects}).commit()
    console.log(`  ✓ ${doc.name} — ${objects.map((o) => o.name).join(', ')}`)
  }
  console.log('\nDone.')
}

run().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
