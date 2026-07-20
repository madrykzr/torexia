"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUpContainer as container, fadeUpItem as item } from "@/lib/motion";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden sm:items-center">
      <Image
        src="/images/hero.jpg"
        alt="Torexia model wearing a Coffee daily abaya"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_top]"
      />
      {/* Soft warm-white veil — keeps the hero light and airy while holding text legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/85 to-cream/40 sm:bg-gradient-to-r sm:from-cream sm:via-cream/80 sm:to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:py-0"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300"
        >
          {SITE.tagline}
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-6 max-w-3xl font-heading text-5xl leading-[1.08] text-charcoal sm:text-7xl"
        >
          Designed for Comfort &amp; Confidence
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-5 max-w-md text-base leading-relaxed text-charcoal-600 sm:text-lg"
        >
          {SITE.promise}
        </motion.p>
        <motion.div variants={item} className="mt-9">
          <ButtonLink href="/shop" variant="outline" className="min-h-12 px-9">
            Shop Now
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
