"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import type { SearchEntry } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart";
import { MobileDrawer } from "./MobileDrawer";
import { SearchModal } from "./SearchModal";

export function Navbar({ searchIndex = [] }: { searchIndex?: SearchEntry[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, ready, open: openCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Every surface in this preset is light, so the bar stays soft warm white
  // throughout — no transparent/light-text overlay variant.
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Torexia home" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Torexia"
              width={177}
              height={32}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-[0.04em] transition-colors",
                    "text-charcoal/75 hover:text-coffee",
                    active && "text-coffee",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {/* Glass search pill (desktop) — icon only on mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="hidden items-center gap-2 rounded-full border border-line bg-white/40 px-4 py-2 text-sm text-charcoal-600 backdrop-blur-md transition-colors hover:border-coffee hover:text-coffee md:flex"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:text-coffee md:hidden"
            >
              <Search className="h-5 w-5" strokeWidth={1.6} />
            </button>

            <button
              onClick={openCart}
              aria-label={`Cart${ready && count > 0 ? ` (${count} items)` : ""}`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:text-coffee"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
              {ready && count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coffee px-1 text-[10px] font-medium text-white">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <p className="mx-auto max-w-6xl px-5 pb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-blush-300 sm:px-8">
          {SITE.tagline}
        </p>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        index={searchIndex}
      />
    </>
  );
}
