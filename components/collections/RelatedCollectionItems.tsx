import Image from "next/image";
import Link from "next/link";
import { getCollectionItemsByCollectionSlug } from "@/lib/sanity-content";
import { Reveal } from "@/components/ui/Reveal";

export async function RelatedCollectionItems({
  collectionSlug,
  currentSlug,
}: {
  collectionSlug: string;
  currentSlug: string;
}) {
  const items = await getCollectionItemsByCollectionSlug(collectionSlug);
  const others = items.filter((item) => item.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <div className="border-t border-line pt-16">
      <Reveal>
        <h2 className="font-heading text-2xl text-charcoal sm:text-3xl">
          More colours
        </h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
        {others.map((item) => (
          <Link
            key={item.id}
            href={`/collections/${collectionSlug}/${item.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream-200">
              <Image
                src={item.images[0] ?? "/images/og.jpg"}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-sm text-charcoal">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
