import { getLatestPosts } from "@/lib/posts";
import { getPostAbsoluteUrl, getSiteUrl } from "@/lib/seo";
import { stripCoverFraming } from "@/lib/cover-framing";
import { proxiedCoverAbsoluteUrl } from "@/lib/image-proxy";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getLatestPosts(20);

  const items = posts
    .map((post) => {
      const url = getPostAbsoluteUrl(post);
      const pubDate = new Date(post.published_at ?? post.created_at).toUTCString();
      const cover = post.cover_image_url
        ? proxiedCoverAbsoluteUrl(stripCoverFraming(post.cover_image_url), siteUrl)
        : null;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
      ${cover ? `<enclosure url="${escapeXml(cover)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>pt-BR</language>
    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
