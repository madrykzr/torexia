import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { CollectionItemDetailClient } from "@/components/collections/CollectionItemDetailClient";
import { RelatedCollectionItems } from "@/components/collections/RelatedCollectionItems";
import {
  getCollectionBySlug,
  getCollectionItemBySlug,
  getCollectionItemSlugPairs,
} from "@/lib/sanity-content";

export async function generateStaticParams() {
  const pairs = await getCollectionItemSlugPairs();
  return pairs.map(({ slug, itemSlug }) => ({ slug, itemSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}): Promise<Metadata> {
  const { slug, itemSlug } = await params;
  const item = await getCollectionItemBySlug(slug, itemSlug);
  if (!item) return { title: "Item Not Found" };
  return {
    title: item.name,
    description: item.description || `${item.name} — a Torexia piece.`,
    openGraph: {
      title: `${item.name} | Torexia`,
      description: item.description,
      images: item.images[0] ? [{ url: item.images[0] }] : [],
    },
  };
}

export default async function CollectionItemPage({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}) {
  const { slug, itemSlug } = await params;
  const [collection, item] = await Promise.all([
    getCollectionBySlug(slug),
    getCollectionItemBySlug(slug, itemSlug),
  ]);
  if (!collection || !item) notFound();

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
        <Link
          href={`/collections/${collection.slug}`}
          className="transition-colors hover:text-coffee"
        >
          {collection.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{item.name}</span>
      </nav>

      <CollectionItemDetailClient collection={collection} item={item} />

      <div className="mt-20 sm:mt-28">
        <RelatedCollectionItems collectionSlug={collection.slug} currentSlug={item.slug} />
      </div>
    </Section>
  );
}
