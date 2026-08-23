import type { PortableTextBlock } from "@portabletext/types";

export type Size = "S" | "M" | "L" | "XL";

export type Colour = {
  name: string;
  slug: string;
  /** Representative swatch colour (approximate fabric tone) */
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Price in Malaysian Ringgit */
  price: number;
  fabric: string;
  description: string;
  colours: Colour[];
  sizes: Size[];
  /** Resolved image URLs (Sanity CDN), ordered */
  images: string[];
  featured: boolean;
  /** Collection slug, e.g. "daily-abaya" (empty when untagged) */
  collection: string;
};

export type SizeChartRow = {
  label: string;
  col1: string;
  col2: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  /** kaftan | jubah | abaya */
  category: string;
  /** Price in RM, or null when "on enquiry" */
  price: number | null;
  /** Discounted price in RM, or null when not on sale */
  salePrice: number | null;
  /** Resolved cover image URL */
  cover: string;
  /** Resolved gallery image URLs */
  gallery: string[];
  colours: Colour[];
  sizes: Size[];
  fabric: string;
  /** Size-chart column headers and measurement rows (inches) */
  sizeChartCol1Label: string;
  sizeChartCol2Label: string;
  sizeChart: SizeChartRow[];
  sizeChartNote: string | null;
  description: string;
  featuredOnHome: boolean;
  order: number;
};

export type CollectionItem = {
  id: string;
  slug: string;
  name: string;
  /** Parent collection's slug, e.g. "kaftan" */
  collectionSlug: string;
  colour: Colour;
  sizes: Size[];
  /** Resolved image URLs (Sanity CDN), ordered */
  images: string[];
  /** Price in RM, or null to inherit the parent collection's price */
  price: number | null;
  /** Discounted price in RM, or null when not on sale */
  salePrice: number | null;
  description: string;
  order: number;
};

/** A flat, searchable entry — a collection or an individual item. */
export type SearchEntry = {
  name: string;
  href: string;
  image: string;
  category: string;
};

export type HomePage = {
  heroImage: string | null;
  heroHeading: string | null;
  heroSubheading: string | null;
  heroCtaLabel: string;
  heroCtaHref: string;
  featuredCollections: Collection[];
  promoEnabled: boolean;
  promoText: string | null;
  promoHref: string | null;
};

export type RentalProduct = {
  id: string;
  slug: string;
  name: string;
  /** Rental price per day in Malaysian Ringgit */
  rentalPricePerDay: number;
  /** Refundable deposit in Malaysian Ringgit */
  deposit: number;
  fabric: string;
  description: string;
  colours: Colour[];
  sizes: Size[];
  /** Resolved image URLs (Sanity CDN), ordered */
  images: string[];
  /** When false, hidden from the rental listing */
  available: boolean;
  /** Premium Abaya | Kaftan | Accessories */
  category: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  /** ISO date string (publishedAt) */
  date: string;
  excerpt: string;
  /** Resolved cover image URL */
  cover: string;
  /** Estimated read time label, e.g. "4 min read" */
  readTime: string;
  /** Portable Text body (only populated on the single-post query) */
  body: PortableTextBlock[];
};

export type SiteSettings = {
  whatsapp: string;
  instagram: string;
  tiktok: string;
  email: string;
  phone: string;
};
