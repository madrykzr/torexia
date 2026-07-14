"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Collection = {
  name: string;
  description: string;
  /** Collection slug the shop grid filters by (omitted for coming-soon cards) */
  value?: string;
  comingSoon?: boolean;
};

const collections: Collection[] = [
  {
    name: "Daily Abaya",
    description: "Designed for everyday comfort and ease.",
    value: "daily-abaya",
  },
  {
    name: "Premium Abaya",
    description: "Elevated designs with refined details and premium materials.",
    value: "premium-abaya",
  },
  {
    name: "Luxury Collections",
    description: "Exclusive pieces for special occasions.",
    value: "luxury",
  },
  {
    name: "Plus Size Collections",
    description: "Thoughtfully designed for comfort, fit and confidence.",
    value: "plus-size",
  },
  { name: "Kaftans", description: "Coming Soon", comingSoon: true },
  { name: "Hijabs", description: "Coming Soon", comingSoon: true },
  {
    name: "Accessories",
    description: "Including scrunchies. Coming Soon.",
    comingSoon: true,
  },
];

function CollectionCard({
  collection,
  onExplore,
}: {
  collection: Collection;
  onExplore?: (value: string) => void;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl text-charcoal">{collection.name}</h3>
        {collection.comingSoon && (
          <span className="shrink-0 rounded-full bg-blush/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-coffee">
            Coming Soon
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
        {collection.description}
      </p>
      {!collection.comingSoon && (
        <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-blush transition-colors group-hover:text-coffee">
          Explore →
        </span>
      )}
    </>
  );

  const base =
    "block h-full rounded-2xl border border-charcoal/10 bg-cream p-6 text-left transition-colors";

  if (collection.comingSoon || !collection.value) {
    return <div className={`${base} opacity-70`}>{inner}</div>;
  }

  // Preferred: scroll to the grid and apply the filter without leaving the page.
  if (onExplore) {
    const value = collection.value;
    return (
      <button
        type="button"
        onClick={() => onExplore(value)}
        className={`group w-full ${base} hover:border-coffee/30`}
      >
        {inner}
      </button>
    );
  }

  // Fallback (no handler): link to the shop page.
  return (
    <Link href="/shop" className={`group ${base} hover:border-coffee/30`}>
      {inner}
    </Link>
  );
}

export function Collections({
  onExplore,
}: {
  onExplore?: (value: string) => void;
}) {
  return (
    <Section tone="cream" className="pb-0">
      <SectionHeading
        align="left"
        eyebrow="Collections"
        title="Shop by collection"
        description="Explore our range — from everyday daily abayas to premium and luxury pieces, with more categories on the way."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.05} className="h-full">
            <CollectionCard collection={c} onExplore={onExplore} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
