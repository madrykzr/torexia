import {defineType, defineField, defineArrayMember} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {SIZE_OPTIONS} from './product'

// A single colourway of a collection (e.g. "Kaftan Berry") with its own photo
// set — reached by clicking through from the parent collection page.
export const collectionItem = defineType({
  name: 'collectionItem',
  title: 'Collection Item',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Kaftan Berry"',
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
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{type: 'collection'}],
      description: 'Which collection this colourway belongs to (Kaftan, Jubah, Abaya…).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'colour',
      title: 'Colour',
      type: 'object',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'This colourway’s own photos — including close-up fabric/cut detail shots.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Important for SEO and accessibility.',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).warning('Add at least one image.'),
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
      name: 'price',
      title: 'Price (RM)',
      type: 'number',
      description: 'Optional — leave blank to use the collection’s price.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale price (RM)',
      type: 'number',
      description:
        'Optional — a discounted price. The original price shows with a line through it, the sale price below. Leave blank for no discount.',
      validation: (rule) =>
        rule.min(0).custom((salePrice, context) => {
          if (salePrice == null) return true
          const price = (context.document as {price?: number} | undefined)?.price
          if (typeof price === 'number' && salePrice >= price)
            return 'Sale price must be lower than the price.'
          return true
        }),
    }),
    defineField({
      name: 'sizeChartCol1Label',
      title: 'Size chart — first column label',
      type: 'string',
      description: 'Leave the size chart blank to use the collection’s size guide.',
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
      description:
        'Measurement rows, in inches. Leave empty to use the parent collection’s size guide.',
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
    orderRankField({type: 'collectionItem'}),
  ],
  preview: {
    select: {title: 'name', colour: 'colour.name', media: 'images.0'},
    prepare({title, colour, media}) {
      return {
        title,
        subtitle: colour,
        media,
      }
    },
  },
  orderings: [
    orderRankOrdering,
    {
      title: 'Name, A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
