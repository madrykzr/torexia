export type Size = "S" | "M" | "L" | "XL";

export type Colour = {
  name: string;
  slug: string;
  /** Representative swatch colour (approximate fabric tone) */
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Price in Malaysian Ringgit */
  price: number;
  fabric: string;
  description: string;
  colours: Colour[];
  sizes: Size[];
  /** Image paths keyed by colour slug (relative to /public) */
  images: Record<string, string[]>;
  featured: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date string */
  date: string;
  excerpt: string;
  cover: string;
  /** Read time label, e.g. "4 min read" */
  readTime: string;
  /** Array of paragraph/heading blocks */
  content: BlogBlock[];
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };
