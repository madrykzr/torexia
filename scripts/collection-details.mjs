/**
 * Shopping details per collection — colours, sizes, fabric and the real size
 * charts transcribed from the client's `size guide.jpeg` files (inches).
 *
 * Shared by the seed (new datasets) and patch-collections.mjs (existing docs).
 */
export const COLLECTION_DETAILS = {
  kaftan: {
    fabric: 'Cotton Nida',
    colours: ['berry', 'chocolate'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChartCol1Label: 'S – M',
    sizeChartCol2Label: 'L – XL',
    sizeChartNote: null,
    sizeChart: [
      {label: 'Bahu', col1: '26"', col2: '27½"'},
      {label: 'Panjang Lengan', col1: '17"', col2: '18½"'},
      {label: 'Ketiak', col1: '17"', col2: '19"'},
      {label: 'Dada', col1: '52"', col2: '56"'},
      {label: 'Labuh Baju', col1: '53"', col2: '55"'},
    ],
  },
  'jubah-linea': {
    fabric: 'Cotton Nida',
    colours: ['chocolate'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChartCol1Label: 'M (S/M)',
    sizeChartCol2Label: 'XL (L/XL)',
    sizeChartNote: null,
    sizeChart: [
      {label: 'Bahu', col1: '16"', col2: '18"'},
      {label: 'Panjang Lengan', col1: '24"', col2: '26"'},
      {label: 'Ketiak', col1: '19"', col2: '21"'},
      {label: 'Poket daripada ketiak', col1: '6"', col2: '8"'},
      {label: 'Pangkal Lengan', col1: '15"', col2: '17"'},
      {label: 'Hujung Lengan', col1: '8"', col2: '9"'},
      {label: 'Dada', col1: '41"', col2: '45"'},
      {label: 'Labuh Baju', col1: '53"', col2: '55"'},
    ],
  },
  'jubah-saira': {
    fabric: 'Cotton Nida',
    colours: ['beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChartCol1Label: 'S / M',
    sizeChartCol2Label: 'L / XL',
    sizeChartNote: 'Cuff: 1 inch',
    sizeChart: [
      {label: 'Bahu', col1: '16"', col2: '18"'},
      {label: 'Panjang Lengan', col1: '24"', col2: '26"'},
      {label: 'Ketiak', col1: '19"', col2: '21"'},
      {label: 'Dada', col1: '41"', col2: '45"'},
      {label: 'Labuh Baju', col1: '53"', col2: '55"'},
    ],
  },
  abaya: {
    fabric: 'Cotton Nida',
    colours: ['coffee', 'soft-pink', 'sky-blue', 'sage-green', 'sand', 'black'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChartCol1Label: 'S / M',
    sizeChartCol2Label: 'L / XL',
    sizeChartNote: null,
    sizeChart: [
      {label: 'Dada', col1: '39" – 42"', col2: '44" – 46"'},
      {label: 'Labuh Baju', col1: '53" – 54"', col2: '55" – 56"'},
      {label: 'Panjang Lengan', col1: '22" – 22½"', col2: '23" – 23½"'},
    ],
  },
}
