/**
 * One-off: creates 3 Collection Items under "HATIJE ABAYA" (slug
 * hatije-abaya) — Dusty Lavender, Ivory Cream, Wine Red — sharing the same
 * 18 photos (uploaded once from content/HATIJE/, not split per colour),
 * price/sale, description, sizes and size chart, per the owner's request.
 *
 * Idempotent — deterministic ids (`collectionItem.hatije-abaya-<colour>`),
 * safe to re-run (re-uploads photos each run though, so don't re-run
 * casually — fine for this one-off use).
 *
 * Requires a write token:
 *   Run:  npm run create:hatije-items   (loads .env.local)
 */
import {createClient} from '@sanity/client'
import {createReadStream, readdirSync} from 'node:fs'
import {join, basename} from 'node:path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run create:hatije-items   (loads .env.local)',
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

const COLLECTION_ID = '7682d5ce-dd40-47b4-a447-055f9188fd4a' // HATIJE ABAYA
const PHOTOS_DIR = 'E:\\work\\Torexia\\content\\HATIJE'

const SIZE_CHART = [
  {label: 'Bust', col1: '43"', col2: '45"'},
  {label: 'Sleeve', col1: '23"', col2: '24"'},
  {label: 'Shoulder', col1: '17"', col2: '18"'},
  {label: 'Outer Length', col1: '53"', col2: '56"'},
  {label: 'Inner Length', col1: '52"', col2: '55"'},
  {label: 'Height', col1: '158–165 cm', col2: '165–170 cm'},
  {label: 'Weight', col1: '53–62 kg', col2: '63–72 kg'},
]

const COLOURS = [
  {slug: 'dusty-lavender', name: 'Dusty Lavender', hex: '#9C8AA5'},
  {slug: 'ivory-cream', name: 'Ivory Cream', hex: '#F5EFE0'},
  {slug: 'wine-red', name: 'Wine Red', hex: '#722F37'},
]

let k = 0
const key = () => `hatije${k++}`

async function uploadImage(path, alt) {
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: basename(path),
  })
  return {
    _type: 'image',
    _key: key(),
    alt,
    asset: {_type: 'reference', _ref: asset._id},
  }
}

async function main() {
  const files = readdirSync(PHOTOS_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  if (files.length === 0) {
    console.error(`No image files found in ${PHOTOS_DIR}`)
    process.exit(1)
  }
  console.log(`Uploading ${files.length} photos from ${PHOTOS_DIR}...`)

  const images = []
  for (const file of files) {
    const img = await uploadImage(join(PHOTOS_DIR, file), 'Hatije Abaya')
    images.push(img)
    console.log(`  ✓ ${file}`)
  }

  for (const [i, colour] of COLOURS.entries()) {
    const name = `Hatije Abaya ${colour.name}`
    const doc = {
      _id: `collectionItem.hatije-abaya-${colour.slug}`,
      _type: 'collectionItem',
      name,
      slug: {_type: 'slug', current: `hatije-abaya-${colour.slug}`},
      collection: {_type: 'reference', _ref: COLLECTION_ID},
      colour: {name: colour.name, hex: colour.hex},
      images,
      sizes: ['M', 'L', 'XL'],
      price: 249,
      salePrice: 217,
      sizeChartCol1Label: 'M',
      sizeChartCol2Label: 'L',
      sizeChart: SIZE_CHART.map((r) => ({...r, _key: key()})),
      description: 'Cardigan and inner 2 pieces',
      order: (i + 1) * 10,
    }
    await client.createOrReplace(doc)
    console.log(`✓ ${doc._id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
