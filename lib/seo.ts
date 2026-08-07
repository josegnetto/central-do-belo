import type { PostRow } from "@/lib/supabase/types";
import { getCategoryByValue } from "@/lib/constants";
import {
  EDITORIAL_BYLINE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_LINKS,
  getContactEmail,
} from "@/lib/constants";

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

function buildPublisher() {
  const siteUrl = getSiteUrl();
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logobelo.png`,
    },
  };
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
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: buildPublisher(),
    author: {
      "@type": "Organization",
      name: EDITORIAL_BYLINE,
      url: `${getSiteUrl()}/sobre`,
    },
  };
}

/**
 * Identidade do veículo para o Google. Deixa explícito quem publica o site,
 * como falar com a redação e onde estão os perfis oficiais — os mesmos dados
 * que a análise do AdSense procura para confirmar que existe um responsável
 * real por trás do conteúdo.
 */
export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  const email = getContactEmail();

  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    logo: `${siteUrl}/logobelo.png`,
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.x],
    email: email ?? undefined,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${siteUrl}/contato`,
      email: email ?? undefined,
      availableLanguage: ["Portuguese"],
    },
    ethicsPolicy: `${siteUrl}/politica-editorial`,
    correctionsPolicy: `${siteUrl}/politica-editorial`,
  };
}

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "pt-BR",
    publisher: buildPublisher(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/busca?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
