"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gift, Sparkles, X } from "lucide-react";
import { EASE } from "@/lib/motion";
import type { WelcomePopupConfig } from "@/lib/sanity-content";

const STORAGE_KEY = "torexia-welcome-popup";
const SHOW_AGAIN_AFTER_MS = 24 * 60 * 60 * 1000; // once a day per visitor
const OPEN_DELAY_MS = 1500;

// Confetti: fixed positions (no randomness, so server and browser always agree).
const CONFETTI = [
  { left: "6%", size: 8, delay: 0, dur: 5.2, color: "#f6d98b" },
  { left: "16%", size: 6, delay: 1.1, dur: 4.4, color: "#ffffff" },
  { left: "27%", size: 10, delay: 0.5, dur: 5.8, color: "#f6d98b" },
  { left: "38%", size: 6, delay: 2.0, dur: 4.8, color: "#ffc2d6" },
  { left: "49%", size: 8, delay: 0.9, dur: 5.5, color: "#ffffff" },
  { left: "60%", size: 10, delay: 1.6, dur: 4.6, color: "#f6d98b" },
  { left: "71%", size: 6, delay: 0.3, dur: 5.0, color: "#ffc2d6" },
  { left: "82%", size: 8, delay: 1.3, dur: 5.6, color: "#ffffff" },
  { left: "93%", size: 10, delay: 2.2, dur: 4.5, color: "#f6d98b" },
];

function readSeenRecently(): boolean {
  try {
    const last = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(last) && last > 0 && Date.now() - last < SHOW_AGAIN_AFTER_MS;
  } catch {
    return false; // storage blocked — fall back to showing it
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore — it will simply show again next visit
  }
}

/**
 * Festive "free gift" pop-up shown shortly after a visitor opens the site.
 * Wording is edited in Studio → Site Settings → Welcome pop-up. Shown once a
 * day per visitor, never on the checkout pages.
 */
export function WelcomePopup({ config }: { config: WelcomePopupConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const skip = !config.enabled || pathname.startsWith("/checkout");

  useEffect(() => {
    if (skip || readSeenRecently()) return;
    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [skip]);

  function close() {
    markSeen();
    setOpen(false);
  }

  // Esc closes; page behind doesn't scroll while the pop-up is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        markSeen();
        setOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    ctaRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const external = /^https?:\/\//i.test(config.buttonHref);
  const buttonClass =
    "group relative mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#fdf9f7] px-8 text-sm font-semibold uppercase tracking-[0.12em] text-coffee shadow-lg shadow-black/25 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6d98b]";
  const buttonInner = (
    <>
      {config.buttonLabel}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${config.heading} ${config.subheading}`}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-coffee-700 via-coffee to-[#b3125f] px-7 pb-8 pt-12 text-center text-white shadow-2xl shadow-black/40"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Glow behind the gift */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-6 h-52 w-52 -translate-x-1/2 rounded-full bg-[#f6d98b]/25 blur-3xl"
            />

            {/* Falling confetti */}
            {!reduceMotion &&
              CONFETTI.map((c, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute -top-4 rounded-[2px]"
                  style={{
                    left: c.left,
                    width: c.size,
                    height: c.size * 1.6,
                    backgroundColor: c.color,
                  }}
                  initial={{ y: -20, rotate: 0, opacity: 0 }}
                  animate={{ y: 520, rotate: 360, opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: c.dur,
                    delay: c.delay,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}

            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6d98b]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative">
              {/* Gift with a gentle wiggle and a pulsing ring */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                {!reduceMotion && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-[#f6d98b]"
                    animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <motion.div
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#fbe9b0] to-[#e9b949] text-coffee-700 shadow-xl shadow-black/30"
                  animate={
                    reduceMotion
                      ? undefined
                      : { rotate: [0, -10, 10, -6, 6, 0], y: [0, -6, 0] }
                  }
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
                >
                  <Gift className="h-10 w-10" strokeWidth={1.8} />
                </motion.div>
                <Sparkles
                  aria-hidden
                  className="absolute -right-2 -top-1 h-6 w-6 text-[#f6d98b]"
                />
                <Sparkles
                  aria-hidden
                  className="absolute -left-3 bottom-1 h-5 w-5 text-white/90"
                />
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-[#f6d98b]">
                {config.badge}
              </p>

              {/* Shimmering headline */}
              <motion.h2
                className="mt-2 bg-gradient-to-r from-[#f6d98b] via-white to-[#f6d98b] bg-[length:200%_100%] bg-clip-text font-heading text-5xl uppercase leading-[1.05] text-transparent sm:text-6xl"
                animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "200% 50%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              >
                {config.heading}
              </motion.h2>
              <p className="mt-2 font-heading text-2xl italic text-white sm:text-3xl">
                {config.subheading}
              </p>

              <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-white/85">
                {config.message}
              </p>

              {external ? (
                <a
                  ref={ctaRef}
                  href={config.buttonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className={buttonClass}
                >
                  {buttonInner}
                </a>
              ) : (
                <Link
                  ref={ctaRef}
                  href={config.buttonHref}
                  onClick={close}
                  className={buttonClass}
                >
                  {buttonInner}
                </Link>
              )}

              <button
                type="button"
                onClick={close}
                className="mt-4 text-xs text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Mungkin lain kali
              </button>

              {config.smallPrint && (
                <p className="mt-5 text-[11px] leading-relaxed text-white/55">
                  {config.smallPrint}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
