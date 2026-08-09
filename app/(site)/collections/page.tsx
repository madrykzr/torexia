import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CollectionsBrowser } from "@/components/collections/CollectionsBrowser";
import { getAllCollections } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore Torexia collections — kaftan, jubah and abaya. Curated edits, crafted with timeless grace.",
};

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Collections"
        subtitle="Curated edits, crafted with timeless grace."
      />
      <Section tone="cream">
        <CollectionsBrowser collections={collections} />
      </Section>
    </>
  );
}
