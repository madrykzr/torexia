/**
 * One-off migration: folds the 5 legacy `product` documents (the pre-merge
 * individual Abaya SKUs, hidden from Studio since commit a6c2c10) into the
 * new `collectionItem` type, so they reappear as real "Shop this piece"
 * tiles under the Abaya collection.
 *
 * Each old product listed multiple colours (2-6); `collectionItem` holds
 * only one, so we tag each new item with the product's *first* listed
 * colour as a representative swatch. Images are the original 2026-07
 * placeholder/seed photos, reused by asset reference (no re-upload).
 *
 * Idempotent — deterministic ids (`collectionItem.<slug>`), safe to re-run.
 * Does not touch or delete the original `product.*` documents.
 *
 * Requires a write token:
 *   Run:  npm run migrate:abaya-items   (loads .env.local)
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run migrate:abaya-items   (loads .env.local)',
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

// Same palette as data/products.ts's COLOURS — kept in sync manually since
// this script runs outside the Next.js/TS build.
const COLOURS = {
  coffee: {name: 'Coffee', hex: '#4a2f22'},
  'soft-pink': {name: 'Soft Pink', hex: '#e7b9c4'},
  'sage-green': {name: 'Sage Green', hex: '#b3c6ac'},
  'sky-blue': {name: 'Sky Blue', hex: '#a9cdda'},
  black: {name: 'Black', hex: '#1c1c1c'},
  sand: {name: 'Sand', hex: '#d8d2c4'},
}

let k = 0
const key = () => `migrate${k++}`

async function main() {
  const products = await client.fetch(
    `*[_type == "product"] | order(_createdAt asc){
      _id, name, "slug": slug.current, price, description, sizes, colours, images
    }`,
  )

  if (products.length === 0) {
    console.log('No legacy `product` documents found — nothing to migrate.')
    return
  }

  let order = 10
  for (const p of products) {
    const firstColourSlug = p.colours?.[0]
    const colour = COLOURS[firstColourSlug]
    if (!colour) {
      console.warn(`Skipping "${p.name}" — unrecognised colour slug "${firstColourSlug}".`)
      continue
    }

    const doc = {
      _id: `collectionItem.${p.slug}`,
      _type: 'collectionItem',
      name: p.name,
      slug: {_type: 'slug', current: p.slug},
      collection: {_type: 'reference', _ref: 'collection.abaya'},
      colour: {name: colour.name, hex: colour.hex},
      images: (p.images ?? []).map((img) => ({
        _type: 'image',
        _key: key(),
        alt: img.alt,
        asset: {_type: 'reference', _ref: img.asset._ref},
      })),
      sizes: p.sizes ?? [],
      price: p.price ?? null,
      description: p.description ?? '',
      order,
    }
    order += 10

    await client.createOrReplace(doc)
    console.log(`✓ ${doc._id}  (${colour.name}, ${doc.images.length} images)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
