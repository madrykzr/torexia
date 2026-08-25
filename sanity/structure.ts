import type {StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  SparklesIcon,
  HomeIcon,
  TagIcon,
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
      S.documentTypeListItem('collectionItem').title('Collection Items').icon(TagIcon),
      // "Products" (individual abaya SKUs) is retired — Abaya is now a single
      // collection like Kaftan/Jubah. The `product` schema type stays
      // registered (so any lingering documents don't error in Studio) but is
      // no longer listed here.
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
