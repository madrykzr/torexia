/**
 * ARCHIVED — not used by the live site.
 *
 * When Torexia moved to a collection-first model (Kaftan / Jubah / Abaya
 * lookbook `collection` documents in Sanity), the old placeholder taxonomy was
 * retired. It's kept here so it can be brought back quickly if a category
 * becomes ready.
 *
 * Removed:
 * - The string `collection` dropdown on the `product` schema (COLLECTION_OPTIONS).
 * - The hardcoded "Shop by collection" cards in components/shop/Collections.tsx
 *   (now driven by CMS `collection` documents / featured collections).
 * - The /shop collection filter tabs (ShopBrowser / ShopWithCollections) — /shop
 *   now redirects to /collections; those components remain in git history.
 */

/** Old product-collection dropdown options (slug taxonomy). */
export const ARCHIVED_COLLECTION_OPTIONS = [
  {title: 'Daily Abaya', value: 'daily-abaya'},
  {title: 'Premium Abaya', value: 'premium-abaya'},
  {title: 'Luxury', value: 'luxury'},
  {title: 'Plus Size', value: 'plus-size'},
  {title: 'Kaftan', value: 'kaftan'},
  {title: 'Hijab', value: 'hijab'},
  {title: 'Accessories', value: 'accessories'},
] as const;

/**
 * Old hardcoded homepage "Shop by collection" cards (name + copy). The two
 * "coming soon" categories (Hijabs, Accessories) can return as real `collection`
 * documents when their photography is ready.
 */
export const ARCHIVED_HOME_COLLECTION_CARDS = [
  {name: 'Daily Abaya', description: 'Designed for everyday comfort and ease.'},
  {
    name: 'Premium Abaya',
    description: 'Elevated designs with refined details and premium materials.',
  },
  {name: 'Luxury Collections', description: 'Exclusive pieces for special occasions.'},
  {
    name: 'Plus Size Collections',
    description: 'Thoughtfully designed for comfort, fit and confidence.',
  },
  {name: 'Kaftans', description: 'Coming Soon', comingSoon: true},
  {name: 'Hijabs', description: 'Coming Soon', comingSoon: true},
  {
    name: 'Accessories',
    description: 'Including scrunchies. Coming Soon.',
    comingSoon: true,
  },
] as const;
