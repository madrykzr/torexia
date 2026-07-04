// One-time build tool: curates + web-optimises product photography from the raw
// shoot (content/) into public/images/. Run with: npm run prep-images
// Raw originals live in /content (gitignored). Outputs are committed.
import sharp from "sharp";
import { readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = "content";
const OUT = "public/images/products";

// Curated source image numbers per colour (first entry = primary card/hero shot).
const SELECTION = {
  coffee: [2533, 2526, 2540, 2547, 2551, 2564],
  "soft-pink": [2604, 2610, 2616, 2635, 2588, 2640],
  "sage-green": [2696, 2674, 2680, 2698, 2690, 2664],
  "sky-blue": [2723, 2730, 2750, 2757, 2719, 2733],
  black: [2789, 2820, 2821, 2795, 2824, 2797],
  sand: [2867, 2876, 2884, 2897, 2868, 2870],
};

const HERO = 2564; // coffee, wall-lean, two-tone backdrop — negative space for overlay
const ABOUT = 2588; // soft-pink over coffee inner — editorial
const OG = 2533; // clean coffee front

// Build a number -> filepath index by scanning the shoot folders.
const numToPath = {};
for (const dir of readdirSync(ROOT)) {
  const full = join(ROOT, dir);
  let entries;
  try {
    entries = readdirSync(full);
  } catch {
    continue;
  }
  for (const f of entries) {
    const m = f.match(/(\d+)\.jpg$/i);
    if (m) numToPath[parseInt(m[1], 10)] = join(full, f);
  }
}

async function web(src, out, width, quality = 80) {
  await sharp(src)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, progressive: true, mozjpeg: true })
    .toFile(out);
}

for (const [slug, nums] of Object.entries(SELECTION)) {
  const dir = join(OUT, slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  let i = 1;
  for (const n of nums) {
    const src = numToPath[n];
    if (!src) {
      console.warn("  MISSING source", n, "for", slug);
      continue;
    }
    await web(src, join(dir, `${String(i).padStart(2, "0")}.jpg`), 1200, 80);
    i++;
  }
  console.log(`${slug}: ${i - 1} images`);
}

mkdirSync("public/images", { recursive: true });
await web(numToPath[HERO], "public/images/hero.jpg", 1600, 82);
await web(numToPath[ABOUT], "public/images/about.jpg", 1400, 82);
await sharp(numToPath[OG])
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "top" })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile("public/images/og.jpg");

console.log("hero / about / og written. done.");
