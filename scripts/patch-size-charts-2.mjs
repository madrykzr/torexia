/**
 * One-off patch: reshapes Jubah Saira, Kaftan Nura and Jubah Linea's size
 * charts from the old col1/col2 fields into the new sizeChartColumns/values
 * shape. The underlying numbers already matched the client's reference
 * photos exactly — this only migrates the format (same fix already applied
 * to Hurrem/Kafla/Hatije via patch-size-charts.mjs).
 *
 * Run with:  npm run patch:size-charts-2
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run patch:size-charts-2',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-04',
  token,
  useCdn: false,
  perspective: 'raw', // so the stray Jubah Saira draft is included too
})

const row = (label, ...values) => ({_key: label.toLowerCase().replace(/\s+/g, '-'), label, values})

const PATCHES = [
  {
    id: 'collection.jubah-linea',
    name: 'Jubah Linea',
    sizeChartColumns: ['M', 'XL'],
    sizeChart: [
      row('Bahu', '16"', '18"'),
      row('Panjang Lengan', '24"', '26"'),
      row('Ketiak', '19"', '21"'),
      row('Poket daripada ketiak', '6"', '8"'),
      row('Pangkal Lengan', '15"', '17"'),
      row('Hujung Lengan', '8"', '9"'),
      row('Dada', '41"', '45"'),
      row('Labuh Baju', '53"', '55"'),
    ],
    sizeChartNote: 'M uses S/M reference measurements; XL uses L/XL reference measurements',
  },
  {
    id: 'collection.jubah-saira',
    name: 'Jubah Saira',
    sizeChartColumns: ['S/M', 'L/XL'],
    sizeChart: [
      row('Bahu', '16"', '18"'),
      row('Panjang Lengan', '24"', '26"'),
      row('Ketiak', '19"', '21"'),
      row('Dada', '41"', '45"'),
      row('Labuh Baju', '53"', '55"'),
    ],
    sizeChartNote: 'Cuff: 1 inch',
  },
  {
    id: 'collection.kaftan',
    name: 'Kaftan Nura',
    sizeChartColumns: ['S-M', 'L-XL'],
    sizeChart: [
      row('Bahu', '26"', '27½"'),
      row('Panjang Lengan', '17"', '18½"'),
      row('Ketiak', '17"', '19"'),
      row('Dada', '52"', '56"'),
      row('Labuh Baju', '53"', '55"'),
    ],
    sizeChartNote: null,
  },
]

async function run() {
  for (const p of PATCHES) {
    const ids = [p.id]
    // Patch the draft copy too if one exists, so it doesn't crash Studio
    // with a mismatched shape the next time it's opened.
    const draftId = `drafts.${p.id}`
    const draft = await client.getDocument(draftId).catch(() => null)
    if (draft) ids.push(draftId)

    for (const id of ids) {
      await client
        .patch(id)
        .unset(['sizeChartCol1Label', 'sizeChartCol2Label'])
        .set({
          sizeChartColumns: p.sizeChartColumns,
          sizeChart: p.sizeChart,
          sizeChartNote: p.sizeChartNote,
        })
        .commit()
    }
    console.log(
      `  ✓ ${p.name} (${p.sizeChartColumns.length} columns, ${p.sizeChart.length} rows${ids.length > 1 ? ', + draft' : ''})`,
    )
  }
  console.log('\nDone.')
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
