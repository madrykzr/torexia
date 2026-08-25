import type {StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  SparklesIcon,
  HomeIcon,
  TagIcon,
} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
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
      // Clicking a Collection drills into that collection's own doc plus a
      // drag-to-reorder list of its Items — reordering only ever makes sense
      // within one collection, so items are scoped here rather than a flat
      // cross-collection list.
      S.documentTypeListItem('collection')
        .title('Collections')
        .icon(SparklesIcon)
        .child((collectionId) =>
          S.list()
            .title('Collection')
            .items([
              S.listItem()
                .title('Edit Collection')
                .icon(SparklesIcon)
                .child(
                  S.document().schemaType('collection').documentId(collectionId),
                ),
              orderableDocumentListDeskItem({
                type: 'collectionItem',
                title: 'Items — drag to reorder',
                icon: TagIcon,
                filter: 'collection._ref == $collectionId',
                params: {collectionId},
                context,
                S,
              }),
            ]),
        ),
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
