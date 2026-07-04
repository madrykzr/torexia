import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Collection = {
  name: string;
  description: string;
  comingSoon?: boolean;
};

const collections: Collection[] = [
  {
    name: "Daily Abaya",
    description: "Designed for everyday comfort and ease.",
  },
  {
    name: "Premium Abaya",
    description: "Elevated designs with refined details and premium materials.",
  },
  {
    name: "Luxury Collections",
    description: "Exclusive pieces for special occasions.",
  },
  {
    name: "Plus Size Collections",
    description: "Thoughtfully designed for comfort, fit and confidence.",
  },
  { name: "Kaftans", description: "Coming Soon", comingSoon: true },
  { name: "Hijabs", description: "Coming Soon", comingSoon: true },
  {
    name: "Accessories",
    description: "Including scrunchies. Coming Soon.",
    comingSoon: true,
  },
];

function CollectionCard({ collection }: { collection: Collection }) {
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
    "block h-full rounded-2xl border border-charcoal/10 bg-cream p-6 transition-colors";

  if (collection.comingSoon) {
    return <div className={`${base} opacity-70`}>{inner}</div>;
  }

  return (
    <Link href="/shop" className={`group ${base} hover:border-coffee/30`}>
      {inner}
    </Link>
  );
}

export function Collections() {
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
            <CollectionCard collection={c} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
