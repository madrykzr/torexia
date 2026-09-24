import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Not for search results: the CMS, API routes and the checkout flow.
      disallow: ["/studio", "/api/", "/checkout", "/cart"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
