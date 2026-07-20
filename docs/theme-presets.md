# Theme presets

All site colours come from **one place**: the `@theme` block at the top of
[`app/globals.css`](../app/globals.css). Token *names* are stable across presets
(`cream`, `coffee`, `blush`, `charcoal`, …), so swapping a whole look is just
replacing the values in that block — every page, button and section follows.

To switch preset: replace the colour lines inside `@theme { … }` with one of the
blocks below, then `npm run build`.

---

## Preset A — "Soft Premium" (currently active)

Warm cream base, deep warm brown dark bands, dusty rose-brown accent.

```css
--color-cream: #faf7f2;        /* primary background — warm cream */
--color-cream-200: #f2ebe3;    /* alternating section background */
--color-espresso: #2c1810;     /* dark accent sections — footer, headers, bands */
--color-coffee: #8b5e52;       /* brand accent — buttons, links, active states */
--color-coffee-600: #6b4438;   /* button hover */
--color-coffee-700: #5a3a2f;   /* deeper hover */
--color-blush: #a6806f;        /* soft accent label — reads on light and dark */
--color-blush-300: #c9afa4;    /* light label on dark sections */
--color-blush-100: #efe6df;    /* soft tinted section */
--color-charcoal: #1c1c1c;     /* primary text — near-black */
--color-charcoal-600: #6b5b52; /* secondary text — warm muted brown */
--color-line: #e8ddd5;         /* borders / dividers — soft warm grey */

--font-heading: var(--font-borniarte);
--font-body: var(--font-poppins);
```

---

## Preset B — "Burgundy Bloom" (previous design)

The client's brand palette: Burgundy `#8E0045` + Pearl Beige `#EFE9DD`.

```css
--color-cream: #f4efe6;        /* soft pearl — page base */
--color-cream-200: #efe9dd;    /* Pearl Beige (exact) — section contrast */
--color-espresso: #8e0045;     /* see note below — dark bands were burgundy */
--color-coffee: #8e0045;       /* Burgundy Bloom (exact) — headings, footer, buttons */
--color-coffee-700: #75003a;   /* deeper burgundy */
--color-coffee-600: #a81a5c;   /* lighter burgundy — hover */
--color-blush: #b75e86;        /* burgundy tint — accents / hover */
--color-blush-300: #ce93ae;
--color-blush-100: #ebd3de;
--color-charcoal: #2a1a22;     /* warm near-black — body text */
--color-charcoal-600: #6b5560;
--color-line: #2a1a2219;       /* ≈ the old border-charcoal/10 */

--font-heading: var(--font-borniarte);
--font-body: var(--font-poppins);
```

> **Note on `--color-espresso`:** this token did not exist in Preset B. The dark
> sections (footer, page headers, Why Torexia, CTA band) used `coffee` directly.
> Setting `espresso` to the same burgundy reproduces the old dark bands.

---

## Preset C — "Original Phase 1" (cream & coffee, pre-branding)

The first build, before the brand kit landed. Uses Playfair + Inter, which are
no longer loaded — see the caveat below.

```css
--color-cream: #faf7f2;
--color-cream-200: #f1eae0;
--color-espresso: #3b2314;
--color-coffee: #3b2314;
--color-coffee-700: #4d3020;
--color-coffee-600: #5f3f2b;
--color-blush: #c9a99a;
--color-blush-300: #d9c1b6;
--color-blush-100: #ede0d9;
--color-charcoal: #1c1c1c;
--color-charcoal-600: #4a4a4a;
--color-line: #1c1c1c19;

--font-heading: var(--font-playfair);  /* requires re-adding Playfair in app/layout.tsx */
--font-body: var(--font-inter);        /* requires re-adding Inter in app/layout.tsx */
```

---

## Important: colours are only part of the story

The "Soft Premium" redesign changed more than the palette. Pasting Preset B back
gives you the **burgundy colours inside the new layout** — not a pixel-perfect
return to the old site. These also changed:

- `espresso` token added; dark sections split off from the `coffee` accent
- Hero gradient softened to a low-opacity scrim (was `from-coffee/85`)
- Cards became white with a soft shadow + hover lift (were flat on cream)
- Section padding `py-16 sm:py-24` → `py-20 sm:py-32`, plus a new `alt` tone and
  alternating backgrounds; Styling Inspiration & Customer Reviews moved off dark
- Typography: body line-height 1.75 + letter-spacing, larger headings,
  all-caps labels unified to `0.15em`
- Borders unified to the `line` token; watermark opacity 4% → 3%
- Buttons: lighter weight, airier padding

### Full rollback

For a true revert of the whole redesign (colours **and** layout/typography):

```bash
git revert a63481e     # "Redesign: soft premium palette, more whitespace, editorial type"
```

Reference commits:

| Commit | State |
|---|---|
| `a63481e` | Soft Premium redesign (current) |
| `4a815bf` | Burgundy Bloom — last commit before the redesign |
| `efe659c` | Burgundy Bloom introduced (brand kit applied) |
| `efe659c^` | Original Phase 1 cream & coffee |

The logo, favicon and logomania watermark are Burgundy `#8E0045` in **all**
presets — they are separate SVG assets in `public/images/` and `app/`, kept as
the brand mark regardless of theme.
