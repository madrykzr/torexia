import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/lib/cart";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      <div className="flex min-h-svh flex-col">
        {/* Logomania — subtle fixed monogram watermark behind all content */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: "url(/images/icon.svg)",
            backgroundSize: "132px",
            backgroundRepeat: "repeat",
          }}
        />
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}
