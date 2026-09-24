"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatPrice, MALAYSIA_STATES, whatsappUrl } from "@/lib/constants";
import { cartOrderMessage } from "@/lib/cart";
import { shippingFee, type ShippingSettings } from "@/lib/shipping";

const inputClass =
  "min-h-12 w-full rounded-xl border border-line bg-cream px-4 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-coffee";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-600">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function CheckoutClient({ shipping }: { shipping: ShippingSettings }) {
  const router = useRouter();
  const { items, ready, subtotal, hasEnquiryOnly } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && items.length === 0) router.replace("/collections");
  }, [ready, items.length, router]);

  if (!ready || items.length === 0) return null;

  const fee = shippingFee(state, subtotal, shipping);
  const total = subtotal + fee;
  // Until a state is chosen we can't know the fee, so don't claim "Free".
  const feeMayApply =
    !state && (shipping.feeWest != null || shipping.feeEast != null);

  if (hasEnquiryOnly) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-charcoal-600">
          Some pieces in your cart are priced on enquiry, so we can&apos;t take
          online payment for this order yet.
        </p>
        <a
          href={whatsappUrl(cartOrderMessage(items, subtotal))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
        >
          Checkout via WhatsApp
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: { line1, line2, city, state, postcode },
          items: items.map((i) => ({
            name: i.name,
            slug: i.slug,
            kind: i.kind,
            size: i.size,
            colour: i.colour,
            price: i.price,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2">
      {/* Form panel */}
      <div className="px-6 py-10 sm:px-12 sm:py-14 lg:py-16">
        <h1 className="font-heading text-3xl text-charcoal">Checkout</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Phone">
              <input
                required
                type="tel"
                placeholder="e.g. 0132209408"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Address line 1">
            <input
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Address line 2 (optional)">
            <input
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="City">
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="State">
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select
                </option>
                {MALAYSIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Postcode">
              <input
                required
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-12 w-full items-center justify-center rounded-full border border-coffee bg-coffee text-sm font-medium tracking-wide text-white transition-colors hover:bg-coffee/90 disabled:opacity-50"
          >
            {submitting ? "Redirecting to payment…" : `Pay ${formatPrice(total)} with HitPay`}
          </button>

          <p className="text-center text-xs text-charcoal-600">
            You&apos;ll be redirected to HitPay&apos;s secure checkout to pay by FPX or card.
          </p>
        </form>
      </div>

      {/* Order summary panel */}
      <div className="border-t border-line bg-cream-200 px-6 py-10 sm:px-12 sm:py-14 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:border-l lg:border-t-0 lg:py-16">
        <h2 className="font-heading text-2xl text-charcoal">Order summary</h2>
        <ul className="mt-8 space-y-5">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4">
              <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="52px"
                  className="object-cover"
                />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-medium text-white">
                  {item.qty}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-charcoal">{item.name}</p>
                  <p className="text-xs text-charcoal-600">
                    {[item.size && `Size ${item.size}`, item.colour]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm text-charcoal">
                  {formatPrice((item.price ?? 0) * item.qty)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-2 border-t border-line/70 pt-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-charcoal-600">Subtotal</span>
            <span className="text-charcoal">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoal-600">Shipping</span>
            <span className="text-charcoal">
              {feeMayApply
                ? "Choose your state"
                : fee > 0
                  ? formatPrice(fee)
                  : "Free"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-line/70 pt-3">
            <span className="text-charcoal-600">Total</span>
            <span className="font-heading text-lg text-coffee">
              {formatPrice(total)}
            </span>
          </div>
        </div>
        <Link
          href="/collections"
          className="mt-6 block text-center text-xs font-medium uppercase tracking-[0.15em] text-blush transition-colors hover:text-coffee"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
