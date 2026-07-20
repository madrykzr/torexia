import Image from "next/image";
import Link from "next/link";
import type { RentalProduct } from "@/lib/types";
import { rentalMessage, whatsappUrl } from "@/lib/constants";

export function RentCard({
  product,
  priority = false,
}: {
  product: RentalProduct;
  priority?: boolean;
}) {
  const cover = product.images[0] ?? "/images/og.jpg";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow duration-500 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <Link href={`/rent/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream-200">
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 30vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
          />
        </div>
        <div className="mt-5 px-1">
          <h3 className="font-heading text-lg text-charcoal">{product.name}</h3>
          <p className="mt-1 text-sm text-charcoal-600">
            RM{product.rentalPricePerDay}
            <span className="text-charcoal-600">/day</span>
          </p>
          {product.colours.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {product.colours.slice(0, 5).map((c) => (
                <span
                  key={c.slug}
                  title={c.name}
                  className="h-3.5 w-3.5 rounded-full ring-1 ring-line"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <a
        href={whatsappUrl(rentalMessage({ name: product.name }))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
      >
        Book Now
      </a>
    </div>
  );
}
