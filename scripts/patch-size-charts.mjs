/**
 * One-off patch: applies the client's photographed size charts to Hurrem
 * Abaya, Kafla (Jubah Dress Kafla) and Hatije Abaya, in the new flexible
 * sizeChartColumns/sizeChart shape (replaces the old fixed col1/col2 pair).
 *
 * Run with:  npm run patch:size-charts
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.\n' +
      'Run with:  npm run patch:size-charts',
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

const row = (label, ...values) => ({_key: label.toLowerCase().replace(/\s+/g, '-'), label, values})

const PATCHES = [
  {
    id: 'collection.abaya', // Hurrem Abaya
    name: 'Hurrem Abaya',
    sizeChartColumns: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      row('Length', '53', '55', '57', '59'),
      row('Bust', '43', '45', '47', '49'),
      row('Sleeve', '23', '23', '24', '24'),
    ],
    sizeChartNote:
      'Loose Cut • Modest Fit • Front Open — Inner length reduced 1" from outer cardigan',
  },
  {
    id: '65b1a2cf-1f78-425d-8e5b-67adc7aaa291', // Kafla (Jubah Dress Kafla)
    name: 'Kafla',
    sizeChartColumns: ['S', 'M', 'L'],
    sizeChart: [
      row('Shoulder', '15.5', '16', '16.5'),
      row('Sleeve Length', '22.5', '23', '23.5'),
      row('Armpit', '18', '19', '20'),
      row('Bust', '37', '39', '41'),
      row('Hip', '48', '50', '52'),
      row('Dress Length', '53', '54', '55'),
    ],
    sizeChartNote: null,
  },
  {
    id: '7682d5ce-dd40-47b4-a447-055f9188fd4a', // Hatije Abaya
    name: 'Hatije Abaya',
    sizeChartColumns: ['M', 'L'],
    sizeChart: [
      row('Bust', '43', '45'),
      row('Sleeve', '23', '24'),
      row('Shoulder', '17', '18'),
      row('Outer Length', '53', '56'),
      row('Inner Length', '52', '55'),
      row('Height', '158-165 cm', '165-170 cm'),
      row('Weight', '53-62 kg', '63-72 kg'),
    ],
    sizeChartNote: null,
  },
]

async function run() {
  for (const p of PATCHES) {
    await client
      .patch(p.id)
      .unset(['sizeChartCol1Label', 'sizeChartCol2Label'])
      .set({
        sizeChartColumns: p.sizeChartColumns,
        sizeChart: p.sizeChart,
        sizeChartNote: p.sizeChartNote,
      })
      .commit()
    console.log(`  ✓ ${p.name} (${p.sizeChartColumns.length} columns, ${p.sizeChart.length} rows)`)
  }
  console.log('\nDone.')
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
