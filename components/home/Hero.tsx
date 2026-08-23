"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUpContainer as container, fadeUpItem as item } from "@/lib/motion";
import { SITE } from "@/lib/constants";

export function Hero({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  image,
}: {
  heading?: string | null;
  subheading?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  image?: string | null;
} = {}) {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden sm:items-center">
      <Image
        src={image || "/images/hero.jpg"}
        alt="Torexia modest fashion"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_top]"
      />
      {/* Soft warm-white veil — lighter now so more of the photo shows, while
          still holding the bottom-left text legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/55 to-transparent sm:bg-gradient-to-r sm:from-cream/95 sm:via-cream/35 sm:to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-36 sm:px-8 sm:py-0"
      >
        <motion.h1
          variants={item}
          className="max-w-3xl font-heading text-5xl leading-[1.08] text-charcoal sm:text-7xl"
        >
          {heading || "Designed for Comfort & Confidence"}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-5 max-w-md text-base leading-relaxed text-charcoal-600 sm:text-lg"
        >
          {subheading || SITE.promise}
        </motion.p>
        <motion.div variants={item} className="mt-9">
          <ButtonLink
            href={ctaHref || "/collections"}
            variant="outline"
            className="min-h-12 px-9"
          >
            {ctaLabel || "Explore Collections"}
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
