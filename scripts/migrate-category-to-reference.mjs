/**
 * One-off migration: converts `collection.category` from a hardcoded string
 * (kaftan/jubah/abaya) into a reference to a new `category` document, so the
 * client can add a brand-new category in Studio without a code change.
 *
 * Safe to re-run: creates category docs with createIfNotExists, and only
 * patches collection docs whose `category` is still a plain string (already
 * migrated docs are skipped). Includes draft copies (raw perspective) so a
 * stray draft never ends up with a mismatched field shape.
 *
 * Run with:  npm run migrate:category
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run migrate:category',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-04',
  token,
  useCdn: false,
  perspective: 'raw', // include drafts as separate documents
})

const CATEGORIES = [
  {slug: 'kaftan', title: 'Kaftan', order: 1},
  {slug: 'jubah', title: 'Jubah', order: 2},
  {slug: 'abaya', title: 'Abaya', order: 3},
]

async function run() {
  console.log('Creating category documents…')
  for (const cat of CATEGORIES) {
    await client.createIfNotExists({
      _id: `category.${cat.slug}`,
      _type: 'category',
      title: cat.title,
      slug: {_type: 'slug', current: cat.slug},
      order: cat.order,
    })
    console.log(`  ✓ category.${cat.slug} (${cat.title})`)
  }

  console.log('\nPatching collection documents (published + drafts)…')
  const docs = await client.fetch(
    `*[_type == "collection" && defined(category)]{_id, name, category}`,
  )

  let patched = 0
  for (const doc of docs) {
    if (typeof doc.category !== 'string') {
      console.log(`  - ${doc._id} (${(doc.name ?? '').trim()}) already migrated, skipping`)
      continue
    }
    const match = CATEGORIES.find((c) => c.slug === doc.category)
    if (!match) {
      console.warn(
        `  ! ${doc._id} (${(doc.name ?? '').trim()}) has unknown category "${doc.category}" — skipped, fix manually`,
      )
      continue
    }
    await client
      .patch(doc._id)
      .set({category: {_type: 'reference', _ref: `category.${match.slug}`}})
      .commit()
    console.log(`  ✓ ${doc._id} (${(doc.name ?? '').trim()}) -> category.${match.slug}`)
    patched++
  }

  console.log(`\nDone. ${patched} document(s) patched.`)
}

run().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
