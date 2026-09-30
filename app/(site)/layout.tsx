import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/lib/cart";
import { resolveContact } from "@/lib/constants";
import { getSearchIndex, getSiteSettings } from "@/lib/sanity-content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [searchIndex, settings] = await Promise.all([
    getSearchIndex(),
    getSiteSettings(),
  ]);
  const contact = resolveContact(settings);

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
        <Navbar searchIndex={searchIndex} contact={contact} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact} />
        <WhatsAppButton contact={contact} />
        <CartDrawer contact={contact} />
      </div>
    </CartProvider>
  );
}
