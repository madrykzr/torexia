import {type SchemaTypeDefinition} from 'sanity'

import {product} from './product'
import {rentalProduct} from './rentalProduct'
import {blogPost} from './blogPost'
import {siteSettings} from './siteSettings'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [product, rentalProduct, blogPost, siteSettings],
}
