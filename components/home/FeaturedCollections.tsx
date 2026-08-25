import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CollectionCard } from "@/components/collections/CollectionCard";
import type { Collection } from "@/lib/types";

export function FeaturedCollections({
  collections,
}: {
  collections: Collection[];
}) {
  if (collections.length === 0) return null;

  return (
    // Bottom padding trimmed — StylingInspiration follows with the same
    // "alt" background, so their full py-20/32 would otherwise stack into
    // one big gap with no colour break to justify it.
    <Section tone="alt" spacing={false} className="pb-10 pt-20 sm:pb-14 sm:pt-32">
      <SectionHeading
        align="left"
        eyebrow="Collections"
        title="Shop by collection"
        description="Curated edits, crafted with timeless grace — explore our kaftan and jubah collections."
      />
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-3">
        {collections.map((c, i) => (
          <CollectionCard key={c.id} collection={c} priority={i < 3} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/collections" variant="outline" className="min-h-12">
          View all collections
        </ButtonLink>
      </div>
    </Section>
  );
}
