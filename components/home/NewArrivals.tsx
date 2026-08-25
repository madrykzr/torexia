import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { CollectionItem } from "@/lib/types";

export function NewArrivals({ items }: { items: CollectionItem[] }) {
  if (items.length === 0) return null;

  return (
    // Sandwiched between FeaturedCollections (above) and StylingInspiration
    // (below) in the same "alt" background block — trimmed padding on both
    // edges so all three read as one continuous section, no colour break.
    <Section tone="alt" spacing={false} className="pb-10 pt-10 sm:pb-14 sm:pt-14">
      <SectionHeading
        align="left"
        eyebrow="New In"
        title="New arrivals"
        description="Fresh pieces, just added to the edit."
      />

      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 no-scrollbar sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pb-0">
        {items.map((item, i) => (
          <Reveal
            key={item.id}
            delay={i * 0.08}
            className="w-[85%] shrink-0 snap-start sm:w-auto"
          >
            <Link
              href={`/collections/${item.collectionSlug}/${item.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.images[0] ?? "/images/og.jpg"}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 90vw, 45vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="font-heading text-xl uppercase tracking-[0.15em] text-white sm:text-2xl">
                  {item.name}
                </h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
