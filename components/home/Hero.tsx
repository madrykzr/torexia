"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUpContainer as container, fadeUpItem as item } from "@/lib/motion";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { HeroSlide } from "@/lib/types";

const FALLBACK_POSITION = "70% top";

/**
 * Home page hero. With one picture it is a plain hero; with two or more it is
 * a slideshow that changes by itself, can be swiped or stepped with the arrows
 * and dots, and pauses while the visitor hovers over it or has the tab hidden.
 * The pictures and the optional per-slide words come from Studio → Home Page →
 * Hero slideshow. A slide with no words of its own uses the main hero words.
 */
export function Hero({
  slides,
  seconds = 6,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  image,
}: {
  slides?: HeroSlide[];
  seconds?: number;
  heading?: string | null;
  subheading?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  /** Old single hero picture — only used when there are no slides */
  image?: string | null;
} = {}) {
  const list: HeroSlide[] =
    slides && slides.length > 0
      ? slides
      : [
          {
            image: image || "/images/hero.jpg",
            alt: null,
            objectPosition: FALLBACK_POSITION,
            heading: null,
            subheading: null,
            ctaLabel: null,
            ctaHref: null,
          },
        ];
  const count = list.length;

  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = useCallback(
    (by: number) => setIndex((i) => (i + by + count) % count),
    [count],
  );

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Restarts after every change, so a manual click always gets a full pause.
  useEffect(() => {
    if (count < 2 || hovered || tabHidden || reduceMotion) return;
    const timer = window.setTimeout(() => step(1), seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [index, count, hovered, tabHidden, reduceMotion, seconds, step]);

  const active = list[Math.min(index, count - 1)];
  const text = {
    heading: active.heading || heading || "Designed for Comfort & Confidence",
    subheading: active.subheading || subheading || SITE.promise,
    ctaLabel: active.ctaLabel || ctaLabel || "Explore Collections",
    ctaHref: active.ctaHref || ctaHref || "/collections",
  };

  return (
    <section
      className="relative flex min-h-svh items-end overflow-hidden sm:items-center"
      style={{ touchAction: "pan-y" }}
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={count > 1 ? "Featured pictures" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      onTouchStart={(e) => {
        const t = e.touches[0] ?? e.changedTouches[0];
        if (t) touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const t = e.changedTouches[0];
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || count < 2 || !t) return;
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      }}
      onKeyDown={(e) => {
        if (count < 2) return;
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {list.map((slide, i) => (
        <div
          key={`${slide.image}-${i}`}
          aria-hidden={i !== index}
          className={cn(
            // The new picture fades in on top while the old one stays fully
            // visible underneath, and only then disappears — so there is never
            // a see-through moment in the middle of the change.
            "absolute inset-0 motion-reduce:transition-none",
            i === index
              ? "z-[1] opacity-100 transition-opacity duration-1000"
              : "pointer-events-none z-0 opacity-0 transition-opacity duration-0 delay-1000",
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt || "Torexia modest fashion"}
            fill
            priority={i === 0}
            sizes="100vw"
            // Slideshow pictures are served straight from Sanity's image CDN
            // (already resized and compressed), which keeps them from using up
            // Vercel's image-optimisation allowance.
            unoptimized={slide.image.startsWith("https://cdn.sanity.io/")}
            className="object-cover"
            style={{ objectPosition: slide.objectPosition }}
          />
        </div>
      ))}
      {/* Soft warm-white veil — lighter now so more of the photo shows, while
          still holding the bottom-left text legible */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-cream via-cream/55 to-transparent sm:bg-gradient-to-r sm:from-cream/95 sm:via-cream/35 sm:to-transparent" />

      <motion.div
        key={index}
        variants={container}
        initial={index === 0 ? "hidden" : "show"}
        animate="show"
        className="relative z-[3] mx-auto w-full max-w-6xl px-5 pb-24 pt-36 sm:px-8 sm:py-0"
      >
        <motion.h1
          variants={item}
          className="max-w-3xl font-heading text-5xl leading-[1.08] text-charcoal sm:text-7xl"
        >
          {text.heading}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-5 max-w-md text-base leading-relaxed text-charcoal-600 sm:text-lg"
        >
          {text.subheading}
        </motion.p>
        <motion.div variants={item} className="mt-9">
          <ButtonLink
            href={text.ctaHref}
            variant="outline"
            className="min-h-12 px-9"
          >
            {text.ctaLabel}
          </ButtonLink>
        </motion.div>
      </motion.div>

      {count > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-6 z-[4] mx-auto flex w-full max-w-6xl items-center gap-2 px-5 sm:px-8">
            {list.map((slide, i) => (
              <button
                key={`dot-${slide.image}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show picture ${i + 1} of ${count}`}
                aria-current={i === index}
                className="flex h-8 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full bg-coffee transition-all duration-300",
                    i === index ? "w-8" : "w-4 opacity-30",
                  )}
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous picture"
              className="ml-4 hidden h-9 w-9 items-center justify-center rounded-full bg-white/70 text-coffee shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee sm:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next picture"
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/70 text-coffee shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee sm:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
