import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getShippingSettings } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Torexia order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const shipping = await getShippingSettings();
  return <CheckoutClient shipping={shipping} />;
}
