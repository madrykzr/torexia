import type {StructureResolver} from 'sanity/structure'
import {CogIcon, TagIcon, DocumentTextIcon} from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('product').title('Products').icon(TagIcon),
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
