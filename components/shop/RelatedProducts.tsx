import { getRelatedProducts } from "@/data/products";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({ slug }: { slug: string }) {
  const related = getRelatedProducts(slug, 3);
  if (related.length === 0) return null;

  return (
    <div className="border-t border-charcoal/10 pt-16">
      <Reveal>
        <h2 className="font-heading text-2xl text-charcoal sm:text-3xl">
          You may also like
        </h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
