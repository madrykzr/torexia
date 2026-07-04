import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getNewArrivals } from "@/lib/sanity-content";

export async function NewArrivals() {
  const products = await getNewArrivals(3);

  if (products.length === 0) return null;

  return (
    <Section tone="cream">
      <SectionHeading
        align="left"
        eyebrow="New Arrivals"
        title="Just landed"
        description="The latest additions to the Torexia collection."
      />

      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 no-scrollbar sm:mt-14 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0">
        {products.map((product, i) => (
          <Reveal
            key={product.id}
            delay={i * 0.08}
            className="min-w-[74%] shrink-0 snap-start sm:min-w-0"
          >
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center sm:justify-start">
        <ButtonLink href="/shop" variant="outline">
          Shop New In
        </ButtonLink>
      </div>
    </Section>
  );
}
