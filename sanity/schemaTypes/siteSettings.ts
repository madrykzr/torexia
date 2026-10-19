import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // Managed as a singleton via sanity/structure.ts
  fieldsets: [
    {
      name: 'popup',
      title: 'Welcome pop-up (shown when a visitor opens the website)',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      type: 'string',
      description: 'Digits only, including country code — e.g. 60132209408',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'string',
      description: 'Full profile URL or @handle',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'string',
      description: 'Full profile URL or @handle',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'shippingFeeWest',
      title: 'Shipping fee — West Malaysia (RM)',
      type: 'number',
      description:
        'Charged at checkout for the peninsula. Leave blank for free shipping.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'shippingFeeEast',
      title: 'Shipping fee — East Malaysia (RM)',
      type: 'number',
      description:
        'Charged for Sabah, Sarawak and Labuan. Leave blank for free shipping.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'freeShippingAbove',
      title: 'Free shipping for orders above (RM)',
      type: 'number',
      description:
        'Optional — orders with a subtotal at or above this amount ship free. Leave blank to always charge the fee.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'orderAlertEmails',
      title: 'Order alert emails',
      type: 'array',
      description:
        'Everyone here gets an email the moment a customer pays, with the delivery address ready to copy.',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.email()})],
    }),
    defineField({
      name: 'tiktokPixelId',
      title: 'TikTok Pixel ID',
      type: 'string',
      description:
        'From TikTok Ads Manager → Events → Web events. Looks like DB9G56RC77U9F9PBAPRG (20 capital letters and digits). Leave blank to turn the pixel off.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          return /^[A-Z0-9]{10,30}$/.test(value)
            ? true
            : 'A Pixel ID is only capital letters and numbers, with no spaces.'
        }),
    }),
    defineField({
      name: 'metaPixelId',
      title: 'Meta (Facebook / Instagram) Pixel ID',
      type: 'string',
      description:
        'From Meta Events Manager → Data sources → your pixel. A number about 15–16 digits long, for example 28808340982159706. Leave blank to turn the pixel off.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          return /^\d{10,20}$/.test(value)
            ? true
            : 'A Pixel ID is only numbers, with no spaces or letters.'
        }),
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics 4 Measurement ID',
      type: 'string',
      description:
        'From Google Analytics → Admin → Data streams → your website. Starts with G- , for example G-53C8MMXJVG. Leave blank to turn Google Analytics off.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          return /^G-[A-Z0-9]{6,14}$/.test(value)
            ? true
            : 'A Measurement ID starts with G- followed by capital letters and numbers, with no spaces.'
        }),
    }),
    defineField({
      name: 'popupEnabled',
      title: 'Show the welcome pop-up',
      type: 'boolean',
      description:
        'Switch off to hide it everywhere. It appears a moment after the website opens, every time a visitor opens or refreshes it. Closing it hides it until the next refresh. It never shows during checkout.',
      initialValue: true,
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupBadge',
      title: 'Small label on top',
      type: 'string',
      description: 'Leave blank for “Special Offer”.',
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupHeading',
      title: 'Big heading',
      type: 'string',
      description: 'Leave blank for “Free Gift”.',
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupSubheading',
      title: 'Second line',
      type: 'string',
      description: 'Leave blank for “with every purchase!”.',
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupMessage',
      title: 'Message',
      type: 'text',
      rows: 3,
      description: 'Say what the gift is, e.g. “Get a free scarf with every order.”',
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupButtonLabel',
      title: 'Button text',
      type: 'string',
      description: 'Leave blank for “Shop Now”.',
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupButtonHref',
      title: 'Button goes to',
      type: 'string',
      description: 'A page on the site such as /collections, or a full web address. Leave blank for /collections.',
      fieldset: 'popup',
    }),
    defineField({
      name: 'popupSmallPrint',
      title: 'Small print',
      type: 'string',
      description: 'e.g. “While stocks last. Terms & conditions apply.” Leave blank to use that line.',
      fieldset: 'popup',
    }),
    defineField({
      name: 'faqs',
      title: 'Home page — Frequently asked questions',
      type: 'array',
      description:
        'The questions and answers shown at the bottom of the home page. Add, edit, remove or drag to reorder. Leave the list empty to hide the section. Keep the answers the same as your Shipping and Returns policies.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),
    defineField({
      name: 'reviews',
      title: 'Home page — Customer reviews',
      type: 'array',
      description:
        'Only add REAL reviews from real customers, with their permission. Leave the list empty to hide the whole “Loved by our community” section.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Customer name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'location', title: 'Town or city', type: 'string', description: 'Optional, e.g. Shah Alam'}),
            defineField({name: 'text', title: 'Their review', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'name', subtitle: 'text'}},
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
