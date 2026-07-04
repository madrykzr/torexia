import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { RelatedProducts } from "@/components/shop/RelatedProducts";
import { primaryImage } from "@/data/products";
import { getProductBySlug, getProductSlugs } from "@/lib/sanity-content";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: `${product.name} — ${product.fabric}. ${product.description}`,
    openGraph: {
      title: `${product.name} | Torexia`,
      description: product.description,
      images: [{ url: primaryImage(product), alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Section tone="cream" className="pt-28 sm:pt-32">
        <nav className="mb-8 text-xs tracking-wide text-charcoal-600">
          <Link href="/" className="transition-colors hover:text-coffee">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="transition-colors hover:text-coffee">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <ProductDetailClient product={product} />

        <div className="mt-20 sm:mt-28">
          <RelatedProducts slug={product.slug} />
        </div>
      </Section>
    </>
  );
}
