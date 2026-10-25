import { Hero } from "@/components/home/Hero";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewArrivals } from "@/components/home/NewArrivals";
import { StylingInspiration } from "@/components/home/StylingInspiration";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Faq } from "@/components/home/Faq";
import { getHomeFaqAndReviews, getHomePage } from "@/lib/sanity-content";

export default async function HomePage() {
  const [home, { faqs, reviews }] = await Promise.all([getHomePage(), getHomeFaqAndReviews()]);

  return (
    <>
      {home?.promoEnabled && home.promoText && (
        <PromoBanner text={home.promoText} href={home.promoHref} />
      )}
      <Hero
        slides={home?.heroSlides}
        seconds={home?.heroSlideSeconds}
        heading={home?.heroHeading}
        subheading={home?.heroSubheading}
        ctaLabel={home?.heroCtaLabel}
        ctaHref={home?.heroCtaHref}
        image={home?.heroImage}
      />
      <FeaturedCollections collections={home?.featuredCollections ?? []} />
      <NewArrivals items={home?.newArrivals ?? []} />
      <StylingInspiration />
      <CustomerReviews reviews={reviews} />
      <Faq faqs={faqs} />
      {/* Newsletter sign-up hidden until it actually saves emails — see components/home/Newsletter.tsx */}
    </>
  );
}
