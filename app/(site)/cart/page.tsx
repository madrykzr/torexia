import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CartClient } from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Torexia order and check out via WhatsApp.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Your order" title="Cart" />
      <Section tone="cream">
        <CartClient />
      </Section>
    </>
  );
}
