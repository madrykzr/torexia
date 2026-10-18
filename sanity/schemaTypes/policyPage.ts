import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

// Legal/info pages shown in the footer (Privacy, Terms, Shipping, Returns…).
// A page appears on the website — and gets a footer link — only once it is
// published, so a draft can be reviewed in Studio without anyone seeing it.
export const policyPage = defineType({
  name: 'policyPage',
  title: 'Policy Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. “Privacy Policy”. This is the footer link text.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description: 'Click Generate — don’t type it. The page will be at ladytorexia.my/policies/…',
      options: {source: 'title', maxLength: 60},
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
              ? true
              : 'Use only lowercase letters, numbers and dashes — click Generate.',
          ),
    }),
    defineField({
      name: 'order',
      title: 'Order in the footer',
      type: 'number',
      description: 'Lower numbers come first.',
      initialValue: 100,
    }),
    defineField({
      name: 'updated',
      title: 'Last updated',
      type: 'date',
      description: 'Shown at the top of the page.',
    }),
    defineField({
      name: 'body',
      title: 'Page text',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Sub-heading', value: 'h3'},
          ],
          lists: [
            {title: 'Bullet list', value: 'bullet'},
            {title: 'Numbered list', value: 'number'},
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {title: 'Footer order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
