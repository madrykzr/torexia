"use client";

import type { Size } from "@/lib/types";
import { cn } from "@/lib/cn";

export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: Size[];
  selected: Size;
  onSelect: (size: Size) => void;
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
        Size
      </span>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {sizes.map((s) => {
          const active = s === selected;
          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              aria-pressed={active}
              className={cn(
                "flex h-11 min-w-12 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors",
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
  );
}
