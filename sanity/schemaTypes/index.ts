import {type SchemaTypeDefinition} from 'sanity'

import {product} from './product'
import {blogPost} from './blogPost'
import {siteSettings} from './siteSettings'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [product, blogPost, siteSettings],
}
