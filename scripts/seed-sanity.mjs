/**
 * Seeds the Sanity dataset with the original Phase 1 content:
 * 5 products, 3 blog posts, and site settings (images uploaded from /public).
 *
 * One-time use. Requires a write token:
 *   1. Create a token at https://www.sanity.io/manage → your project →
 *      API → Tokens → "Add API token" (Editor / write permission).
 *   2. Add it to .env.local:   SANITY_API_WRITE_TOKEN="sk..."
 *   3. Run:                    npm run seed
 *
 * Re-running replaces the same documents (idempotent), but re-uploads images.
 */
import {createClient} from '@sanity/client'
import {createReadStream} from 'node:fs'
import {basename} from 'node:path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run seed   (loads .env.local)',
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
const key = () => `seed${k++}`

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

const p = (slug, n) => `public/images/products/${slug}/0${n}.jpg`

// Portable Text block helpers
const block = (style, text) => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})
const para = (t) => block('normal', t)
const h2 = (t) => block('h2', t)
const quote = (t) => block('blockquote', t)

const BASE_DESCRIPTION =
  'Designed for comfort, confidence and effortless everyday elegance. Crafted from soft cotton nida fabric — lightweight, breathable, and perfect for long everyday wear.'

const PRODUCTS = [
  {
    slug: 'daily-abaya',
    name: 'Daily Abaya',
    price: 199,
    description: BASE_DESCRIPTION,
    colours: ['coffee', 'soft-pink', 'sky-blue', 'sage-green', 'sand', 'black'],
    featured: true,
    images: [
      p('coffee', 1),
      p('soft-pink', 1),
      p('sky-blue', 1),
      p('sage-green', 1),
      p('sand', 1),
      p('black', 1),
    ],
  },
  {
    slug: 'signature-lace-abaya',
    name: 'Signature Lace Abaya',
    price: 219,
    description:
      'Our signature open abaya, finished with delicate loop-lace trim along the front panels and flared sleeves. ' +
      BASE_DESCRIPTION,
    colours: ['coffee', 'sand', 'black'],
    featured: true,
    images: [p('coffee', 1), p('coffee', 2), p('sand', 1), p('black', 1)],
  },
  {
    slug: 'everyday-open-abaya',
    name: 'Everyday Open Abaya',
    price: 189,
    description:
      'A soft, throw-over open abaya in our most-loved pastels — effortless layering for daily wear. ' +
      BASE_DESCRIPTION,
    colours: ['soft-pink', 'sage-green', 'sky-blue'],
    featured: true,
    images: [p('soft-pink', 1), p('sage-green', 1), p('sky-blue', 1)],
  },
  {
    slug: 'flare-sleeve-abaya',
    name: 'Flare-Sleeve Abaya',
    price: 209,
    description:
      'Dramatic flared sleeves with intricate cut-work lace, cut for a graceful everyday silhouette. ' +
      BASE_DESCRIPTION,
    colours: ['black', 'coffee', 'sky-blue'],
    featured: false,
    images: [p('black', 1), p('coffee', 3), p('sky-blue', 2)],
  },
  {
    slug: 'essential-nida-abaya',
    name: 'Essential Nida Abaya',
    price: 199,
    description:
      'The essential daily abaya in warm neutrals and calming green — a quiet staple for every wardrobe. ' +
      BASE_DESCRIPTION,
    colours: ['sand', 'sage-green', 'soft-pink'],
    featured: false,
    images: [p('sand', 1), p('sage-green', 2), p('soft-pink', 2)],
  },
]

const POSTS = [
  {
    slug: 'styling-your-daily-abaya',
    title: '5 Ways to Style Your Daily Abaya',
    publishedAt: '2026-06-18',
    cover: p('soft-pink', 5),
    excerpt:
      "From school runs to weekend brunches, here's how to make one abaya work for every part of your day.",
    body: [
      para(
        'A good daily abaya is the quiet hero of a modest wardrobe. It should feel effortless — something you reach for without thinking, that carries you gracefully from morning errands to evening gatherings. Here are five simple ways to restyle the one you already love.',
      ),
      h2('1. Keep it monochrome'),
      para(
        'Pair your abaya with a hijab in the same tonal family. A coffee abaya with a warm cream shawl feels considered and elongating, letting the lace detailing do the talking.',
      ),
      h2('2. Layer with a belt'),
      para(
        'A soft fabric belt at the waist instantly shifts an open abaya from relaxed to refined — perfect for occasions when you want a little more shape.',
      ),
      h2('3. Let the sleeves shine'),
      para(
        'Our flared, cut-work sleeves are designed to move. Keep the rest of your look simple so they remain the focus.',
      ),
      quote(
        "Modest dressing isn't about hiding — it's about choosing what to reveal, and doing it beautifully.",
      ),
      h2('4. Play with texture'),
      para(
        'A satin-finish hijab against the matte cotton nida adds gentle contrast without introducing a single new colour.',
      ),
      h2('5. Ground it with the right shoes'),
      para(
        'Nude heels lengthen the leg for events; clean sandals keep daytime looks light and comfortable. The abaya adapts — you decide the mood.',
      ),
    ],
  },
  {
    slug: 'why-cotton-nida',
    title: 'Why We Chose Cotton Nida',
    publishedAt: '2026-05-30',
    cover: p('sage-green', 1),
    excerpt:
      "The fabric behind every Torexia piece — and why it's made for Malaysia's everyday warmth.",
    body: [
      para(
        'When we set out to design the Torexia daily abaya, we tested fabric after fabric against one question: could you wear it all day, in real Malaysian weather, and still feel fresh? Cotton nida was the clear answer.',
      ),
      h2('Lightweight, but never flimsy'),
      para(
        'Cotton nida has a beautiful weight to it. It drapes cleanly and holds the flared silhouette of our sleeves, yet it is airy enough to move with you through a busy day.',
      ),
      h2('Breathable by nature'),
      para(
        'The weave allows air to pass through, which makes a real difference in humidity. It is the kind of comfort you stop noticing — because nothing is pulling your attention away from your day.',
      ),
      h2('Easy to care for'),
      para(
        'A gentle machine wash and a low iron are all it asks for. Modest fashion should fit into your life, not add to your list.',
      ),
    ],
  },
  {
    slug: 'modest-everyday-elegance',
    title: 'Modest, Everyday Elegance',
    publishedAt: '2026-05-12',
    cover: p('coffee', 6),
    excerpt:
      'Our philosophy in one phrase — and what it means for the women who wear Torexia.',
    body: [
      para(
        'Torexia was born from a simple observation: most abayas ask you to choose between comfort and elegance. We did not think that was fair.',
      ),
      h2('Designed for real women'),
      para(
        'Our pieces are made for mothers, students, professionals — women moving through full days. That is why every design begins with fit, fabric and function before anything else.',
      ),
      quote(
        "Elegance isn't a special occasion. It's how you want to feel on an ordinary Tuesday.",
      ),
      h2('A wardrobe you can trust'),
      para(
        'We keep our palette calm and our details thoughtful, so every piece works with what you already own. Torexia is designed to be the abaya you keep reaching for.',
      ),
    ],
  },
]

async function seed() {
  console.log('Seeding products…')
  for (const prod of PRODUCTS) {
    const images = []
    for (const src of prod.images) {
      images.push(await uploadImage(src, `${prod.name} abaya`))
    }
    await client.createOrReplace({
      _id: `product.${prod.slug}`,
      _type: 'product',
      name: prod.name,
      slug: {_type: 'slug', current: prod.slug},
      price: prod.price,
      fabric: 'Cotton Nida',
      description: prod.description,
      colours: prod.colours,
      sizes: ['S', 'M', 'L', 'XL'],
      images,
      featured: prod.featured,
    })
    console.log(`  ✓ ${prod.name}`)
  }

  console.log('Seeding blog posts…')
  for (const post of POSTS) {
    const mainImage = await uploadImage(post.cover, post.title)
    await client.createOrReplace({
      _id: `post.${post.slug}`,
      _type: 'blogPost',
      title: post.title,
      slug: {_type: 'slug', current: post.slug},
      publishedAt: new Date(post.publishedAt).toISOString(),
      excerpt: post.excerpt,
      mainImage,
      body: post.body,
    })
    console.log(`  ✓ ${post.title}`)
  }

  console.log('Seeding site settings…')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    whatsapp: '60132209408',
    instagram: 'https://www.instagram.com/torexiaofficial/',
    tiktok: 'https://www.tiktok.com/@ladytorexia',
    email: 'hello@torexiacom.biz',
    phone: '+60 13-220 9408',
  })
  console.log('  ✓ Site Settings')

  console.log('\nDone. Content is published and live via the API.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
