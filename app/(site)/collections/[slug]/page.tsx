import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/shop/ProductCard";
import { CollectionDetailClient } from "@/components/collections/CollectionDetailClient";
import {
  getCollectionBySlug,
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
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <Section tone="cream" className="pt-28 sm:pt-32">
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

      <CollectionDetailClient collection={collection} />

      {collection.products.length > 0 && (
        <div className="mt-20 sm:mt-28">
          <h2 className="mb-8 font-heading text-3xl text-charcoal sm:text-4xl">
            Pieces in this collection
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
