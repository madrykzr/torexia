import {defineType, defineField} from 'sanity'
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
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
