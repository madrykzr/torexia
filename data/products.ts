import type { Colour, Product, Size } from "@/lib/types";

export const SIZES: Size[] = ["S", "M", "L", "XL"];

// Collection tabs for the shop filter. `value` matches the product schema's
// COLLECTION_OPTIONS slugs; `label` is what shows on the tab.
export const COLLECTIONS: { value: string; label: string }[] = [
  { value: "daily-abaya", label: "Daily Abaya" },
  { value: "premium-abaya", label: "Premium Abaya" },
  { value: "luxury", label: "Luxury" },
  { value: "plus-size", label: "Plus Size" },
  { value: "kaftan", label: "Kaftan" },
  { value: "hijab", label: "Hijab" },
  { value: "accessories", label: "Accessories" },
];

// Brand colour palette — swatch metadata (hex) keyed by slug. Products in
// Sanity store colour slugs; the frontend resolves name + hex from here.
export const COLOURS: Record<string, Colour> = {
  coffee: { name: "Coffee", slug: "coffee", hex: "#4a2f22" },
  "soft-pink": { name: "Soft Pink", slug: "soft-pink", hex: "#e7b9c4" },
  "sage-green": { name: "Sage Green", slug: "sage-green", hex: "#b3c6ac" },
  "sky-blue": { name: "Sky Blue", slug: "sky-blue", hex: "#a9cdda" },
  black: { name: "Black", slug: "black", hex: "#1c1c1c" },
  sand: { name: "Sand", slug: "sand", hex: "#d8d2c4" },
  // Tones from the kaftan / jubah photography
  berry: { name: "Berry", slug: "berry", hex: "#a0396b" },
  chocolate: { name: "Chocolate", slug: "chocolate", hex: "#6b4a33" },
  beige: { name: "Beige", slug: "beige", hex: "#e0c9a6" },
};

/** Ordered list for the colour showcase strip and shop filters. */
export const COLOUR_LIST: Colour[] = [
  COLOURS.coffee,
  COLOURS["soft-pink"],
  COLOURS["sky-blue"],
  COLOURS["sage-green"],
  COLOURS.sand,
  COLOURS.black,
  COLOURS.berry,
  COLOURS.chocolate,
  COLOURS.beige,
];

/** The first image for a product — used on cards. */
export function primaryImage(product: Product): string {
  return product.images[0] ?? "/images/og.jpg";
}
