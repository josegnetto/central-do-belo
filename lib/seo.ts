import type { PostRow } from "@/lib/supabase/types";
import { getCategoryByValue } from "@/lib/constants";
import { SITE_NAME } from "@/lib/constants";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return url && url.length > 0 ? url.replace(/\/$/, "") : "http://localhost:3000";
}

export function getPostUrlPath(post: Pick<PostRow, "category" | "slug">): string {
  const category = getCategoryByValue(post.category);
  return `/${category.slug}/${post.slug}`;
}

export function getPostAbsoluteUrl(post: Pick<PostRow, "category" | "slug">): string {
  return `${getSiteUrl()}${getPostUrlPath(post)}`;
}

export function buildNewsArticleJsonLd(post: PostRow) {
  const url = getPostAbsoluteUrl(post);
  const category = getCategoryByValue(post.category);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    articleSection: category.label,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/logo.png`,
      },
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}
