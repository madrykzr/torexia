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
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-[0_1px_2px_rgba(28,28,28,0.03)] transition-shadow duration-500 hover:shadow-[0_16px_40px_-16px_rgba(28,28,28,0.16)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream-200">
        <Image
          src={primaryImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-3 px-1">
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
              className="h-3.5 w-3.5 rounded-full ring-1 ring-line"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
      <span className="mb-1 mt-4 inline-block px-1 text-xs font-medium uppercase tracking-[0.15em] text-blush transition-colors group-hover:text-coffee">
        View Details →
      </span>
    </Link>
  );
}
