"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { MobileDrawer } from "./MobileDrawer";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Transparent (light text) only over the home hero when not scrolled.
  const overlay = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          overlay
            ? "bg-transparent"
            : "border-b border-charcoal/10 bg-cream/85 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Torexia home" className="flex items-center">
            <Image
              src={overlay ? "/images/logo-white.svg" : "/images/logo.svg"}
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
                    "text-sm tracking-wide transition-colors",
                    overlay
                      ? "text-cream/90 hover:text-white"
                      : "text-charcoal/80 hover:text-blush",
                    active && !overlay && "text-blush",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden",
              overlay ? "text-cream" : "text-coffee",
            )}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
