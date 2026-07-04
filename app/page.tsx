import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyTorexia } from "@/components/home/WhyTorexia";
import { ColourShowcase } from "@/components/home/ColourShowcase";
import { BrandQuote } from "@/components/home/BrandQuote";
import { Newsletter } from "@/components/home/Newsletter";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyTorexia />
      <ColourShowcase />
      <BrandQuote />
      <Newsletter />
      <CtaBanner />
    </>
  );
}
