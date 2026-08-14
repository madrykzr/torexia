import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { RentDetailClient } from "@/components/rent/RentDetailClient";
import {
  getRentalProductBySlug,
  getRentalProductSlugs,
} from "@/lib/sanity-content";

export async function generateStaticParams() {
  const slugs = await getRentalProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getRentalProductBySlug(slug);
  if (!product) return { title: "Rental Not Found" };

  return {
    title: `${product.name} — Rental`,
    description: `Rent the ${product.name} from RM${product.rentalPricePerDay}/day. ${product.description}`,
    openGraph: {
      title: `${product.name} — Rental | Torexia`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
  };
}

export default async function RentProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getRentalProductBySlug(slug);
  if (!product) notFound();

  return (
    <Section tone="cream" className="pt-28 sm:pt-32">
      <nav className="mb-8 text-xs tracking-wide text-charcoal-600">
        <Link href="/" className="transition-colors hover:text-coffee">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/rent" className="transition-colors hover:text-coffee">
          Rent
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <RentDetailClient product={product} />
    </Section>
  );
}
