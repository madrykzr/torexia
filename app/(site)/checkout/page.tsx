import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Torexia order.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Almost there" title="Checkout" />
      <Section tone="cream">
        <CheckoutClient />
      </Section>
    </>
  );
}
