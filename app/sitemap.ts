import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import {
  getCollectionItemSlugPairs,
  getCollectionSlugs,
  getPostSlugs,
} from "@/lib/sanity-content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collectionSlugs, itemPairs, postSlugs] = await Promise.all([
    getCollectionSlugs(),
    getCollectionItemSlugPairs(),
    getPostSlugs(),
  ]);

  const url = (path: string) => `${SITE.url}${path}`;

  return [
    { url: url("/"), priority: 1 },
    { url: url("/collections"), priority: 0.9 },
    { url: url("/about"), priority: 0.5 },
    { url: url("/blog"), priority: 0.5 },
    { url: url("/contact"), priority: 0.5 },
    ...collectionSlugs.map((slug) => ({
      url: url(`/collections/${slug}`),
      priority: 0.8,
    })),
    ...itemPairs.map(({ slug, itemSlug }) => ({
      url: url(`/collections/${slug}/${itemSlug}`),
      priority: 0.7,
    })),
    ...postSlugs.map((slug) => ({ url: url(`/blog/${slug}`), priority: 0.4 })),
  ];
}
