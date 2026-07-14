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
