"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { SearchEntry } from "@/lib/types";

export function SearchModal({
  open,
  onClose,
  index,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchEntry[];
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input and lock scroll while open; reset the query on close.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Focus after the enter animation begins.
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
    document.body.style.overflow = "";
    setQ("");
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index
      .filter((e) => e.name.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, index]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center bg-charcoal/30 px-4 pt-24 backdrop-blur-md sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <motion.div
            className="h-fit w-full max-w-xl overflow-hidden rounded-2xl border border-white/40 bg-cream/80 shadow-2xl backdrop-blur-2xl"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line/70 px-5">
              <Search className="h-5 w-5 shrink-0 text-charcoal-600" />
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products & collections…"
                className="min-h-14 w-full bg-transparent text-base text-charcoal placeholder:text-charcoal-600 focus:outline-none"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:bg-cream-200 hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {q.trim() && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  results.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/70"
                    >
                      <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                        <Image
                          src={r.image}
                          alt={r.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-charcoal">
                          {r.name}
                        </span>
                        <span className="mt-0.5 block text-xs uppercase tracking-[0.12em] text-charcoal-600">
                          {r.category}
                        </span>
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-6 text-center text-sm text-charcoal-600">
                    No results for “{q.trim()}”.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
