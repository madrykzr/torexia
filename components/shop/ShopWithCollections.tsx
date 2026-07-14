"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { getLenis } from "@/lib/lenis";
import { Section } from "@/components/ui/Section";
import { Collections } from "./Collections";
import { ShopBrowser } from "./ShopBrowser";

export function ShopWithCollections({ products }: { products: Product[] }) {
  const [collection, setCollection] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  function handleExplore(value: string) {
    // Scroll BEFORE changing the filter: the grid heading position is
    // filter-independent, and scrolling first avoids Lenis re-clamping the
    // scroll when the grid resizes on the state change. Offset clears the
    // fixed navbar. Native scroll is decoupled under Lenis, so drive Lenis.
    const el = gridRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo({ top });
    }
    setCollection(value);
  }

  return (
    <>
      <Collections onExplore={handleExplore} />
      <Section tone="cream">
        <div ref={gridRef} className="scroll-mt-24">
          <h2 className="mb-8 font-heading text-3xl text-charcoal sm:text-4xl">
            All pieces
          </h2>
          <ShopBrowser
            products={products}
            collection={collection}
            onCollectionChange={setCollection}
          />
        </div>
      </Section>
    </>
  );
}
