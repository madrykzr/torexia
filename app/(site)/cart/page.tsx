import { redirect } from "next/navigation";

// The cart is now a slide-out drawer (components/cart/CartDrawer.tsx),
// available from every page — this route only exists to catch old links.
export default function CartPage() {
  redirect("/");
}
