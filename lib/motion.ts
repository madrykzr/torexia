import type { Variants } from "framer-motion";

/** Shared "soft" cubic-bezier easing, typed as a bezier tuple for Framer. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUpContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
