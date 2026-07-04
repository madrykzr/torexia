import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

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
    "Abaya Malaysia",
    "Premium Abaya",
    "Muslimah Fashion",
    "Modest Wear Malaysia",
    "Elegant Abaya",
    "Abaya Premium Malaysia",
    "Plus Size Abaya",
    "Kaftan Malaysia",
    "Muslimah Clothing",
    "Modest Fashion Malaysia",
    "Abaya Kuala Lumpur",
    "Luxury Abaya Malaysia",
    "Daily Abaya",
    "Tudung Bawal",
    "Scrunchies",
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
      <body className="bg-cream">{children}</body>
    </html>
  );
}
