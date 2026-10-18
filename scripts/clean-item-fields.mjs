/**
 * One-off: colourways (collectionItem) no longer have their own sizes, price or
 * sale price — they use their Collection's. This removes the leftover values so
 * Studio stops showing an "Unknown fields" warning on every colourway.
 *
 * Run AFTER the code change is live and the Collections have the right price
 * and sizes (once these are removed, the old per-colour values are gone).
 *
 * Run:  npm run clean:item-fields          (dry run — only lists)
 *       npm run clean:item-fields -- --go  (does it)
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing env. Run with: npm run clean:item-fields')
  process.exit(1)
}
const go = process.argv.includes('--go')
const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false, perspective: 'raw'})

async function main() {
  const docs = await client.fetch(
    `*[_type == "collectionItem" && (defined(sizes) || defined(price) || defined(salePrice))]{_id, name, sizes, price, salePrice}`,
  )
  console.log(`${docs.length} colourway document(s) with old fields:`)
  for (const d of docs) {
    console.log(`- ${d._id} (${d.name}) sizes=${JSON.stringify(d.sizes)} price=${d.price} salePrice=${d.salePrice}`)
  }
  if (!go) {
    console.log('\nDry run — nothing changed. Re-run with --go to remove these fields.')
    return
  }
  for (let i = 0; i < docs.length; i += 20) {
    const tx = client.transaction()
    for (const d of docs.slice(i, i + 20)) tx.patch(d._id, (p) => p.unset(['sizes', 'price', 'salePrice']))
    await tx.commit()
  }
  console.log(`Done — cleaned ${docs.length} document(s).`)

}

// Never print the raw error — a network failure dumps the request, including the token.
main().catch((e) => {
  console.error("Failed:", e?.cause?.code || e?.statusCode || e?.message?.slice(0, 120));
  process.exit(1);
});
