"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  // UI only for Phase 1 — no live subscription.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <Section tone="blush">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
          Stay in the loop
        </h2>
        <p className="mt-3 text-sm text-charcoal-600 sm:text-base">
          Get updates on new collections &amp; promotions.
        </p>

        {submitted ? (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-coffee px-6 py-3 text-sm text-cream">
            <Check className="h-4 w-4" /> Thank you — you&apos;re on the list!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="min-h-12 flex-1 rounded-full border border-charcoal/15 bg-cream px-6 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-coffee"
            />
            <button
              type="submit"
              className="min-h-12 rounded-full bg-coffee px-8 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-coffee-700"
            >
              Subscribe
            </button>
          </form>
        )}
      </Reveal>
    </Section>
  );
}
