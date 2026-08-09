import type {StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  TagIcon,
  DocumentTextIcon,
  CalendarIcon,
  SparklesIcon,
  HomeIcon,
} from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Home Page as a singleton (one editable document)
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.documentTypeListItem('collection').title('Collections').icon(SparklesIcon),
      S.documentTypeListItem('product').title('Products').icon(TagIcon),
      // Rental Products are managed independently from Products (for /rent).
      S.documentTypeListItem('rentalProduct')
        .title('Rental Products')
        .icon(CalendarIcon),
      S.documentTypeListItem('blogPost').title('Blog Posts').icon(DocumentTextIcon),
      S.divider(),
      // Site Settings as a singleton (one editable document)
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
    ])
