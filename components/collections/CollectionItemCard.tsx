import Image from "next/image";
import Link from "next/link";
import type { CollectionItem } from "@/lib/types";
import { PriceTag } from "@/components/ui/PriceTag";

/** Image-led item card — same visual language as CollectionCard, one level down. */
export function CollectionItemCard({
  collectionSlug,
  item,
  price,
  salePrice,
  priority = false,
}: {
  collectionSlug: string;
  item: CollectionItem;
  /** Resolved price (item's own, or inherited from the collection) */
  price: number | null;
  /** Resolved sale price, or null when not on sale */
  salePrice: number | null;
  priority?: boolean;
}) {
  const onSale = price != null && salePrice != null && salePrice < price;

  return (
    <Link
      href={`/collections/${collectionSlug}/${item.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
    >
      <Image
        src={item.images[0] ?? "/images/og.jpg"}
        alt={item.name}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        priority={priority}
        className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />

      {onSale && (
        <span className="absolute left-4 top-4 rounded-full bg-coffee px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white">
          Sale
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-heading text-xl uppercase tracking-[0.15em] text-white sm:text-2xl">
          {item.name}
        </h3>
        <PriceTag
          price={price}
          salePrice={salePrice}
          tone="light"
          className="mt-1.5 block text-sm"
        />
      </div>
    </Link>
  );
}
