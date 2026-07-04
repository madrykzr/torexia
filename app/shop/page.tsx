import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Torexia daily abayas — crafted from soft cotton nida in six calming shades. Filter by colour and size to find your everyday staple.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Collection"
        title="Shop"
        subtitle="Everyday abayas in soft cotton nida — designed for comfort, confidence and effortless elegance."
      />
      <Section tone="cream">
        <ShopBrowser products={products} />
      </Section>
    </>
  );
}
