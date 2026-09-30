import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { resolveContact } from "@/lib/constants";
import { getShippingSettings, getSiteSettings } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Torexia order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [shipping, settings] = await Promise.all([
    getShippingSettings(),
    getSiteSettings(),
  ]);
  return <CheckoutClient shipping={shipping} contact={resolveContact(settings)} />;
}
