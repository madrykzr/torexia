export const SITE = {
  name: "Torexia",
  /** Brand tagline */
  tagline: "Simple • Meaningful • Elevated",
  /** Brand promise */
  promise: "Designed with Purpose. Worn with Confidence.",
  subtitle: "Modest fashion for real everyday women",
  description:
    "Torexia is a Malaysian modest fashion brand crafting timeless, elegant and practical apparel for the modern Muslimah — designed for comfort, modesty and effortless elegance.",
  // Canonical/Open Graph base URL — the live domain (feeds metadataBase).
  // www, because the bare domain 308-redirects to it on Vercel.
  url: "https://www.ladytorexia.my",
} as const;

// Fallback defaults — used until the owner fills in Site Settings in Studio,
// and for any field Site Settings doesn't cover (website label/url).
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

export type ResolvedContact = {
  email: string;
  phone: string;
  /** Digits only, for wa.me links */
  whatsapp: string;
  instagram: { handle: string; url: string };
  tiktok: { handle: string; url: string };
  website: { label: string; url: string };
};

function resolveInstagram(input: string | null | undefined): { handle: string; url: string } {
  const value = input?.trim();
  if (!value) return CONTACT.instagram;
  if (/^https?:\/\//i.test(value)) {
    const slug = value.replace(/\/+$/, "").split("/").pop();
    return slug ? { handle: `@${slug}`, url: value } : CONTACT.instagram;
  }
  const handle = value.startsWith("@") ? value : `@${value}`;
  return { handle, url: `https://www.instagram.com/${handle.slice(1)}/` };
}

function resolveTiktok(input: string | null | undefined): { handle: string; url: string } {
  const value = input?.trim();
  if (!value) return CONTACT.tiktok;
  if (/^https?:\/\//i.test(value)) {
    const slug = value.replace(/\/+$/, "").split("/").pop();
    return slug ? { handle: `@${slug.replace(/^@/, "")}`, url: value } : CONTACT.tiktok;
  }
  const handle = value.startsWith("@") ? value : `@${value}`;
  return { handle, url: `https://www.tiktok.com/${handle}` };
}

/**
 * Merges Site Settings (owner-editable in Studio) over the CONTACT fallback
 * defaults — an empty/missing field in Studio quietly falls back rather than
 * showing blank. `settings` is whatever getSiteSettings() returned.
 */
export function resolveContact(
  settings: { whatsapp?: string | null; instagram?: string | null; tiktok?: string | null; email?: string | null; phone?: string | null } | null,
): ResolvedContact {
  return {
    email: settings?.email?.trim() || CONTACT.email,
    phone: settings?.phone?.trim() || CONTACT.phone,
    whatsapp: settings?.whatsapp?.trim() || CONTACT.whatsapp,
    instagram: resolveInstagram(settings?.instagram),
    tiktok: resolveTiktok(settings?.tiktok),
    website: CONTACT.website,
  };
}

export const MALAYSIA_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/collections" },
  // Rent temporarily removed — bring back once ready (see app/(site)/rent/*)
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Build a WhatsApp click-to-chat link with an optional pre-filled message.
 * `number` is digits-only (e.g. from ResolvedContact.whatsapp) — pass
 * CONTACT.whatsapp where no live Site Settings value is available.
 */
export function whatsappUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Format a Ringgit price, e.g. 199 -> "RM199" */
export function formatPrice(price: number): string {
  return `RM${price}`;
}

/**
 * The price a customer actually pays — the sale price when a valid discount
 * is set (lower than the original), otherwise the original price.
 */
export function effectivePrice(
  price: number | null,
  salePrice?: number | null,
): number | null {
  if (price == null) return null;
  if (salePrice != null && salePrice < price) return salePrice;
  return price;
}

/** Pre-filled WhatsApp enquiry for a rental piece. Unset fields show as "___". */
export function rentalMessage(opts: {
  name: string;
  size?: string;
  colour?: string;
  days?: number | string;
  date?: string;
}): string {
  const blank = "___";
  return `Hi Torexia! I'm interested in renting ${opts.name}. Size: ${
    opts.size || blank
  } Colour: ${opts.colour || blank} Number of days: ${
    opts.days || blank
  } Date needed: ${opts.date || blank}`;
}

/** Format an ISO date string, e.g. "2026-06-18" -> "18 June 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
