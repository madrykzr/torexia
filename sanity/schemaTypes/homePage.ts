import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'

// Phase-1 homepage editing: hero + featured collections + promo banner.
// (A full, reorderable section builder is a planned later upgrade.)
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  // Managed as a singleton via sanity/structure.ts
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero button label',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Hero button link',
      type: 'string',
      initialValue: '/collections',
    }),
    defineField({
      name: 'featuredCollections',
      title: 'Featured collections',
      type: 'array',
      description: 'Collections shown in the homepage “Shop by collection” row.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'collection'}]})],
    }),
    defineField({
      name: 'newArrivals',
      title: 'New arrivals',
      type: 'array',
      description:
        'Garment photos shown in the homepage "New Arrivals" section, directly below "Shop by collection". Pick specific colourway items (each already has its own photo set) as new pieces launch.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'collectionItem'}]})],
    }),
    defineField({
      name: 'promoEnabled',
      title: 'Show promo banner',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'promoText',
      title: 'Promo text',
      type: 'string',
    }),
    defineField({
      name: 'promoHref',
      title: 'Promo link',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
