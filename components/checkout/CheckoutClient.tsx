"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice, MALAYSIA_STATES, whatsappUrl } from "@/lib/constants";
import { cartOrderMessage } from "@/lib/cart";

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

export function CheckoutClient() {
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
    if (ready && items.length === 0) router.replace("/cart");
  }, [ready, items.length, router]);

  if (!ready || items.length === 0) return null;

  if (hasEnquiryOnly) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
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
    <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-line bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
      >
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
          {submitting ? "Redirecting to payment…" : `Pay ${formatPrice(subtotal)} with HitPay`}
        </button>

        <p className="text-center text-xs text-charcoal-600">
          You&apos;ll be redirected to HitPay&apos;s secure checkout to pay by FPX or card.
        </p>
      </form>

      <div className="lg:w-80">
        <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <h2 className="font-heading text-2xl text-charcoal">Order summary</h2>
          <ul className="mt-6 space-y-3 border-t border-line pt-5">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between text-sm">
                <span className="text-charcoal-600">
                  {item.name} × {item.qty}
                </span>
                <span className="text-charcoal">
                  {formatPrice((item.price ?? 0) * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-5 text-sm">
            <span className="text-charcoal-600">Total</span>
            <span className="font-heading text-lg text-coffee">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-charcoal-600">
            Free shipping — arranged after your order is placed.
          </p>
          <Link
            href="/cart"
            className="mt-4 block text-center text-xs font-medium uppercase tracking-[0.15em] text-blush transition-colors hover:text-coffee"
          >
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
