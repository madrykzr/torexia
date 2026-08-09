import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";

/** Image-led collection card — cover photo with the name overlaid. */
export function CollectionCard({
  collection,
  priority = false,
}: {
  collection: Collection;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
    >
      <Image
        src={collection.cover}
        alt={collection.name}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        priority={priority}
        className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-heading text-xl uppercase tracking-[0.15em] text-white sm:text-2xl">
          {collection.name}
        </h3>
      </div>
    </Link>
  );
}
