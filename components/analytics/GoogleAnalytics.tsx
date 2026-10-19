import Script from "next/script";

/**
 * Google Analytics 4 — Google's own gtag.js snippet, loaded after the page is
 * interactive. GA4's built-in "enhanced measurement" reports the page changes
 * this site makes without reloading, so nothing else is needed here.
 *
 * The Measurement ID comes from Studio → Site Settings. Leave it blank there
 * and Google Analytics is not loaded at all.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string | null }) {
  if (!measurementId || !/^G-[A-Z0-9]{6,14}$/.test(measurementId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)});
`}
      </Script>
    </>
  );
}
