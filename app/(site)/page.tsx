import { Hero } from "@/components/home/Hero";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewArrivals } from "@/components/home/NewArrivals";
import { StylingInspiration } from "@/components/home/StylingInspiration";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Faq } from "@/components/home/Faq";
import { BrandQuote } from "@/components/home/BrandQuote";
import { Newsletter } from "@/components/home/Newsletter";
import { CtaBanner } from "@/components/home/CtaBanner";
import { getHomePage } from "@/lib/sanity-content";

export default async function HomePage() {
  const home = await getHomePage();

  return (
    <>
      {home?.promoEnabled && home.promoText && (
        <PromoBanner text={home.promoText} href={home.promoHref} />
      )}
      <Hero
        heading={home?.heroHeading}
        subheading={home?.heroSubheading}
        ctaLabel={home?.heroCtaLabel}
        ctaHref={home?.heroCtaHref}
        image={home?.heroImage}
      />
      <FeaturedCollections collections={home?.featuredCollections ?? []} />
      <NewArrivals items={home?.newArrivals ?? []} />
      <StylingInspiration />
      <CustomerReviews />
      <Faq />
      <BrandQuote />
      <Newsletter />
      <CtaBanner />
    </>
  );
}
