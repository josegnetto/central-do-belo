import type { PostRow } from "@/lib/supabase/types";
import { getCategoryByValue } from "@/lib/constants";
import {
  EDITORIAL_BYLINE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_LINKS,
  getContactEmail,
} from "@/lib/constants";
import { stripCoverFraming } from "@/lib/cover-framing";

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

/**
 * Schema WebSite + SearchAction (home): habilita a caixa de busca do site
 * direto nos resultados do Google (sitelinks searchbox) e declara a
 * organização dona do site, com os perfis sociais vinculados.
 */
export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "pt-BR",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/busca?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logobelo.png`,
        },
        sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.x],
        email: getContactEmail() ?? undefined,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "editorial",
          url: `${siteUrl}/contato`,
          email: getContactEmail() ?? undefined,
          availableLanguage: ["Portuguese"],
        },
        ethicsPolicy: `${siteUrl}/politica-editorial`,
        correctionsPolicy: `${siteUrl}/politica-editorial`,
      },
    ],
  };
}

/** Schema BreadcrumbList: trilha de navegação rica nos resultados do Google. */
export function buildBreadcrumbJsonLd(items: { label: string; path?: string }[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.path !== undefined ? `${siteUrl}${item.path}` : undefined,
    })),
  };
}

/** Editora usada no JSON-LD das publicações (a home usa o @graph acima). */
function buildPublisher() {
  const siteUrl = getSiteUrl();
  return {
    "@type": "NewsMediaOrganization",
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
    image: post.cover_image_url ? [stripCoverFraming(post.cover_image_url)] : undefined,
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
