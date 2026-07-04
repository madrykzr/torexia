import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Torexia — Modest Fashion Malaysia",
    template: "Torexia — %s | Modest Fashion Malaysia",
  },
  description: SITE.description,
  keywords: [
    "modest fashion",
    "abaya",
    "daily abaya",
    "Malaysia",
    "cotton nida",
    "Torexia",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Torexia — Modest Fashion Malaysia",
    description: SITE.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Torexia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Torexia — Modest Fashion Malaysia",
    description: SITE.description,
    images: ["/images/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      {/* Google Analytics — GA_MEASUREMENT_ID to be added */}
      {/* Meta Pixel — PIXEL_ID to be added */}
      {/* TikTok Pixel — TIKTOK_PIXEL_ID to be added */}
      <body className="flex min-h-full flex-col bg-cream">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
