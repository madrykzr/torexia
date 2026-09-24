import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  SparklesIcon,
  HomeIcon,
  TagIcon,
  FolderIcon,
  PackageIcon,
} from '@sanity/icons'

// Collection Items, grouped Category -> Collection -> Items, so colourways
// from different product lines (e.g. Jubah Linea vs Jubah Saira vs Kafla)
// never show interleaved in one flat list. Categories are live documents
// (client-managed — add one anytime, no code needed), so this list is built
// dynamically from whatever exists right now rather than a hardcoded array.
function collectionItemsByCategory(
  S: StructureBuilder,
  categories: {_id: string; title: string}[],
) {
  return S.list()
    .title('Collection Items')
    .items(
      categories.map(({_id, title}) =>
        S.listItem()
          .title(title)
          .child(
            S.documentList()
              .title(`${title} collections`)
              .schemaType('collection')
              .filter('_type == "collection" && category._ref == $categoryId')
              .params({categoryId: _id})
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
      // Orders — checked daily, so it sits right up top.
      S.listItem()
        .title('Orders')
        .icon(PackageIcon)
        .child(
          S.documentList()
            .title('Orders')
            .schemaType('order')
            .filter('_type == "order"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
      S.divider(),
      // Categories are their own top-level section (like Collections) so the
      // client has an explicit place to add/rename/reorder them — not just an
      // implicit "+ Create new" tucked inside a collection's reference field.
      S.documentTypeListItem('category').title('Categories').icon(FolderIcon),
      S.documentTypeListItem('collection').title('Collections').icon(SparklesIcon),
      S.listItem()
        .title('Collection Items')
        .icon(TagIcon)
        .child(async () => {
          const client = context.getClient({apiVersion: '2026-07-04'})
          const categories = await client.fetch<{_id: string; title: string}[]>(
            `*[_type == "category"] | order(order asc, title asc){_id, title}`,
          )
          return collectionItemsByCategory(S, categories)
        }),
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
