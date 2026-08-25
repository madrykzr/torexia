import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { COLOURS } from "@/data/products";
import type {
  BlogPost,
  Collection,
  CollectionItem,
  Colour,
  HomePage,
  Product,
  RentalProduct,
  SearchEntry,
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

/** Slugify a free-typed colour name for use as a React key / aria value. */
function slugifyColourName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Collections store colours as free-form {name, hex} objects (owner-editable
 * in Studio), not the fixed slug list products/rentalProducts use. */
function mapCollectionColours(
  raw: { name?: string; hex?: string }[] = [],
): Colour[] {
  return raw
    .filter((c) => c?.name && c?.hex)
    .map((c) => ({
      name: c.name!,
      slug: slugifyColourName(c.name!),
      hex: c.hex!,
    }));
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
  salePrice?: number;
  coverImage?: unknown;
  gallery?: unknown[];
  colours?: { name?: string; hex?: string }[];
  sizes?: string[];
  fabric?: string;
  sizeChartCol1Label?: string;
  sizeChartCol2Label?: string;
  sizeChart?: { label?: string; col1?: string; col2?: string }[];
  sizeChartNote?: string;
  description?: string;
  order?: number;
};

function mapCollection(raw: RawCollection): Collection {
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    category: raw.category ?? "",
    price: typeof raw.price === "number" ? raw.price : null,
    salePrice: typeof raw.salePrice === "number" ? raw.salePrice : null,
    cover: imageUrl(raw.coverImage) ?? "/images/og.jpg",
    gallery: (raw.gallery ?? [])
      .map((g) => imageUrl(g))
      .filter((u): u is string => Boolean(u)),
    colours: mapCollectionColours(raw.colours),
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
    order: typeof raw.order === "number" ? raw.order : 100,
  };
}

type RawCollectionItem = {
  id: string;
  name: string;
  slug: string | null;
  collectionSlug: string | null;
  colour?: { name?: string; hex?: string };
  sizes?: string[];
  images?: unknown[];
  price?: number;
  salePrice?: number;
  sizeChartCol1Label?: string;
  sizeChartCol2Label?: string;
  sizeChart?: { label?: string; col1?: string; col2?: string }[];
  sizeChartNote?: string;
  description?: string;
};

function mapCollectionItem(raw: RawCollectionItem): CollectionItem {
  const [colour] = mapCollectionColours(raw.colour ? [raw.colour] : []);
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    collectionSlug: raw.collectionSlug ?? "",
    colour: colour ?? { name: "", slug: "", hex: "#000000" },
    sizes: (raw.sizes ?? []) as Size[],
    images: (raw.images ?? [])
      .map((img) => imageUrl(img))
      .filter((u): u is string => Boolean(u)),
    price: typeof raw.price === "number" ? raw.price : null,
    salePrice: typeof raw.salePrice === "number" ? raw.salePrice : null,
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
  "id": _id, name, "slug": slug.current, category, price, salePrice,
  coverImage, gallery, colours, sizes, fabric,
  sizeChartCol1Label, sizeChartCol2Label, sizeChart, sizeChartNote,
  description, order
`;

export async function getAllCollections(): Promise<Collection[]> {
  const raw = await query<RawCollection[]>(
    `*[_type == "collection" && defined(slug.current)] | order(order asc, name asc){${COLLECTION_FIELDS}}`,
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

// --- Collection items (per-colourway pages) -------------------------------

const COLLECTION_ITEM_FIELDS = `
  "id": _id, name, "slug": slug.current,
  "collectionSlug": collection->slug.current,
  colour, sizes, price, salePrice,
  sizeChartCol1Label, sizeChartCol2Label, sizeChart, sizeChartNote,
  description, images
`;

export async function getCollectionItemsByCollectionSlug(
  collectionSlug: string,
): Promise<CollectionItem[]> {
  const raw = await query<RawCollectionItem[]>(
    `*[_type == "collectionItem" && collection->slug.current == $collectionSlug && defined(slug.current)] | order(orderRank asc){${COLLECTION_ITEM_FIELDS}}`,
    { collectionSlug },
  );
  return raw.map(mapCollectionItem);
}

export async function getCollectionItemBySlug(
  collectionSlug: string,
  itemSlug: string,
): Promise<CollectionItem | null> {
  const raw = await query<RawCollectionItem | null>(
    `*[_type == "collectionItem" && collection->slug.current == $collectionSlug && slug.current == $itemSlug][0]{${COLLECTION_ITEM_FIELDS}}`,
    { collectionSlug, itemSlug },
  );
  return raw ? mapCollectionItem(raw) : null;
}

export async function getCollectionItemSlugPairs(): Promise<
  { slug: string; itemSlug: string }[]
> {
  return query<{ slug: string; itemSlug: string }[]>(
    `*[_type == "collectionItem" && defined(slug.current) && defined(collection->slug.current)]{
      "slug": collection->slug.current, "itemSlug": slug.current
    }`,
  );
}

// --- Search --------------------------------------------------------------

type RawSearchCollection = {
  name: string;
  slug: string | null;
  category?: string;
  coverImage?: unknown;
};
type RawSearchItem = {
  name: string;
  slug: string | null;
  collectionSlug: string | null;
  image?: unknown;
};

/**
 * A flat, lightweight index of everything shoppable (individual items first,
 * then collections) — powers the navbar search. Filtered client-side.
 */
export async function getSearchIndex(): Promise<SearchEntry[]> {
  const [collections, items] = await Promise.all([
    query<RawSearchCollection[]>(
      `*[_type == "collection" && defined(slug.current)] | order(order asc, name asc){
        name, "slug": slug.current, category, coverImage
      }`,
    ),
    query<RawSearchItem[]>(
      `*[_type == "collectionItem" && defined(slug.current) && defined(collection->slug.current)] | order(orderRank asc){
        name, "slug": slug.current, "collectionSlug": collection->slug.current, "image": images[0]
      }`,
    ),
  ]);

  const itemEntries: SearchEntry[] = items
    .filter((i) => i.slug && i.collectionSlug)
    .map((i) => ({
      name: i.name,
      href: `/collections/${i.collectionSlug}/${i.slug}`,
      image: imageUrl(i.image, 200) ?? "/images/og.jpg",
      category: "Product",
    }));

  const collectionEntries: SearchEntry[] = collections
    .filter((c) => c.slug)
    .map((c) => ({
      name: c.name,
      href: `/collections/${c.slug}`,
      image: imageUrl(c.coverImage, 200) ?? "/images/og.jpg",
      category: c.category
        ? c.category.charAt(0).toUpperCase() + c.category.slice(1)
        : "Collection",
    }));

  return [...itemEntries, ...collectionEntries];
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
