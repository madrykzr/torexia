"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { fbqPageView, isValidMetaPixelId } from "@/lib/meta";

/**
 * Meta Pixel — base code from Meta's own snippet, loaded after the page is
 * interactive. The snippet reports the first page view itself; because this
 * site changes pages without reloading the browser, every later page change is
 * reported here.
 *
 * The Pixel ID comes from Studio → Site Settings. Leave it blank there and the
 * pixel is not loaded at all.
 */
export function MetaPixel({ pixelId }: { pixelId: string | null }) {
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
      fbqPageView();
    }
  }, [pathname, pixelId]);

  if (!isValidMetaPixelId(pixelId)) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');
`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
