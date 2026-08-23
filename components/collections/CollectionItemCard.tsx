import Image from "next/image";
import Link from "next/link";
import type { CollectionItem } from "@/lib/types";

/** Image-led item card — same visual language as CollectionCard, one level down. */
export function CollectionItemCard({
  collectionSlug,
  item,
  priority = false,
}: {
  collectionSlug: string;
  item: CollectionItem;
  priority?: boolean;
}) {
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
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-heading text-xl uppercase tracking-[0.15em] text-white sm:text-2xl">
          {item.name}
        </h3>
      </div>
    </Link>
  );
}
