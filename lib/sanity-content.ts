import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { COLOURS } from "@/data/products";
import type { ShippingSettings } from "@/lib/shipping";
import { isFullySoldOut } from "@/lib/stock";
import type {
  BlogPost,
  Collection,
  CollectionItem,
  Colour,
  HeroSlide,
  HomePage,
  Product,
  RentalProduct,
  SearchEntry,
  Size,
  SiteSettings,
  SizeChartRow,
  SizeStock,
} from "@/lib/types";
import { ALL_SIZES } from "@/lib/types";
import { heroObjectPosition } from "@/lib/hero-position";

// ISR safety net only: the Sanity webhook revalidates within seconds of a
// publish, so a long window here just cuts needless background regeneration.
const REVALIDATE = 21600;

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

function mapColours(slugs: string[] | null | undefined): Colour[] {
  return (slugs ?? []).map((s) => COLOURS[s]).filter(Boolean);
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
  raw: { name?: string; hex?: string }[] | null | undefined,
): Colour[] {
  // GROQ returns null (not undefined) for a field the document never set —
  // a default parameter alone doesn't catch that, so normalize explicitly.
  return (raw ?? [])
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

type RawSizeChartRow = { label?: string; values?: string[] };

function mapSizeChart(raw: RawSizeChartRow[] | undefined): SizeChartRow[] {
  return (raw ?? [])
    .filter((r) => r?.label)
    .map((r) => ({ label: r.label ?? "", values: r.values ?? [] }));
}

type RawSizeStock = { size?: string; quantity?: number };

function mapStock(raw: RawSizeStock[] | undefined): SizeStock[] {
  return (raw ?? [])
    .filter((r): r is Required<RawSizeStock> =>
      Boolean(r?.size && ALL_SIZES.includes(r.size as Size)),
    )
    .map((r) => ({ size: r.size as Size, quantity: Math.max(0, r.quantity ?? 0) }));
}

type RawCollection = {
  id: string;
  name: string;
  slug: string | null;
  category?: { title?: string; slug?: string };
  price?: number;
  salePrice?: number;
  coverImage?: unknown;
  gallery?: unknown[];
  colours?: { name?: string; hex?: string }[];
  sizes?: string[];
  stock?: RawSizeStock[];
  // Lightweight projection of this collection's colourway items, fetched only
  // to decide the aggregate "Sold Out" badge — a collection with items is
  // fully sold out when every one of them is, regardless of its own
  // (otherwise-unused) sizes/stock fields.
  items?: { stock?: RawSizeStock[] }[];
  fabric?: string;
  sizeChartColumns?: string[];
  sizeChart?: RawSizeChartRow[];
  sizeChartNote?: string;
  description?: string;
  order?: number;
};

function mapCollection(raw: RawCollection): Collection {
  const items = raw.items ?? [];
  const soldOut =
    items.length > 0
      ? items.every((i) => isFullySoldOut((raw.sizes ?? []) as Size[], mapStock(i.stock)))
      : isFullySoldOut((raw.sizes ?? []) as Size[], mapStock(raw.stock));
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    category: {
      title: raw.category?.title ?? "",
      slug: raw.category?.slug ?? "",
    },
    price: typeof raw.price === "number" ? raw.price : null,
    salePrice: typeof raw.salePrice === "number" ? raw.salePrice : null,
    cover: imageUrl(raw.coverImage) ?? "/images/og.jpg",
    gallery: (raw.gallery ?? [])
      .map((g) => imageUrl(g))
      .filter((u): u is string => Boolean(u)),
    colours: mapCollectionColours(raw.colours),
    sizes: (raw.sizes ?? []) as Size[],
    stock: mapStock(raw.stock),
    soldOut,
    fabric: raw.fabric ?? "",
    sizeChartColumns: raw.sizeChartColumns ?? [],
    sizeChart: mapSizeChart(raw.sizeChart),
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
  /** Sizes come from the parent collection — the colourway has none of its own */
  collectionSizes?: string[];
  stock?: RawSizeStock[];
  images?: unknown[];
  sizeChartColumns?: string[];
  sizeChart?: RawSizeChartRow[];
  sizeChartNote?: string;
  description?: string;
  order?: number;
};

function mapCollectionItem(raw: RawCollectionItem): CollectionItem {
  const [colour] = mapCollectionColours(raw.colour ? [raw.colour] : []);
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    collectionSlug: raw.collectionSlug ?? "",
    colour: colour ?? { name: "", slug: "", hex: "#000000" },
    sizes: (raw.collectionSizes ?? []) as Size[],
    stock: mapStock(raw.stock),
    soldOut: isFullySoldOut((raw.collectionSizes ?? []) as Size[], mapStock(raw.stock)),
    // De-duplicated: the same photo added twice in Studio would otherwise show
    // twice in the gallery (and break React's unique-key rule).
    images: [
      ...new Set(
        (raw.images ?? [])
          .map((img) => imageUrl(img))
          .filter((u): u is string => Boolean(u)),
      ),
    ],
    sizeChartColumns: raw.sizeChartColumns ?? [],
    sizeChart: mapSizeChart(raw.sizeChart),
    sizeChartNote: raw.sizeChartNote ?? null,
    description: raw.description ?? "",
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
  "id": _id, name, "slug": slug.current,
  "category": category->{title, "slug": slug.current},
  price, salePrice,
  coverImage, gallery, colours, sizes, stock, fabric,
  sizeChartColumns, sizeChart, sizeChartNote,
  description, order,
  "items": *[_type == "collectionItem" && references(^._id)]{stock}
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
  colour, "collectionSizes": collection->sizes, stock,
  sizeChartColumns, sizeChart, sizeChartNote,
  description, order, images
`;

export async function getCollectionItemsByCollectionSlug(
  collectionSlug: string,
): Promise<CollectionItem[]> {
  const raw = await query<RawCollectionItem[]>(
    `*[_type == "collectionItem" && collection->slug.current == $collectionSlug && defined(slug.current)] | order(order asc, name asc){${COLLECTION_ITEM_FIELDS}}`,
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
  category?: { title?: string };
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
        name, "slug": slug.current, "category": category->{title}, coverImage
      }`,
    ),
    query<RawSearchItem[]>(
      `*[_type == "collectionItem" && defined(slug.current) && defined(collection->slug.current)] | order(order asc, name asc){
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
      category: c.category?.title ?? "Collection",
    }));

  return [...itemEntries, ...collectionEntries];
}

// --- Home page -----------------------------------------------------------

type RawHeroSlide = {
  image?: { asset?: unknown; hotspot?: { x?: number; y?: number } | null } | null;
  alt?: string | null;
  verticalFocus?: string | null;
  horizontalFocus?: string | null;
  heading?: string | null;
  subheading?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
};

type RawHomePage = {
  heroSlides?: RawHeroSlide[] | null;
  heroSlideSeconds?: number | null;
  heroImage?: unknown;
  heroHeading?: string;
  heroSubheading?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  featuredCollections?: RawCollection[];
  newArrivals?: RawCollectionItem[];
  promoEnabled?: boolean;
  promoText?: string;
  promoHref?: string;
} | null;

export async function getHomePage(): Promise<HomePage | null> {
  const raw = await query<RawHomePage>(
    `*[_type == "homePage"][0]{
      heroImage, heroHeading, heroSubheading, heroCtaLabel, heroCtaHref, heroSlideSeconds,
      "heroSlides": heroSlides[]{"image": image, alt, verticalFocus, horizontalFocus, heading, subheading, buttonLabel, buttonHref},
      "featuredCollections": featuredCollections[]->{${COLLECTION_FIELDS}},
      "newArrivals": newArrivals[]->{${COLLECTION_ITEM_FIELDS}},
      promoEnabled, promoText, promoHref
    }`,
  );
  if (!raw) return null;
  const heroSlides = (raw.heroSlides ?? []).flatMap((s): HeroSlide[] => {
    // Wide copy (1600px) straight from Sanity's image CDN — see Hero.tsx.
    const image = imageUrl(s.image, 1600);
    if (!image) return [];
    return [
      {
        image,
        alt: s.alt?.trim() || null,
        objectPosition: heroObjectPosition(
          s.image?.hotspot,
          s.verticalFocus,
          s.horizontalFocus,
        ),
        heading: s.heading?.trim() || null,
        subheading: s.subheading?.trim() || null,
        ctaLabel: s.buttonLabel?.trim() || null,
        ctaHref: s.buttonHref?.trim() || null,
      },
    ];
  });
  return {
    heroSlides,
    heroSlideSeconds: Math.min(15, Math.max(3, raw.heroSlideSeconds ?? 6)),
    heroImage: imageUrl(raw.heroImage),
    heroHeading: raw.heroHeading ?? null,
    heroSubheading: raw.heroSubheading ?? null,
    heroCtaLabel: raw.heroCtaLabel ?? "Shop Now",
    heroCtaHref: raw.heroCtaHref ?? "/collections",
    featuredCollections: (raw.featuredCollections ?? []).map(mapCollection),
    newArrivals: (raw.newArrivals ?? []).map(mapCollectionItem),
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

// --- Policy pages (Privacy, Terms, Shipping, Returns…) ------------------------

export type PolicyLink = { title: string; slug: string };

export type PolicyPage = PolicyLink & {
  updated: string | null;
  body: PortableTextBlock[];
};

/** Published policy pages, in footer order — drafts are never returned. */
export async function getPolicyLinks(): Promise<PolicyLink[]> {
  const rows = await query<{ title?: string; slug?: string }[]>(
    `*[_type == "policyPage" && defined(slug.current)] | order(order asc, title asc){title, "slug": slug.current}`,
  );
  return rows.filter((r): r is PolicyLink => Boolean(r.title && r.slug));
}

export async function getPolicyBySlug(slug: string): Promise<PolicyPage | null> {
  const raw = await query<{
    title?: string;
    slug?: string;
    updated?: string | null;
    body?: PortableTextBlock[];
  } | null>(
    `*[_type == "policyPage" && slug.current == $slug][0]{title, "slug": slug.current, updated, body}`,
    { slug },
  );
  if (!raw?.title || !raw.slug) return null;
  return { title: raw.title, slug: raw.slug, updated: raw.updated ?? null, body: raw.body ?? [] };
}

export async function getPolicySlugs(): Promise<string[]> {
  return query<string[]>(
    `*[_type == "policyPage" && defined(slug.current)].slug.current`,
  );
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

/** TikTok Pixel ID from Site Settings, or null when blank/invalid (pixel stays off). */
export async function getTikTokPixelId(): Promise<string | null> {
  const raw = await query<{ id?: string | null } | null>(
    `*[_type == "siteSettings"][0]{"id": tiktokPixelId}`,
  );
  const id = raw?.id?.trim() ?? "";
  return /^[A-Z0-9]{10,30}$/.test(id) ? id : null;
}

/** Meta Pixel ID from Site Settings, or null when blank/invalid (pixel stays off). */
export async function getMetaPixelId(): Promise<string | null> {
  const raw = await query<{ id?: string | null } | null>(
    `*[_type == "siteSettings"][0]{"id": metaPixelId}`,
  );
  const id = raw?.id?.trim() ?? "";
  return /^\d{10,20}$/.test(id) ? id : null;
}

/** Google Analytics 4 Measurement ID from Site Settings, or null when blank/invalid (tag stays off). */
export async function getGoogleAnalyticsId(): Promise<string | null> {
  const raw = await query<{ id?: string | null } | null>(
    `*[_type == "siteSettings"][0]{"id": googleAnalyticsId}`,
  );
  const id = raw?.id?.trim() ?? "";
  return /^G-[A-Z0-9]{6,14}$/.test(id) ? id : null;
}

export type HomeFaq = { question: string; answer: string };
export type HomeReview = { name: string; location?: string; text: string };

/** FAQ and customer reviews for the home page, from Site Settings. Empty list = section hidden. */
export async function getHomeFaqAndReviews(): Promise<{ faqs: HomeFaq[]; reviews: HomeReview[] }> {
  const raw = await query<{
    faqs?: Partial<HomeFaq>[] | null;
    reviews?: Partial<HomeReview>[] | null;
  } | null>(
    `*[_type == "siteSettings"][0]{"faqs": faqs[]{question, answer}, "reviews": reviews[]{name, location, text}}`,
  );
  return {
    faqs: (raw?.faqs ?? []).filter((f): f is HomeFaq => !!f.question && !!f.answer),
    reviews: (raw?.reviews ?? []).filter((r): r is HomeReview => !!r.name && !!r.text),
  };
}

export type WelcomePopupConfig = {
  enabled: boolean;
  badge: string;
  heading: string;
  subheading: string;
  message: string;
  buttonLabel: string;
  buttonHref: string;
  smallPrint: string;
};

/** Welcome pop-up wording from Site Settings, with English defaults for blanks. */
export async function getWelcomePopup(): Promise<WelcomePopupConfig> {
  const raw = await query<{
    popupEnabled?: boolean | null;
    popupBadge?: string | null;
    popupHeading?: string | null;
    popupSubheading?: string | null;
    popupMessage?: string | null;
    popupButtonLabel?: string | null;
    popupButtonHref?: string | null;
    popupSmallPrint?: string | null;
  } | null>(
    `*[_type == "siteSettings"][0]{popupEnabled, popupBadge, popupHeading, popupSubheading, popupMessage, popupButtonLabel, popupButtonHref, popupSmallPrint}`,
  );
  const clean = (v?: string | null) => v?.trim() || "";
  return {
    enabled: raw?.popupEnabled !== false,
    badge: clean(raw?.popupBadge) || "Special Offer",
    heading: clean(raw?.popupHeading) || "Free Gift",
    subheading: clean(raw?.popupSubheading) || "with every purchase!",
    message:
      clean(raw?.popupMessage) ||
      "Shop anything at Torexia and receive a special gift — free, with your order.",
    buttonLabel: clean(raw?.popupButtonLabel) || "Shop Now",
    buttonHref: clean(raw?.popupButtonHref) || "/collections",
    smallPrint:
      clean(raw?.popupSmallPrint) || "While stocks last. Terms & conditions apply.",
  };
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  const raw = await query<{
    feeWest?: number | null;
    feeEast?: number | null;
    freeAbove?: number | null;
  } | null>(
    `*[_type == "siteSettings"][0]{
      "feeWest": shippingFeeWest,
      "feeEast": shippingFeeEast,
      "freeAbove": freeShippingAbove
    }`,
  );
  return {
    feeWest: raw?.feeWest ?? null,
    feeEast: raw?.feeEast ?? null,
    freeAbove: raw?.freeAbove ?? null,
  };
}

/**
 * Re-checks stock server-side at checkout — the Add to Cart button being
 * disabled only protects a page that's still open; a cart line added earlier
 * (or a tampered request) must be caught here too, right before payment.
 */
export async function getStockForItems(
  items: { slug: string; kind: "collection" | "product" }[],
): Promise<Record<string, SizeStock[]>> {
  const collectionSlugs = items.filter((i) => i.kind === "collection").map((i) => i.slug);
  const itemSlugs = items.filter((i) => i.kind === "product").map((i) => i.slug);
  if (!collectionSlugs.length && !itemSlugs.length) return {};

  const raw = await query<{ slug: string; stock?: RawSizeStock[] }[]>(
    `*[
      (_type == "collection" && slug.current in $collectionSlugs) ||
      (_type == "collectionItem" && slug.current in $itemSlugs)
    ]{"slug": slug.current, stock}`,
    { collectionSlugs, itemSlugs },
  );

  const map: Record<string, SizeStock[]> = {};
  for (const r of raw) map[r.slug] = mapStock(r.stock);
  return map;
}

export type ItemPricing = {
  name: string;
  price: number | null;
  salePrice: number | null;
  sizes: string[];
};

/**
 * The real name, price and sizes for each cart line, looked up in Sanity — so
 * checkout never has to trust a price sent by the browser. A colourway
 * ("product") has no price or sizes of its own: it uses its collection's.
 * Keyed `${kind}:${slug}`.
 */
export async function getPricingForItems(
  items: { slug: string; kind: "collection" | "product" }[],
): Promise<Record<string, ItemPricing>> {
  const collectionSlugs = items.filter((i) => i.kind === "collection").map((i) => i.slug);
  const itemSlugs = items.filter((i) => i.kind === "product").map((i) => i.slug);
  const map: Record<string, ItemPricing> = {};
  if (!collectionSlugs.length && !itemSlugs.length) return map;

  type Row = {
    slug: string;
    name?: string;
    price?: number | null;
    salePrice?: number | null;
    sizes?: string[] | null;
  };
  const [collections, colourways] = await Promise.all([
    query<Row[]>(
      `*[_type == "collection" && slug.current in $slugs]{"slug": slug.current, name, price, salePrice, sizes}`,
      { slugs: collectionSlugs },
    ),
    query<Row[]>(
      `*[_type == "collectionItem" && slug.current in $slugs]{"slug": slug.current, name, "price": collection->price, "salePrice": collection->salePrice, "sizes": collection->sizes}`,
      { slugs: itemSlugs },
    ),
  ]);
  const toPricing = (r: Row): ItemPricing => ({
    name: r.name ?? "Item",
    price: typeof r.price === "number" ? r.price : null,
    salePrice: typeof r.salePrice === "number" ? r.salePrice : null,
    sizes: r.sizes ?? [],
  });
  for (const r of collections) map[`collection:${r.slug}`] = toPricing(r);
  for (const r of colourways) map[`product:${r.slug}`] = toPricing(r);
  return map;
}

export async function getOrderAlertEmails(): Promise<string[]> {
  const emails = await query<string[] | null>(
    `*[_type == "siteSettings"][0].orderAlertEmails`,
  );
  return (emails ?? []).filter(Boolean);
}
