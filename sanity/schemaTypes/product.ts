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

// Per-size stock count. Add a row per size and set how many are in stock —
// the site hides purchase of a size once its count hits 0, and every paid
// order deducts automatically, so nobody needs to check or update it by hand.
// A size in "Sizes" above with no row here is treated as untracked/unlimited,
// so existing content keeps working until stock is actually filled in.
export function stockField() {
  return defineField({
    name: 'stock',
    title: 'Stock',
    type: 'array',
    description:
      'How many of each size you have. Add a row per size and set the quantity — it goes down automatically as orders are paid, and that size can’t be bought once it reaches 0. Leave a size out of this list to not track its stock (always buyable).',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'sizeStock',
        fields: [
          defineField({
            name: 'size',
            title: 'Size',
            type: 'string',
            options: {list: SIZE_OPTIONS},
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            initialValue: 0,
            validation: (rule) => rule.required().min(0).integer(),
          }),
        ],
        preview: {
          select: {size: 'size', quantity: 'quantity'},
          prepare({size, quantity}) {
            return {
              title: size ?? 'Size',
              subtitle: quantity > 0 ? `${quantity} in stock` : 'Sold out',
            }
          },
        },
      }),
    ],
    validation: (rule) =>
      rule.custom((stock, context) => {
        const rows = (stock as {size?: string}[] | undefined) ?? []
        const rowSizes = rows.map((r) => r.size).filter(Boolean) as string[]
        const dupes = rowSizes.filter((s, i) => rowSizes.indexOf(s) !== i)
        if (dupes.length) return `Duplicate size: ${[...new Set(dupes)].join(', ')}`
        const sizes = (context.document as {sizes?: string[]} | undefined)?.sizes ?? []
        const stray = rowSizes.filter((s) => !sizes.includes(s))
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
