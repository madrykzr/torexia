// Pure helpers over a doc's `stock` rows — no I/O, safe to import from both
// server code (checkout route) and client components (product/collection
// detail pages), unlike lib/sanity-content.ts which pulls in a server-only
// Sanity client and token.
import type { Size, SizeStock } from "@/lib/types";

/** Remaining count for a size, or null when that size isn't stock-tracked (unlimited). */
export function remainingStock(stock: SizeStock[], size: Size | string | null): number | null {
  if (!size) return null;
  const row = stock.find((s) => s.size === size);
  return row ? row.quantity : null;
}

/** Sizes at zero (or below, from a rare race) stock — cross these out in the UI. */
export function soldOutSizes(stock: SizeStock[]): Size[] {
  return stock.filter((s) => s.quantity <= 0).map((s) => s.size);
}

/**
 * True only when every size the piece comes in is stock-tracked AND at zero —
 * an untracked size (no row) is always buyable, so it keeps this false. Used
 * for the "Sold Out" badge on card thumbnails, one level above the size
 * selector on the detail page.
 */
export function isFullySoldOut(sizes: Size[], stock: SizeStock[]): boolean {
  if (sizes.length === 0) return false;
  return sizes.every((size) => {
    const row = stock.find((s) => s.size === size);
    return row != null && row.quantity <= 0;
  });
}
