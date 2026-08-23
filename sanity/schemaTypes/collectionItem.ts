import {defineType, defineField, defineArrayMember} from 'sanity'
import {TagIcon} from '@sanity/icons'
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
