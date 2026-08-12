import {defineType, defineField, defineArrayMember} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {COLOUR_OPTIONS, SIZE_OPTIONS} from './product'

// Product categories the catalogue is organised around.
export const CATEGORY_OPTIONS = [
  {title: 'Kaftan', value: 'kaftan'},
  {title: 'Jubah', value: 'jubah'},
  {title: 'Abaya', value: 'abaya'},
]

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: CATEGORY_OPTIONS, layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (RM)',
      type: 'number',
      description: 'Optional — leave blank to show “Price on enquiry”.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      description: 'The photo shown on the collection card.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'A few lookbook shots shown on the collection page.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
        }),
      ],
    }),
    defineField({
      name: 'colours',
      title: 'Colours',
      type: 'array',
      description: 'Colourways available in this collection.',
      of: [defineArrayMember({type: 'string'})],
      options: {list: COLOUR_OPTIONS},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: SIZE_OPTIONS, layout: 'grid'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
    }),
    defineField({
      name: 'sizeChartCol1Label',
      title: 'Size chart — first column label',
      type: 'string',
      initialValue: 'S / M',
    }),
    defineField({
      name: 'sizeChartCol2Label',
      title: 'Size chart — second column label',
      type: 'string',
      initialValue: 'L / XL',
    }),
    defineField({
      name: 'sizeChart',
      title: 'Size chart',
      type: 'array',
      description: 'Measurement rows, in inches.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Measurement', type: 'string'}),
            defineField({name: 'col1', title: 'First column', type: 'string'}),
            defineField({name: 'col2', title: 'Second column', type: 'string'}),
          ],
          preview: {
            select: {title: 'label', col1: 'col1', col2: 'col2'},
            prepare({title, col1, col2}) {
              return {title, subtitle: [col1, col2].filter(Boolean).join('  ·  ')}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'sizeChartNote',
      title: 'Size chart note',
      type: 'string',
      description: 'Optional line under the chart — e.g. “Cuff: 1 inch”.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Featured on homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first.',
      initialValue: 100,
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      description:
        'Optional — link individual products to this collection (e.g. Abaya).',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
  ],
  preview: {
    select: {title: 'name', category: 'category', media: 'coverImage'},
    prepare({title, category, media}) {
      return {
        title,
        subtitle: category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : undefined,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Name, A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
