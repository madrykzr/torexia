import {defineType, defineField, defineArrayMember} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {SIZE_OPTIONS} from './product'

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
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Add a new one anytime from the "Categories" section — no code needed.',
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
      name: 'salePrice',
      title: 'Sale price (RM)',
      type: 'number',
      description:
        'Optional — set a discounted price. The original price shows with a line through it, the sale price below. Leave blank for no discount.',
      validation: (rule) =>
        rule.min(0).custom((salePrice, context) => {
          if (salePrice == null) return true
          const price = (context.document as {price?: number} | undefined)?.price
          if (typeof price !== 'number')
            return 'Set the Price first before adding a sale price.'
          if (salePrice >= price)
            return 'Sale price must be lower than the original price.'
          return true
        }),
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
      description:
        'Colourways available in this collection — add, edit or remove any time.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'colour',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'hex',
              title: 'Hex colour',
              type: 'string',
              description: 'e.g. #8E0045',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
                    name: 'hex colour',
                  })
                  .error('Enter a valid hex colour, e.g. #8E0045'),
            }),
          ],
          preview: {
            select: {title: 'name', hex: 'hex'},
            prepare({title, hex}) {
              return {title, subtitle: hex}
            },
          },
        }),
      ],
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
      name: 'sizeChartColumns',
      title: 'Size chart — column headers',
      type: 'array',
      description: 'One entry per size column, e.g. "S", "M", "L" — any number of columns.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'sizeChart',
      title: 'Size chart',
      type: 'array',
      description:
        'Measurement rows, in inches. Each row needs one value per column above, in the same order.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Measurement', type: 'string'}),
            defineField({
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
          ],
          preview: {
            select: {title: 'label', values: 'values'},
            prepare({title, values}) {
              return {title, subtitle: (values ?? []).filter(Boolean).join('  ·  ')}
            },
          },
          validation: (rule) =>
            rule.custom((row, context) => {
              const columns = (context.document as {sizeChartColumns?: string[]} | undefined)
                ?.sizeChartColumns
              if (!columns?.length) return true
              const values = (row as {values?: string[]} | undefined)?.values ?? []
              if (values.length !== columns.length) {
                return `This row has ${values.length} value(s) but there are ${columns.length} column(s) — add or remove a value to match.`
              }
              return true
            }),
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
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first.',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {title: 'name', categoryTitle: 'category.title', media: 'coverImage'},
    prepare({title, categoryTitle, media}) {
      return {
        title,
        subtitle: categoryTitle,
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
