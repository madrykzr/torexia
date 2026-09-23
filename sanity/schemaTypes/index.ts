import {type SchemaTypeDefinition} from 'sanity'

import {category} from './category'
import {collection} from './collection'
import {collectionItem} from './collectionItem'
import {homePage} from './homePage'
import {order} from './order'
import {product} from './product'
import {rentalProduct} from './rentalProduct'
import {blogPost} from './blogPost'
import {siteSettings} from './siteSettings'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    category,
    collection,
    collectionItem,
    order,
    product,
    rentalProduct,
    blogPost,
    homePage,
    siteSettings,
  ],
}
