import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/shop/Accordion";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice, whatsappUrl } from "@/lib/constants";
import {
  getCollectionBySlug,
  getCollectionSlugs,
} from "@/lib/sanity-content";

const CATEGORY_LABEL: Record<string, string> = {
  kaftan: "Kaftan",
  jubah: "Jubah",
  abaya: "Abaya",
};

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

  const images = [collection.cover, ...collection.gallery].filter(Boolean);
  const message = `Hi Torexia! I'm interested in the ${collection.name} collection. Could you share more details?`;

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

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={images} alt={collection.name} />

        <div className="lg:pt-4">
          {collection.category && (
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush">
              {CATEGORY_LABEL[collection.category] ?? collection.category}
            </p>
          )}
          <h1 className="mt-2 font-heading text-4xl text-charcoal sm:text-5xl">
            {collection.name}
          </h1>
          <p className="mt-3 text-xl text-coffee">
            {collection.price != null
              ? formatPrice(collection.price)
              : "Price on enquiry"}
          </p>

          {collection.description && (
            <p className="mt-6 text-sm leading-loose text-charcoal-600">
              {collection.description}
            </p>
          )}

          <div className="mt-8">
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
            >
              Enquire via WhatsApp
            </a>
          </div>

          <div className="mt-8">
            {collection.sizeGuide && (
              <Accordion title="Size Guide">
                <div className="relative w-full overflow-hidden rounded-xl bg-white">
                  <Image
                    src={collection.sizeGuide}
                    alt={`${collection.name} size guide`}
                    width={1000}
                    height={1250}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="h-auto w-full"
                  />
                </div>
              </Accordion>
            )}
            <Accordion title="Fabric & Care">
              <ul className="list-inside list-disc space-y-1">
                <li>Gentle machine wash, cold, with like colours</li>
                <li>Do not bleach</li>
                <li>Iron on low heat if needed</li>
                <li>Hang to dry, away from direct sunlight</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

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
