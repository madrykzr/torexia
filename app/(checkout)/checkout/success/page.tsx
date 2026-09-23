import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your Torexia order confirmation.",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-charcoal-600">Loading…</p>}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
