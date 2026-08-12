"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart, cartOrderMessage } from "@/lib/cart";
import { formatPrice, whatsappUrl } from "@/lib/constants";

export function CartClient() {
  const { items, ready, remove, setQty, subtotal, hasEnquiryOnly } = useCart();

  if (!ready) {
    return <p className="py-10 text-sm text-charcoal-600">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-charcoal-600">Your cart is empty.</p>
        <Link
          href="/collections"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
        >
          Browse collections
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
      {/* Line items */}
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
            <div className="relative h-28 w-21 shrink-0 overflow-hidden rounded-xl bg-cream-200 sm:h-36 sm:w-28">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg text-charcoal">
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
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:text-coffee"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(item.key, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-coffee"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-8 text-center text-sm text-charcoal">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => setQty(item.key, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-coffee"
                  >
                    <Plus className="h-3.5 w-3.5" />
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

      {/* Summary */}
      <div className="lg:w-80">
        <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <h2 className="font-heading text-2xl text-charcoal">Order summary</h2>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
            <span className="text-charcoal-600">Subtotal</span>
            <span className="text-charcoal">{formatPrice(subtotal)}</span>
          </div>

          {hasEnquiryOnly && (
            <p className="mt-3 text-xs leading-relaxed text-charcoal-600">
              Some pieces are priced on enquiry — we&apos;ll confirm the final
              total with you on WhatsApp.
            </p>
          )}

          <p className="mt-3 text-xs leading-relaxed text-charcoal-600">
            Shipping is arranged after we confirm your order.
          </p>

          <a
            href={whatsappUrl(cartOrderMessage(items, subtotal))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
          >
            Checkout via WhatsApp
          </a>

          <Link
            href="/collections"
            className="mt-3 block text-center text-xs font-medium uppercase tracking-[0.15em] text-blush transition-colors hover:text-coffee"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
