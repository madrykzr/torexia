import Image from "next/image";
import Link from "next/link";
import { CartProvider } from "@/lib/cart";

// Minimal, distraction-free shell for checkout — no nav links, search, cart
// icon, footer or watermark. Just enough branding to feel like Torexia.
export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      <div className="min-h-svh bg-white">
        <header className="flex items-center justify-center border-b border-line py-6">
          <Link href="/" aria-label="Torexia home">
            <Image
              src="/images/logo.svg"
              alt="Torexia"
              width={177}
              height={32}
              priority
              className="h-7 w-auto"
            />
          </Link>
        </header>
        <main>{children}</main>
      </div>
    </CartProvider>
  );
}
