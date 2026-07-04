import type { Colour, Product, Size } from "@/lib/types";

export const SIZES: Size[] = ["S", "M", "L", "XL"];

export const COLOURS: Record<string, Colour> = {
  coffee: { name: "Coffee", slug: "coffee", hex: "#4a2f22" },
  "soft-pink": { name: "Soft Pink", slug: "soft-pink", hex: "#e7b9c4" },
  "sage-green": { name: "Sage Green", slug: "sage-green", hex: "#b3c6ac" },
  "sky-blue": { name: "Sky Blue", slug: "sky-blue", hex: "#a9cdda" },
  black: { name: "Black", slug: "black", hex: "#1c1c1c" },
  sand: { name: "Sand", slug: "sand", hex: "#d8d2c4" },
};

/** Ordered list for the colour showcase strip. */
export const COLOUR_LIST: Colour[] = [
  COLOURS.coffee,
  COLOURS["soft-pink"],
  COLOURS["sky-blue"],
  COLOURS["sage-green"],
  COLOURS.sand,
  COLOURS.black,
];

const IMG_COUNT = 6;

/** Build the six image paths for a colour, e.g. /images/products/coffee/01.jpg */
function imgs(slug: string): string[] {
  return Array.from(
    { length: IMG_COUNT },
    (_, i) => `/images/products/${slug}/${String(i + 1).padStart(2, "0")}.jpg`,
  );
}

/** Assemble the images map for the given colour slugs. */
function imageMap(slugs: string[]): Record<string, string[]> {
  return Object.fromEntries(slugs.map((s) => [s, imgs(s)]));
}

const BASE_DESCRIPTION =
  "Designed for comfort, confidence and effortless everyday elegance. Crafted from soft cotton nida fabric — lightweight, breathable, and perfect for long everyday wear.";

const FABRIC = "Cotton Nida";

export const products: Product[] = [
  {
    id: "1",
    slug: "daily-abaya",
    name: "Daily Abaya",
    price: 199,
    fabric: FABRIC,
    description: BASE_DESCRIPTION,
    colours: [
      COLOURS.coffee,
      COLOURS["soft-pink"],
      COLOURS["sky-blue"],
      COLOURS["sage-green"],
      COLOURS.sand,
      COLOURS.black,
    ],
    sizes: SIZES,
    images: imageMap([
      "coffee",
      "soft-pink",
      "sky-blue",
      "sage-green",
      "sand",
      "black",
    ]),
    featured: true,
  },
  {
    id: "2",
    slug: "signature-lace-abaya",
    name: "Signature Lace Abaya",
    price: 219,
    fabric: FABRIC,
    description:
      "Our signature open abaya, finished with delicate loop-lace trim along the front panels and flared sleeves. " +
      BASE_DESCRIPTION,
    colours: [COLOURS.coffee, COLOURS.sand, COLOURS.black],
    sizes: SIZES,
    images: imageMap(["coffee", "sand", "black"]),
    featured: true,
  },
  {
    id: "3",
    slug: "everyday-open-abaya",
    name: "Everyday Open Abaya",
    price: 189,
    fabric: FABRIC,
    description:
      "A soft, throw-over open abaya in our most-loved pastels — effortless layering for daily wear. " +
      BASE_DESCRIPTION,
    colours: [COLOURS["soft-pink"], COLOURS["sage-green"], COLOURS["sky-blue"]],
    sizes: SIZES,
    images: imageMap(["soft-pink", "sage-green", "sky-blue"]),
    featured: true,
  },
  {
    id: "4",
    slug: "flare-sleeve-abaya",
    name: "Flare-Sleeve Abaya",
    price: 209,
    fabric: FABRIC,
    description:
      "Dramatic flared sleeves with intricate cut-work lace, cut for a graceful everyday silhouette. " +
      BASE_DESCRIPTION,
    colours: [COLOURS.black, COLOURS.coffee, COLOURS["sky-blue"]],
    sizes: SIZES,
    images: imageMap(["black", "coffee", "sky-blue"]),
    featured: false,
  },
  {
    id: "5",
    slug: "essential-nida-abaya",
    name: "Essential Nida Abaya",
    price: 199,
    fabric: FABRIC,
    description:
      "The essential daily abaya in warm neutrals and calming green — a quiet staple for every wardrobe. " +
      BASE_DESCRIPTION,
    colours: [COLOURS.sand, COLOURS["sage-green"], COLOURS["soft-pink"]],
    sizes: SIZES,
    images: imageMap(["sand", "sage-green", "soft-pink"]),
    featured: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

/** Products related to the given one (same catalogue, excluding itself). */
export function getRelatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

/** The first image for a product's given (or first) colour — used on cards. */
export function primaryImage(product: Product, colourSlug?: string): string {
  const slug = colourSlug ?? product.colours[0].slug;
  return product.images[slug]?.[0] ?? product.images[product.colours[0].slug][0];
}
