import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { TikTokPixel } from "@/components/analytics/TikTokPixel";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CartProvider } from "@/lib/cart";
import { resolveContact } from "@/lib/constants";
import {
  getSearchIndex,
  getGoogleAnalyticsId,
  getMetaPixelId,
  getPolicyLinks,
  getSiteSettings,
  getTikTokPixelId,
  getWelcomePopup,
} from "@/lib/sanity-content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [searchIndex, settings, popup, tiktokPixelId, metaPixelId, googleAnalyticsId, policies] = await Promise.all([
    getSearchIndex(),
    getSiteSettings(),
    getWelcomePopup(),
    getTikTokPixelId(),
    getMetaPixelId(),
    getGoogleAnalyticsId(),
    getPolicyLinks(),
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
        <Footer contact={contact} policies={policies} />
        <WhatsAppButton contact={contact} />
        <CartDrawer contact={contact} />
        <WelcomePopup config={popup} />
        <TikTokPixel pixelId={tiktokPixelId} />
        <MetaPixel pixelId={metaPixelId} />
        <GoogleAnalytics measurementId={googleAnalyticsId} />
      </div>
    </CartProvider>
  );
}
