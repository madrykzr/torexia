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
      name: 'heroSlides',
      title: 'Hero slideshow (the big pictures at the top of the home page)',
      type: 'array',
      description:
        'Add one picture for each slide. The first is shown first, then they change by themselves and visitors can swipe. One picture = no sliding. Drag to reorder. Best: a tall, clear photo with the model on the right side (the words sit on the left). Up to 6 slides. Use the “Hotspot” tool on a picture to choose which part always stays in view on phones.',
      validation: (rule) =>
        rule.max(6).warning('More than 6 slides makes the page slower. Please keep it to 6 or fewer.'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroSlide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'image',
              title: 'Picture',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Describe the picture (for Google and screen readers)',
              type: 'string',
              description: 'e.g. “Woman wearing a burgundy kaftan”',
            }),
            defineField({
              name: 'verticalFocus',
              title: 'Show which part of the picture — up and down',
              type: 'string',
              description:
                'On a wide computer screen only a strip of a tall photo can show. Choose which strip: “Top” shows her face and shoulders, “Middle” the body, “Bottom” the hem and shoes. Leave on Automatic to use the Hotspot tool on the picture, or the top.',
              options: {
                layout: 'radio',
                direction: 'horizontal',
                list: [
                  {title: 'Automatic', value: 'auto'},
                  {title: 'Top', value: 'top'},
                  {title: 'Upper', value: 'upper'},
                  {title: 'Middle', value: 'middle'},
                  {title: 'Lower', value: 'lower'},
                  {title: 'Bottom', value: 'bottom'},
                ],
              },
            }),
            defineField({
              name: 'horizontalFocus',
              title: 'Show which part of the picture — left and right',
              type: 'string',
              description:
                'For phones and narrow screens, which side of the picture stays in view. Leave on Automatic to use the Hotspot tool, or slightly right.',
              options: {
                layout: 'radio',
                direction: 'horizontal',
                list: [
                  {title: 'Automatic', value: 'auto'},
                  {title: 'Left', value: 'left'},
                  {title: 'Center', value: 'center'},
                  {title: 'Right', value: 'right'},
                ],
              },
            }),
            defineField({
              name: 'heading',
              title: 'Heading for this slide (optional)',
              type: 'string',
              description: 'Leave blank to use the main hero heading below.',
            }),
            defineField({
              name: 'subheading',
              title: 'Words under the heading (optional)',
              type: 'text',
              rows: 2,
              description: 'Leave blank to use the main hero subheading below.',
            }),
            defineField({
              name: 'buttonLabel',
              title: 'Button words (optional)',
              type: 'string',
              description: 'Leave blank to use the main hero button below.',
            }),
            defineField({
              name: 'buttonHref',
              title: 'Button goes to (optional)',
              type: 'string',
              description:
                'A page such as /collections/kafla-abaya. Leave blank to use the main hero button link below.',
            }),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'alt', media: 'image'},
            prepare({title, subtitle, media}) {
              return {title: title || subtitle || 'Slide', media}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'heroSlideSeconds',
      title: 'Seconds each slide stays',
      type: 'number',
      description: 'How long each slide shows before the next one. Between 3 and 15. Leave blank for 6.',
      validation: (rule) => rule.min(3).max(15),
    }),
    defineField({
      // Old single hero picture. Hidden: the slideshow above replaces it. Kept
      // as a fallback so the page still has a picture if the slideshow is empty.
      name: 'heroImage',
      title: 'Hero image (old — use the slideshow above)',
      type: 'image',
      hidden: true,
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'heroHeading',
      title: 'Main hero heading (used when a slide has none)',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Main hero subheading (used when a slide has none)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Main hero button words (used when a slide has none)',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Main hero button link (used when a slide has none)',
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
