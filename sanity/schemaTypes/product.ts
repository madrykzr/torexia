import {defineType, defineField, defineArrayMember} from 'sanity'
import {TagIcon} from '@sanity/icons'

// Controlled option lists keep editor data consistent with the frontend.
export const COLOUR_OPTIONS = [
  {title: 'Coffee', value: 'coffee'},
  {title: 'Soft Pink', value: 'soft-pink'},
  {title: 'Sky Blue', value: 'sky-blue'},
  {title: 'Sage Green', value: 'sage-green'},
  {title: 'Sand', value: 'sand'},
  {title: 'Black', value: 'black'},
]

export const SIZE_OPTIONS = [
  {title: 'S', value: 'S'},
  {title: 'M', value: 'M'},
  {title: 'L', value: 'L'},
  {title: 'XL', value: 'XL'},
]

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
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
      name: 'price',
      title: 'Price (RM)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
      initialValue: 'Cotton Nida',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'colours',
      title: 'Colours',
      type: 'array',
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
      name: 'images',
      title: 'Images',
      type: 'array',
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
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this product in the homepage featured section.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name', price: 'price', media: 'images.0'},
    prepare({title, price, media}) {
      return {
        title,
        subtitle: typeof price === 'number' ? `RM${price}` : 'No price',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Price, low to high',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
    {
      title: 'Name, A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
