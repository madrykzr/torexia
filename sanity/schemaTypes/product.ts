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
  {title: 'Berry', value: 'berry'},
  {title: 'Chocolate', value: 'chocolate'},
  {title: 'Beige', value: 'beige'},
]

export const SIZE_OPTIONS = [
  {title: 'S', value: 'S'},
  {title: 'M', value: 'M'},
  {title: 'L', value: 'L'},
  {title: 'XL', value: 'XL'},
  // Some designs are cut in only two sizes, each covering a size cluster —
  // e.g. one cut fits both S and M bodies, another fits both L and XL.
  {title: 'S/M', value: 'S/M'},
  {title: 'L/XL', value: 'L/XL'},
]

// Manual stock switch: ticked sizes stay visible on the site but can't be
// added to the cart, and checkout rejects them server-side.
export function soldOutSizesField() {
  return defineField({
    name: 'soldOutSizes',
    title: 'Sold out sizes',
    type: 'array',
    description:
      'Tick a size when it runs out — customers will see it crossed out and can’t buy it. Untick when restocked, then Publish.',
    of: [defineArrayMember({type: 'string'})],
    options: {list: SIZE_OPTIONS, layout: 'grid'},
    validation: (rule) =>
      rule
        .unique()
        .warning()
        .custom((soldOut, context) => {
          const sizes = (context.document as {sizes?: string[]} | undefined)?.sizes ?? []
          const stray = (soldOut as string[] | undefined)?.filter((s) => !sizes.includes(s)) ?? []
          return stray.length ? `Not in Sizes above: ${stray.join(', ')}` : true
        }),
  })
}

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
