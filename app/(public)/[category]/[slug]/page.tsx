import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCategoryBySlug } from "@/lib/constants";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { renderTiptapContent } from "@/lib/tiptap-render";
import { buildNewsArticleJsonLd, getPostAbsoluteUrl } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { coverObjectPosition, stripCoverFraming } from "@/lib/cover-framing";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ShareButtons } from "@/components/public/ShareButtons";
import { RelatedPosts } from "@/components/public/RelatedPosts";
import { AdSlot } from "@/components/public/AdSlot";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  const post = await getPostBySlug(category.value, slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  const url = getPostAbsoluteUrl(post);
  const coverUrl = post.cover_image_url ? stripCoverFraming(post.cover_image_url) : null;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: coverUrl ? [{ url: coverUrl }] : undefined,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const post = await getPostBySlug(category.value, slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const html = renderTiptapContent(post.content);

  const jsonLd = buildNewsArticleJsonLd(post);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: category.label, href: `/${category.slug}` },
          { label: post.title },
        ]}
      />

      <div className="mt-3">
        <Badge tone="accent" star>
          {category.label}
        </Badge>
      </div>

      <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight text-ink">{post.title}</h1>

      {post.excerpt ? <p className="mt-4 text-lg text-muted">{post.excerpt}</p> : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-line py-3 text-sm text-muted">
        <span>
          {formatDate(post.published_at ?? post.created_at)} · {post.reading_time_minutes} min de leitura
        </span>
        <ShareButtons url={getPostAbsoluteUrl(post)} title={post.title} />
      </div>

      {post.cover_image_url ? (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-sm">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            style={{ objectPosition: coverObjectPosition(post.cover_image_url) }}
            priority
          />
        </div>
      ) : null}

      <div
        className="article-body prose prose-lg mt-8 max-w-none prose-headings:font-sans prose-headings:font-bold prose-a:text-accent"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-10">
        <AdSlot slot="article-bottom" className="min-h-24" />
      </div>

      <RelatedPosts posts={related} />
    </article>
  );
}
