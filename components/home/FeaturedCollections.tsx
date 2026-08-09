import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { getFeaturedCollections } from "@/lib/sanity-content";

export async function FeaturedCollections() {
  const collections = await getFeaturedCollections();
  if (collections.length === 0) return null;

  return (
    <Section tone="alt">
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
