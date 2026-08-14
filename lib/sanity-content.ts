import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { COLOURS } from "@/data/products";
import type {
  BlogPost,
  Collection,
  Colour,
  HomePage,
  Product,
  RentalProduct,
  Size,
  SiteSettings,
} from "@/lib/types";

const REVALIDATE = 60; // ISR: published content appears within ~60s

function query<T>(q: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(q, params, { next: { revalidate: REVALIDATE } });
}

// --- Raw Sanity shapes ---------------------------------------------------

type RawProduct = {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  fabric?: string;
  description?: string;
  colours?: string[];
  sizes?: string[];
  images?: unknown[];
  featured?: boolean;
  collection?: string;
};

type RawRentalProduct = {
  id: string;
  name: string;
  slug: string | null;
  rentalPricePerDay?: number;
  deposit?: number;
  fabric?: string;
  description?: string;
  colours?: string[];
  sizes?: string[];
  images?: unknown[];
  available?: boolean;
  category?: string;
};

type RawPost = {
  id: string;
  title: string;
  slug: string | null;
  date?: string;
  excerpt?: string;
  mainImage?: unknown;
  words?: number;
  body?: PortableTextBlock[];
};

// --- Mappers -------------------------------------------------------------

function imageUrl(source: unknown, width = 1200): string | null {
  if (!source || typeof source !== "object" || !("asset" in source)) return null;
  try {
    return urlFor(source as never)
      .width(width)
      .quality(80)
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

function mapColours(slugs: string[] = []): Colour[] {
  return slugs.map((s) => COLOURS[s]).filter(Boolean);
}

function mapProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    price: raw.price ?? 0,
    fabric: raw.fabric ?? "Cotton Nida",
    description: raw.description ?? "",
    colours: mapColours(raw.colours),
    sizes: (raw.sizes ?? []) as Size[],
    images: (raw.images ?? [])
      .map((img) => imageUrl(img))
      .filter((u): u is string => Boolean(u)),
    featured: Boolean(raw.featured),
    collection: raw.collection ?? "",
  };
}

type RawCollection = {
  id: string;
  name: string;
  slug: string | null;
  category?: string;
  price?: number;
  coverImage?: unknown;
  gallery?: unknown[];
  colours?: string[];
  sizes?: string[];
  fabric?: string;
  sizeChartCol1Label?: string;
  sizeChartCol2Label?: string;
  sizeChart?: { label?: string; col1?: string; col2?: string }[];
  sizeChartNote?: string;
  description?: string;
  featuredOnHome?: boolean;
  order?: number;
};

function mapCollection(raw: RawCollection): Collection {
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    category: raw.category ?? "",
    price: typeof raw.price === "number" ? raw.price : null,
    cover: imageUrl(raw.coverImage) ?? "/images/og.jpg",
    gallery: (raw.gallery ?? [])
      .map((g) => imageUrl(g))
      .filter((u): u is string => Boolean(u)),
    colours: mapColours(raw.colours),
    sizes: (raw.sizes ?? []) as Size[],
    fabric: raw.fabric ?? "",
    sizeChartCol1Label: raw.sizeChartCol1Label ?? "S / M",
    sizeChartCol2Label: raw.sizeChartCol2Label ?? "L / XL",
    sizeChart: (raw.sizeChart ?? [])
      .filter((r) => r?.label)
      .map((r) => ({
        label: r.label ?? "",
        col1: r.col1 ?? "",
        col2: r.col2 ?? "",
      })),
    sizeChartNote: raw.sizeChartNote ?? null,
    description: raw.description ?? "",
    featuredOnHome: Boolean(raw.featuredOnHome),
    order: typeof raw.order === "number" ? raw.order : 100,
  };
}

function mapRentalProduct(raw: RawRentalProduct): RentalProduct {
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    rentalPricePerDay: raw.rentalPricePerDay ?? 0,
    deposit: raw.deposit ?? 0,
    fabric: raw.fabric ?? "Cotton Nida",
    description: raw.description ?? "",
    colours: mapColours(raw.colours),
    sizes: (raw.sizes ?? []) as Size[],
    images: (raw.images ?? [])
      .map((img) => imageUrl(img))
      .filter((u): u is string => Boolean(u)),
    available: Boolean(raw.available),
    category: raw.category ?? "",
  };
}

function readTime(words = 0): string {
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function mapPost(raw: RawPost): BlogPost {
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    title: raw.title,
    date: raw.date ?? new Date().toISOString(),
    excerpt: raw.excerpt ?? "",
    cover: imageUrl(raw.mainImage) ?? "/images/og.jpg",
    readTime: readTime(raw.words),
    body: raw.body ?? [],
  };
}

// --- Products ------------------------------------------------------------

const PRODUCT_FIELDS = `
  "id": _id, name, "slug": slug.current, price, fabric, description,
  colours, sizes, featured, collection, images
`;

export async function getAllProducts(): Promise<Product[]> {
  const raw = await query<RawProduct[]>(
    `*[_type == "product" && defined(slug.current)] | order(featured desc, name asc){${PRODUCT_FIELDS}}`,
  );
  return raw.map(mapProduct);
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const raw = await query<RawProduct[]>(
    `*[_type == "product" && featured == true && defined(slug.current)] | order(name asc){${PRODUCT_FIELDS}}`,
  );
  return raw.slice(0, limit).map(mapProduct);
}

export async function getNewArrivals(limit = 3): Promise<Product[]> {
  const raw = await query<RawProduct[]>(
    `*[_type == "product" && defined(slug.current)] | order(_createdAt desc){${PRODUCT_FIELDS}}`,
  );
  return raw.slice(0, limit).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const raw = await query<RawProduct | null>(
    `*[_type == "product" && slug.current == $slug][0]{${PRODUCT_FIELDS}}`,
    { slug },
  );
  return raw ? mapProduct(raw) : null;
}

export async function getRelatedProducts(
  slug: string,
  limit = 3,
): Promise<Product[]> {
  const raw = await query<RawProduct[]>(
    `*[_type == "product" && slug.current != $slug && defined(slug.current)] | order(name asc){${PRODUCT_FIELDS}}`,
    { slug },
  );
  return raw.slice(0, limit).map(mapProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  return query<string[]>(
    `*[_type == "product" && defined(slug.current)].slug.current`,
  );
}

// --- Rental products -----------------------------------------------------

const RENTAL_FIELDS = `
  "id": _id, name, "slug": slug.current, rentalPricePerDay, deposit, fabric,
  description, colours, sizes, available, category, images
`;

export async function getAllRentalProducts(): Promise<RentalProduct[]> {
  const raw = await query<RawRentalProduct[]>(
    `*[_type == "rentalProduct" && available == true && defined(slug.current)] | order(name asc){${RENTAL_FIELDS}}`,
  );
  return raw.map(mapRentalProduct);
}

export async function getRentalProductBySlug(
  slug: string,
): Promise<RentalProduct | null> {
  const raw = await query<RawRentalProduct | null>(
    `*[_type == "rentalProduct" && slug.current == $slug][0]{${RENTAL_FIELDS}}`,
    { slug },
  );
  return raw ? mapRentalProduct(raw) : null;
}

export async function getRentalProductSlugs(): Promise<string[]> {
  return query<string[]>(
    `*[_type == "rentalProduct" && defined(slug.current)].slug.current`,
  );
}

// --- Collections ---------------------------------------------------------

const COLLECTION_FIELDS = `
  "id": _id, name, "slug": slug.current, category, price,
  coverImage, gallery, colours, sizes, fabric,
  sizeChartCol1Label, sizeChartCol2Label, sizeChart, sizeChartNote,
  description, featuredOnHome, order
`;

export async function getAllCollections(): Promise<Collection[]> {
  const raw = await query<RawCollection[]>(
    `*[_type == "collection" && defined(slug.current)] | order(order asc, name asc){${COLLECTION_FIELDS}}`,
  );
  return raw.map(mapCollection);
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  const raw = await query<RawCollection[]>(
    `*[_type == "collection" && featuredOnHome == true && defined(slug.current)] | order(order asc, name asc){${COLLECTION_FIELDS}}`,
  );
  return raw.map(mapCollection);
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  const raw = await query<RawCollection | null>(
    `*[_type == "collection" && slug.current == $slug][0]{${COLLECTION_FIELDS}}`,
    { slug },
  );
  return raw ? mapCollection(raw) : null;
}

export async function getCollectionSlugs(): Promise<string[]> {
  return query<string[]>(
    `*[_type == "collection" && defined(slug.current)].slug.current`,
  );
}

// --- Home page -----------------------------------------------------------

type RawHomePage = {
  heroImage?: unknown;
  heroHeading?: string;
  heroSubheading?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  featuredCollections?: RawCollection[];
  promoEnabled?: boolean;
  promoText?: string;
  promoHref?: string;
} | null;

export async function getHomePage(): Promise<HomePage | null> {
  const raw = await query<RawHomePage>(
    `*[_type == "homePage"][0]{
      heroImage, heroHeading, heroSubheading, heroCtaLabel, heroCtaHref,
      "featuredCollections": featuredCollections[]->{${COLLECTION_FIELDS}},
      promoEnabled, promoText, promoHref
    }`,
  );
  if (!raw) return null;
  return {
    heroImage: imageUrl(raw.heroImage),
    heroHeading: raw.heroHeading ?? null,
    heroSubheading: raw.heroSubheading ?? null,
    heroCtaLabel: raw.heroCtaLabel ?? "Shop Now",
    heroCtaHref: raw.heroCtaHref ?? "/collections",
    featuredCollections: (raw.featuredCollections ?? []).map(mapCollection),
    promoEnabled: Boolean(raw.promoEnabled),
    promoText: raw.promoText ?? null,
    promoHref: raw.promoHref ?? null,
  };
}

// --- Blog ----------------------------------------------------------------

const POST_LIST_FIELDS = `
  "id": _id, title, "slug": slug.current, "date": publishedAt, excerpt, mainImage,
  "words": length(string::split(pt::text(body), " "))
`;

export async function getAllPosts(): Promise<BlogPost[]> {
  const raw = await query<RawPost[]>(
    `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){${POST_LIST_FIELDS}}`,
  );
  return raw.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const raw = await query<RawPost | null>(
    `*[_type == "blogPost" && slug.current == $slug][0]{${POST_LIST_FIELDS}, body}`,
    { slug },
  );
  return raw ? mapPost(raw) : null;
}

export async function getPostSlugs(): Promise<string[]> {
  return query<string[]>(
    `*[_type == "blogPost" && defined(slug.current)].slug.current`,
  );
}

// --- Site settings -------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return query<SiteSettings | null>(
    `*[_type == "siteSettings"][0]{whatsapp, instagram, tiktok, email, phone}`,
  );
}
