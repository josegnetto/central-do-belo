import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/constants";
import { getAllLivePostsForSitemap } from "@/lib/posts";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await getAllLivePostsForSitemap();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${siteUrl}/publicacoes`, changeFrequency: "hourly", priority: 0.8 },
    ...CATEGORIES.map((category) => ({
      url: `${siteUrl}/${category.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/sobre`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/contato`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/politica-editorial`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/politica-de-privacidade`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/termos-de-uso`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const category = CATEGORIES.find((c) => c.value === post.category)!;
    return {
      url: `${siteUrl}/${category.slug}/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "daily" as const,
      priority: 0.6,
    };
  });

  return [...staticEntries, ...postEntries];
}
