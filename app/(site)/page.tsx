import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyTorexia } from "@/components/home/WhyTorexia";
import { NewArrivals } from "@/components/home/NewArrivals";
import { StylingInspiration } from "@/components/home/StylingInspiration";
import { ColourShowcase } from "@/components/home/ColourShowcase";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Faq } from "@/components/home/Faq";
import { BrandQuote } from "@/components/home/BrandQuote";
import { Newsletter } from "@/components/home/Newsletter";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Best Sellers */}
      <FeaturedProducts />
      <WhyTorexia />
      <NewArrivals />
      <StylingInspiration />
      <ColourShowcase />
      <CustomerReviews />
      <Faq />
      <BrandQuote />
      <Newsletter />
      <CtaBanner />
    </>
  );
}
