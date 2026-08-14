import { redirect } from "next/navigation";

// Individual abaya products are retired — Abaya is now a single collection
// like Kaftan/Jubah. The real page lives at page.tsx.disabled (fully intact);
// rename it back to restore per-item product pages.
export default function ShopProductPage() {
  redirect("/collections/abaya");
}
