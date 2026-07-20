"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Product, Size } from "@/lib/types";
import { COLLECTIONS, COLOUR_LIST, SIZES } from "@/data/products";
import { cn } from "@/lib/cn";
import { ProductCard } from "./ProductCard";

const COLLECTION_TABS = [{ value: "all", label: "All" }, ...COLLECTIONS];

export function ShopBrowser({
  products,
  collection,
  onCollectionChange,
}: {
  products: Product[];
  collection: string;
  onCollectionChange: (value: string) => void;
}) {
  const [colours, setColours] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<Size>>(new Set());

  function toggle<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const collectionOk = collection === "all" || p.collection === collection;
      const colourOk =
        colours.size === 0 || p.colours.some((c) => colours.has(c.slug));
      const sizeOk = sizes.size === 0 || p.sizes.some((s) => sizes.has(s));
      return collectionOk && colourOk && sizeOk;
    });
  }, [products, collection, colours, sizes]);

  const hasFilters = colours.size > 0 || sizes.size > 0;

  return (
    <div>
      {/* Collection filter tabs — scroll horizontally on mobile, never wrap */}
      <div className="mb-8 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {COLLECTION_TABS.map((t) => {
          const active = collection === t.value;
          return (
            <button
              key={t.value}
              onClick={() => onCollectionChange(t.value)}
              aria-pressed={active}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-coffee bg-coffee text-cream"
                  : "border-line text-charcoal hover:border-coffee",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-5">
          {/* Colour filter */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
              Colour
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {COLOUR_LIST.map((c) => {
                const active = colours.has(c.slug);
                return (
                  <button
                    key={c.slug}
                    onClick={() => setColours((s) => toggle(s, c.slug))}
                    aria-pressed={active}
                    title={c.name}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line transition-transform hover:scale-105",
                      active && "ring-2 ring-coffee ring-offset-2 ring-offset-cream",
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="sr-only">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size filter */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
              Size
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {SIZES.map((s) => {
                const active = sizes.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => setSizes((set) => toggle(set, s))}
                    aria-pressed={active}
                    className={cn(
                      "flex h-9 min-w-11 items-center justify-center rounded-full border px-3 text-sm transition-colors",
                      active
                        ? "border-coffee bg-coffee text-cream"
                        : "border-line text-charcoal hover:border-coffee",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasFilters && (
            <button
              onClick={() => {
                setColours(new Set());
                setSizes(new Set());
              }}
              className="inline-flex items-center gap-1 text-sm text-charcoal-600 transition-colors hover:text-coffee"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
          <span className="text-sm text-charcoal-600">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-charcoal-600">
          Coming soon — new pieces dropping soon! 🌙
        </p>
      )}
    </div>
  );
}
