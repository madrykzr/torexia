/**
 * One-off content-scaffolding script: for Kaftan, Jubah Linea and Jubah
 * Saira — collections that (unlike Abaya) never had separate `product`
 * documents — creates one `collectionItem` per colour already defined on
 * the collection itself, so each colour gets its own clickable page.
 *
 * There's no per-colour photo set yet for these three, so images are
 * matched best-effort: a gallery image whose alt text mentions the colour
 * name is used for that item; otherwise it falls back to the collection's
 * cover + gallery as placeholders (same caveat as the Abaya migration —
 * swap in real per-colour photos later).
 *
 * Idempotent — deterministic ids (`collectionItem.<collectionSlug>-<colourSlug>`),
 * safe to re-run. Does not touch the collection documents themselves.
 *
 * Requires a write token:
 *   Run:  npm run create:collection-items   (loads .env.local)
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run create:collection-items   (loads .env.local)',
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

const TARGET_SLUGS = ['kaftan', 'jubah-linea', 'jubah-saira']

let k = 0
const key = () => `starter${k++}`

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function titleCase(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function toImageRef(img) {
  return {
    _type: 'image',
    _key: key(),
    alt: img.alt,
    asset: {_type: 'reference', _ref: img.asset._ref},
  }
}

/** Find gallery images whose alt text mentions this colour name; else null. */
function matchColourImages(colourName, gallery) {
  const words = colourName.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  const matches = gallery.filter((img) => {
    const alt = (img.alt ?? '').toLowerCase()
    return words.some((w) => alt.includes(w))
  })
  return matches.length > 0 ? matches : null
}

async function main() {
  const collections = await client.fetch(
    `*[_type == "collection" && slug.current in $slugs]{
      _id, name, "slug": slug.current, colours, coverImage, gallery, sizes, description
    }`,
    {slugs: TARGET_SLUGS},
  )

  for (const c of collections) {
    if (!c.colours || c.colours.length === 0) {
      console.warn(`Skipping "${c.name}" — no colours defined on the collection.`)
      continue
    }

    let order = 10
    for (const colour of c.colours) {
      const displayName = `${c.name} ${titleCase(colour.name)}`
      const colourSlug = slugify(colour.name)
      const matched = matchColourImages(colour.name, c.gallery ?? [])
      const images = matched
        ? matched.map(toImageRef)
        : [c.coverImage, ...(c.gallery ?? [])].filter(Boolean).map(toImageRef)

      const doc = {
        _id: `collectionItem.${c.slug}-${colourSlug}`,
        _type: 'collectionItem',
        name: displayName,
        slug: {_type: 'slug', current: colourSlug},
        collection: {_type: 'reference', _ref: c._id},
        colour: {name: colour.name, hex: colour.hex},
        images,
        sizes: c.sizes ?? [],
        price: null, // inherit the collection's price
        description: c.description ?? '',
        order,
      }
      order += 10

      await client.createOrReplace(doc)
      console.log(
        `✓ ${doc._id}  (${images.length} image${images.length === 1 ? '' : 's'}${matched ? ', colour-matched' : ', shared/placeholder'})`,
      )
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
