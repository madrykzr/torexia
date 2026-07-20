import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getFeaturedProducts } from "@/lib/sanity-content";

export async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  if (featured.length === 0) return null;

  return (
    <Section tone="white">
      <SectionHeading
        align="left"
        eyebrow="Best Sellers"
        title="Loved by our community"
        description="A closer look at the pieces our community reaches for most."
      />

      {/* Horizontal snap carousel on mobile, grid on desktop */}
      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 no-scrollbar sm:mt-14 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0">
        {featured.map((product, i) => (
          <Reveal
            key={product.id}
            delay={i * 0.08}
            className="min-w-[74%] shrink-0 snap-start sm:min-w-0"
          >
            <ProductCard product={product} priority={i === 0} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center sm:justify-start">
        <ButtonLink href="/shop" variant="outline">
          View All Products
        </ButtonLink>
      </div>
    </Section>
  );
}
