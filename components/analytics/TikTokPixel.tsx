"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { isValidTikTokPixelId, ttqPage } from "@/lib/tiktok";

/**
 * TikTok Pixel — base code from TikTok's own snippet, loaded after the page is
 * interactive. TikTok counts the first page view itself (the `ttq.page()` in
 * the snippet); because this site changes pages without reloading the browser,
 * every later page change is reported here.
 *
 * The Pixel ID comes from Studio → Site Settings. Leave it blank there and the
 * pixel is not loaded at all.
 */
export function TikTokPixel({ pixelId }: { pixelId: string | null }) {
  const pathname = usePathname();
  const firstPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pixelId) return;
    if (firstPath.current === null) {
      firstPath.current = pathname; // the snippet already reported this one
      return;
    }
    if (pathname !== firstPath.current) {
      firstPath.current = pathname;
      ttqPage();
    }
  }, [pathname, pixelId]);

  if (!isValidTikTokPixelId(pixelId)) return null;

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load(${JSON.stringify(pixelId)});
  ttq.page();
}(window, document, 'ttq');
`}
    </Script>
  );
}
