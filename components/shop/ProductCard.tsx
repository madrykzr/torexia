import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/constants";
import { primaryImage } from "@/data/products";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200">
        <Image
          src={primaryImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg text-charcoal">{product.name}</h3>
          <p className="mt-1 text-sm text-charcoal-600">
            {formatPrice(product.price)}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {product.colours.slice(0, 5).map((c) => (
            <span
              key={c.slug}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full ring-1 ring-charcoal/15"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
      <span className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-blush transition-colors group-hover:text-coffee">
        View Details →
      </span>
    </Link>
  );
}
