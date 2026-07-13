import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {COLOUR_OPTIONS, SIZE_OPTIONS} from './product'

// Rental categories offered for the /rent section.
export const RENTAL_CATEGORY_OPTIONS = [
  {title: 'Premium Abaya', value: 'Premium Abaya'},
  {title: 'Kaftan', value: 'Kaftan'},
  {title: 'Accessories', value: 'Accessories'},
]

export const rentalProduct = defineType({
  name: 'rentalProduct',
  title: 'Rental Product',
  type: 'document',
  icon: CalendarIcon,
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
      initialValue: 'Cotton Nida',
    }),
    defineField({
      name: 'rentalPricePerDay',
      title: 'Rental price per day (RM)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'deposit',
      title: 'Deposit (RM)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
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
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Toggle off to hide this piece from the rental listing.',
      initialValue: true,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: RENTAL_CATEGORY_OPTIONS, layout: 'dropdown'},
    }),
  ],
  preview: {
    select: {title: 'name', price: 'rentalPricePerDay', media: 'images.0'},
    prepare({title, price, media}) {
      return {
        title,
        subtitle: typeof price === 'number' ? `RM${price}/day` : 'No price',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Rental price, low to high',
      name: 'rentalPriceAsc',
      by: [{field: 'rentalPricePerDay', direction: 'asc'}],
    },
    {
      title: 'Name, A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
