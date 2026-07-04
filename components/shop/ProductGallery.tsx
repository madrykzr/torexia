"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-cream-200 text-sm text-charcoal-600">
        No images yet
      </div>
    );
  }

  return (
    <div>
      {/* Mobile: swipeable carousel with dots */}
      <div className="sm:hidden">
        <div
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl no-scrollbar"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[3/4] w-full shrink-0 snap-center bg-cream-200"
            >
              <Image
                src={src}
                alt={`${alt} — view ${i + 1}`}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-5 bg-coffee" : "w-1.5 bg-charcoal/25",
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: main image + thumbnails */}
      <div className="hidden sm:block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200">
          <Image
            src={images[active]}
            alt={alt}
            fill
            sizes="45vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="mt-4 grid grid-cols-6 gap-2.5">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-[3/4] overflow-hidden rounded-lg ring-1 transition",
                i === active
                  ? "ring-2 ring-coffee"
                  : "ring-charcoal/10 hover:ring-coffee/40",
              )}
            >
              <Image src={src} alt="" fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
