import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { COLOURS } from "@/data/products";
import type {
  BlogPost,
  Colour,
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
