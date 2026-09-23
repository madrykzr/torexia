import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your Torexia order confirmation.",
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageHeader eyebrow="Order status" title="Confirmation" />
      <Section tone="cream">
        <Suspense fallback={<p className="py-16 text-center text-charcoal-600">Loading…</p>}>
          <CheckoutSuccessClient />
        </Suspense>
      </Section>
    </>
  );
}
