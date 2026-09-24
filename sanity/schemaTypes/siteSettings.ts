import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // Managed as a singleton via sanity/structure.ts
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
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
