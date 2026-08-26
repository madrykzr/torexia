import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  SparklesIcon,
  HomeIcon,
  TagIcon,
} from '@sanity/icons'
import {CATEGORY_OPTIONS} from './schemaTypes/collection'

// Collection Items, grouped Category -> Collection -> Items, so colourways
// from different product lines (e.g. Jubah Linea vs Jubah Saira vs Kafla)
// never show interleaved in one flat list.
function collectionItemsByCategory(S: StructureBuilder) {
  return S.list()
    .title('Collection Items')
    .items(
      CATEGORY_OPTIONS.map(({title, value}) =>
        S.listItem()
          .title(title)
          .child(
            S.documentList()
              .title(`${title} collections`)
              .schemaType('collection')
              .filter('_type == "collection" && category == $category')
              .params({category: value})
              .defaultOrdering([{field: 'order', direction: 'asc'}])
              .child((collectionId) =>
                S.documentList()
                  .title('Items')
                  .schemaType('collectionItem')
                  .filter(
                    '_type == "collectionItem" && collection._ref == $collectionId',
                  )
                  .params({collectionId})
                  .defaultOrdering([{field: 'order', direction: 'asc'}]),
              ),
          ),
      ),
    )
}

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
      S.listItem()
        .title('Collection Items')
        .icon(TagIcon)
        .child(collectionItemsByCategory(S)),
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
