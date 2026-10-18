import {defineType, defineField, defineArrayMember} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {stockField} from './product'

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
    // Price, sale price and sizes are NOT set here — every colour uses its
    // Collection's, so changing the collection updates all its colours at once.
    // Only stock is per colour (it is counted per colour and size).
    stockField({
      sizesFromCollection: true,
      description:
        'How many you have of each size for THIS colour. The sizes come from the collection. The number goes down automatically when an order is paid, and a size can’t be bought once it reaches 0. A size left out of this list is not tracked (always buyable).',
    }),
    defineField({
      name: 'sizeChartColumns',
      title: 'Size chart — column headers',
      type: 'array',
      description:
        'One entry per size column, e.g. "S", "M", "L". Leave the size chart blank to use the collection’s size guide.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'sizeChart',
      title: 'Size chart',
      type: 'array',
      description:
        'Measurement rows, in inches. Each row needs one value per column above, in the same order. Leave empty to use the parent collection’s size guide.',
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
      description: 'Lower numbers show first among this collection’s items.',
      initialValue: 100,
    }),
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
