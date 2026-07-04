import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { Collections } from "@/components/shop/Collections";
import { getAllProducts } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Torexia daily abayas — crafted from soft cotton nida in six calming shades. Filter by colour and size to find your everyday staple.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <PageHeader
        eyebrow="The Collection"
        title="Shop"
        subtitle="Everyday abayas in soft cotton nida — designed for comfort, confidence and effortless elegance."
      />
      <Collections />
      <Section tone="cream">
        <h2 className="mb-8 font-heading text-3xl text-charcoal sm:text-4xl">
          All pieces
        </h2>
        <ShopBrowser products={products} />
      </Section>
    </>
  );
}
