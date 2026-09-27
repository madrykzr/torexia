"use client";

import type { Size } from "@/lib/types";
import { cn } from "@/lib/cn";

export function SizeSelector({
  sizes,
  soldOut = [],
  selected,
  onSelect,
}: {
  sizes: Size[];
  /** Sizes to show crossed out and unselectable */
  soldOut?: Size[];
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
          const isSoldOut = soldOut.includes(s);
          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              disabled={isSoldOut}
              aria-pressed={active}
              aria-label={isSoldOut ? `${s} (sold out)` : s}
              className={cn(
                "relative flex h-11 min-w-12 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors",
                isSoldOut
                  ? "cursor-not-allowed border-line text-charcoal-600/40"
                  : active
                    ? "border-coffee bg-coffee text-cream"
                    : "border-line text-charcoal hover:border-coffee",
              )}
            >
              {s}
              {isSoldOut && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-charcoal-600/40"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
