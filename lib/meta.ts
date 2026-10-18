// Small, safe wrapper around the Meta (Facebook/Instagram) Pixel. The pixel is loaded by
// components/analytics/MetaPixel.tsx only when a Pixel ID is set in Site Settings — until
// then (or if an ad blocker stops it) every call here is a harmless no-op, so shop code can
// call it without checking anything.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function fbqTrack(event: string, params?: Record<string, unknown>): void {
  try {
    window.fbq?.("track", event, { currency: "MYR", ...params });
  } catch {
    // Never let analytics break the shop.
  }
}

export function fbqPageView(): void {
  try {
    window.fbq?.("track", "PageView");
  } catch {
    // ignore
  }
}

/** Meta Pixel IDs are 10–20 digits. */
export function isValidMetaPixelId(value: string | null | undefined): value is string {
  return typeof value === "string" && /^\d{10,20}$/.test(value);
}
