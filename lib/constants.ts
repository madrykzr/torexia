export const SITE = {
  name: "Torexia",
  /** Brand tagline */
  tagline: "Simple • Meaningful • Elevated",
  /** Brand promise */
  promise: "Designed with Purpose. Worn with Confidence.",
  subtitle: "Modest fashion for real everyday women",
  description:
    "Torexia is a Malaysian modest fashion brand crafting timeless, elegant and practical apparel for the modern Muslimah — designed for comfort, modesty and effortless elegance.",
  url: "https://torexiacom.biz",
} as const;

export const CONTACT = {
  email: "hello@torexiacom.biz",
  phone: "+60 13-220 9408",
  /** Digits only, for wa.me links */
  whatsapp: "60132209408",
  instagram: {
    handle: "@torexiaofficial",
    url: "https://www.instagram.com/torexiaofficial/",
  },
  tiktok: {
    handle: "@ladytorexia",
    url: "https://www.tiktok.com/@ladytorexia",
  },
  website: {
    label: "torexiacom.biz",
    url: "https://torexiacom.biz",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

/**
 * Build a WhatsApp click-to-chat link with an optional pre-filled message.
 */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Format a Ringgit price, e.g. 199 -> "RM199" */
export function formatPrice(price: number): string {
  return `RM${price}`;
}

/** Format an ISO date string, e.g. "2026-06-18" -> "18 June 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
