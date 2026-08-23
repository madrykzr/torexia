import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { CollectionDetailClient } from "@/components/collections/CollectionDetailClient";
import { CollectionItemsGrid } from "@/components/collections/CollectionItemsGrid";
import {
  getCollectionBySlug,
  getCollectionItemsByCollectionSlug,
  getCollectionSlugs,
} from "@/lib/sanity-content";

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.name,
    description:
      collection.description ||
      `${collection.name} — a Torexia collection.`,
    openGraph: {
      title: `${collection.name} | Torexia`,
      description: collection.description,
      images: collection.cover ? [{ url: collection.cover }] : [],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collection, items] = await Promise.all([
    getCollectionBySlug(slug),
    getCollectionItemsByCollectionSlug(slug),
  ]);
  if (!collection) notFound();

  return (
    <Section tone="cream" className="pt-36 sm:pt-40">
      <nav className="mb-8 text-xs tracking-wide text-charcoal-600">
        <Link href="/" className="transition-colors hover:text-coffee">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="transition-colors hover:text-coffee">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{collection.name}</span>
      </nav>

      {items.length > 0 ? (
        <CollectionItemsGrid collection={collection} items={items} />
      ) : (
        <CollectionDetailClient collection={collection} />
      )}
    </Section>
  );
}
