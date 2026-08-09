"use client";

import { useMemo, useState } from "react";
import type { Collection } from "@/lib/types";
import { cn } from "@/lib/cn";
import { CollectionCard } from "./CollectionCard";

const TABS = [
  { value: "all", label: "All" },
  { value: "kaftan", label: "Kaftan" },
  { value: "jubah", label: "Jubah" },
  { value: "abaya", label: "Abaya" },
];

export function CollectionsBrowser({
  collections,
}: {
  collections: Collection[];
}) {
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () =>
      category === "all"
        ? collections
        : collections.filter((c) => c.category === category),
    [collections, category],
  );

  return (
    <div>
      {/* Category tabs — scroll horizontally on mobile, never wrap */}
      <div className="mb-10 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((t) => {
          const active = category === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setCategory(t.value)}
              aria-pressed={active}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-sm transition-colors",
                active
                  ? "border-coffee bg-coffee text-white"
                  : "border-line text-charcoal hover:border-coffee",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <CollectionCard key={c.id} collection={c} priority={i < 3} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-charcoal-600">
          Coming soon — new pieces dropping soon! 🌙
        </p>
      )}
    </div>
  );
}
