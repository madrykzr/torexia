import type { Collection, CollectionItem } from "@/lib/types";
import { CollectionItemCard } from "./CollectionItemCard";

const CATEGORY_LABEL: Record<string, string> = {
  kaftan: "Kaftan",
  jubah: "Jubah",
  abaya: "Abaya",
};

/**
 * Shown instead of CollectionDetailClient once a collection has individual
 * colour items configured — browsing moves from "one page, pick a colour"
 * to "grid of colours, pick a piece", same card style as /collections.
 */
export function CollectionItemsGrid({
  collection,
  items,
}: {
  collection: Collection;
  items: CollectionItem[];
}) {
  return (
    <div>
      {collection.category && (
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush">
          {CATEGORY_LABEL[collection.category] ?? collection.category}
        </p>
      )}
      <h1 className="mt-2 font-heading text-4xl text-charcoal sm:text-5xl">
        {collection.name}
      </h1>
      {collection.description && (
        <p className="mt-4 max-w-2xl text-sm leading-loose text-charcoal-600">
          {collection.description}
        </p>
      )}

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-3">
        {items.map((item, i) => (
          <CollectionItemCard
            key={item.id}
            collectionSlug={collection.slug}
            item={item}
            priority={i < 3}
          />
        ))}
      </div>
    </div>
  );
}
