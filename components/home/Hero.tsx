"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { fadeUpContainer as container, fadeUpItem as item } from "@/lib/motion";

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
      <div className="absolute inset-0 bg-gradient-to-t from-coffee/85 via-coffee/35 to-coffee/45 sm:bg-gradient-to-r sm:from-coffee/80 sm:via-coffee/40 sm:to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:py-0"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.3em] text-blush-300"
        >
          New Collection
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-5 max-w-2xl font-heading text-4xl leading-[1.1] text-cream sm:text-6xl"
        >
          Designed for Comfort &amp; Confidence
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-5 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg"
        >
          Modest fashion for real everyday women.
        </motion.p>
        <motion.div variants={item} className="mt-9">
          <ButtonLink href="/shop" variant="light" className="min-h-12 px-9">
            Shop Now
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
