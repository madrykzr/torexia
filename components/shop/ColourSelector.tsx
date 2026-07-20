"use client";

import type { Colour } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ColourSelector({
  colours,
  selected,
  onSelect,
}: {
  colours: Colour[];
  selected: Colour;
  onSelect: (colour: Colour) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
          Colour
        </span>
        <span className="text-sm text-charcoal">{selected.name}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {colours.map((c) => {
          const active = c.slug === selected.slug;
          return (
            <button
              key={c.slug}
              onClick={() => onSelect(c)}
              aria-pressed={active}
              title={c.name}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-line transition-transform hover:scale-105",
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
  );
}
