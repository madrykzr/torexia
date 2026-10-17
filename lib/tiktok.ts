// Small, safe wrapper around the TikTok Pixel. The pixel is loaded by
// components/analytics/TikTokPixel.tsx only when a Pixel ID is set in Site
// Settings — until then (or if an ad blocker stops it) every call here is a
// harmless no-op, so shop code can call it without checking anything.

type Ttq = {
  track: (event: string, params?: Record<string, unknown>) => void;
  page: () => void;
};

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

export type TikTokContent = {
  content_id: string;
  content_name: string;
  content_type: "product";
  quantity?: number;
  price?: number;
};

export function ttqTrack(event: string, params?: Record<string, unknown>): void {
  try {
    window.ttq?.track(event, { currency: "MYR", ...params });
  } catch {
    // Never let analytics break the shop.
  }
}

export function ttqPage(): void {
  try {
    window.ttq?.page();
  } catch {
    // ignore
  }
}

/** TikTok Pixel IDs are 20 upper-case letters and digits. */
export function isValidTikTokPixelId(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[A-Z0-9]{10,30}$/.test(value);
}
