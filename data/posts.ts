import type { BlogPost } from "@/lib/types";

export const posts: BlogPost[] = [
  {
    slug: "styling-your-daily-abaya",
    title: "5 Ways to Style Your Daily Abaya",
    date: "2026-06-18",
    excerpt:
      "From school runs to weekend brunches, here's how to make one abaya work for every part of your day.",
    cover: "/images/products/soft-pink/05.jpg",
    readTime: "4 min read",
    content: [
      {
        type: "p",
        text: "A good daily abaya is the quiet hero of a modest wardrobe. It should feel effortless — something you reach for without thinking, that carries you gracefully from morning errands to evening gatherings. Here are five simple ways to restyle the one you already love.",
      },
      { type: "h2", text: "1. Keep it monochrome" },
      {
        type: "p",
        text: "Pair your abaya with a hijab in the same tonal family. A coffee abaya with a warm cream shawl feels considered and elongating, letting the lace detailing do the talking.",
      },
      { type: "h2", text: "2. Layer with a belt" },
      {
        type: "p",
        text: "A soft fabric belt at the waist instantly shifts an open abaya from relaxed to refined — perfect for occasions when you want a little more shape.",
      },
      { type: "h2", text: "3. Let the sleeves shine" },
      {
        type: "p",
        text: "Our flared, cut-work sleeves are designed to move. Keep the rest of your look simple so they remain the focus.",
      },
      {
        type: "quote",
        text: "Modest dressing isn't about hiding — it's about choosing what to reveal, and doing it beautifully.",
      },
      { type: "h2", text: "4. Play with texture" },
      {
        type: "p",
        text: "A satin-finish hijab against the matte cotton nida adds gentle contrast without introducing a single new colour.",
      },
      { type: "h2", text: "5. Ground it with the right shoes" },
      {
        type: "p",
        text: "Nude heels lengthen the leg for events; clean sandals keep daytime looks light and comfortable. The abaya adapts — you decide the mood.",
      },
    ],
  },
  {
    slug: "why-cotton-nida",
    title: "Why We Chose Cotton Nida",
    date: "2026-05-30",
    excerpt:
      "The fabric behind every Torexia piece — and why it's made for Malaysia's everyday warmth.",
    cover: "/images/products/sage-green/01.jpg",
    readTime: "3 min read",
    content: [
      {
        type: "p",
        text: "When we set out to design the Torexia daily abaya, we tested fabric after fabric against one question: could you wear it all day, in real Malaysian weather, and still feel fresh? Cotton nida was the clear answer.",
      },
      { type: "h2", text: "Lightweight, but never flimsy" },
      {
        type: "p",
        text: "Cotton nida has a beautiful weight to it. It drapes cleanly and holds the flared silhouette of our sleeves, yet it's airy enough to move with you through a busy day.",
      },
      { type: "h2", text: "Breathable by nature" },
      {
        type: "p",
        text: "The weave allows air to pass through, which makes a real difference in humidity. It's the kind of comfort you stop noticing — because nothing is pulling your attention away from your day.",
      },
      { type: "h2", text: "Easy to care for" },
      {
        type: "p",
        text: "A gentle machine wash and a low iron are all it asks for. Modest fashion should fit into your life, not add to your list.",
      },
    ],
  },
  {
    slug: "modest-everyday-elegance",
    title: "Modest, Everyday Elegance",
    date: "2026-05-12",
    excerpt:
      "Our philosophy in one phrase — and what it means for the women who wear Torexia.",
    cover: "/images/products/coffee/06.jpg",
    readTime: "3 min read",
    content: [
      {
        type: "p",
        text: "Torexia was born from a simple observation: most abayas ask you to choose between comfort and elegance. We didn't think that was fair.",
      },
      { type: "h2", text: "Designed for real women" },
      {
        type: "p",
        text: "Our pieces are made for mothers, students, professionals — women moving through full days. That's why every design begins with fit, fabric and function before anything else.",
      },
      {
        type: "quote",
        text: "Elegance isn't a special occasion. It's how you want to feel on an ordinary Tuesday.",
      },
      { type: "h2", text: "A wardrobe you can trust" },
      {
        type: "p",
        text: "We keep our palette calm and our details thoughtful, so every piece works with what you already own. Torexia is designed to be the abaya you keep reaching for.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
