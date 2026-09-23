"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart, cartOrderMessage } from "@/lib/cart";
import { formatPrice, whatsappUrl } from "@/lib/constants";
import { EASE } from "@/lib/motion";

export function CartDrawer() {
  const { items, ready, isOpen, close, remove, setQty, subtotal, hasEnquiryOnly } =
    useCart();

  // Escape-to-close + scroll lock, self-contained (mirrors SearchModal.tsx).
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-heading text-xl uppercase tracking-[0.1em] text-charcoal">
                Cart
              </h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:bg-cream-200 hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!ready ? (
              <p className="px-6 py-10 text-sm text-charcoal-600">Loading your cart…</p>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="text-charcoal-600">Your cart is empty.</p>
                <Link
                  href="/collections"
                  onClick={close}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
                >
                  Browse collections
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-6">
                      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-base text-charcoal">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-xs text-charcoal-600">
                              {[
                                item.size && `Size ${item.size}`,
                                item.colour && item.colour,
                              ]
                                .filter(Boolean)
                                .join("  ·  ") || "—"}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:text-coffee"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQty(item.key, item.qty - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-coffee"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-6 text-center text-sm text-charcoal">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.key, item.qty + 1)}
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-coffee"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm text-coffee">
                            {item.price != null
                              ? formatPrice(item.price * item.qty)
                              : "Price on enquiry"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-6 py-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">Subtotal</span>
                    <span className="font-heading text-lg text-charcoal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {hasEnquiryOnly && (
                    <p className="mt-3 text-xs leading-relaxed text-charcoal-600">
                      Some pieces are priced on enquiry — we&apos;ll confirm the
                      final total with you on WhatsApp.
                    </p>
                  )}

                  <p className="mt-3 text-xs leading-relaxed text-charcoal-600">
                    Shipping is arranged after we confirm your order.
                  </p>

                  {hasEnquiryOnly ? (
                    <a
                      href={whatsappUrl(cartOrderMessage(items, subtotal))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
                    >
                      Checkout via WhatsApp
                    </a>
                  ) : (
                    <Link
                      href="/checkout"
                      onClick={close}
                      className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-coffee bg-coffee text-sm font-medium tracking-wide text-white transition-colors hover:bg-coffee/90"
                    >
                      Proceed to Checkout
                    </Link>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
