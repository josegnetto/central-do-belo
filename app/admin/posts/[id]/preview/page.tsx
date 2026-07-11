import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import { requireAdminUser } from "@/lib/auth";
import { getPostByIdForAdmin } from "@/lib/posts";
import { getCategoryByValue } from "@/lib/constants";
import { tiptapExtensions } from "@/lib/tiptap-extensions";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Pré-visualização" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPostPage({ params }: PageProps) {
  await requireAdminUser();
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  const category = getCategoryByValue(post.category);
  const html = generateHTML(post.content, tiptapExtensions);

  return (
    <div className="min-h-full bg-paper">
      <div className="bg-ink px-4 py-2 text-center text-xs text-paper">
        Pré-visualização · status: {post.status} ·{" "}
        <Link href={`/admin/posts/${post.id}/edit`} className="underline">
          Voltar para edição
        </Link>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Badge tone="accent" star>
          {category.label}
        </Badge>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight text-ink">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg text-muted">{post.excerpt}</p> : null}
        <div className="mt-5 border-y border-line py-3 text-sm text-muted">
          {formatDate(post.published_at ?? post.created_at)} · {post.reading_time_minutes} min de leitura
        </div>
        {post.cover_image_url ? (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-sm">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
          </div>
        ) : null}
        <div
          className="article-body prose prose-lg mt-8 max-w-none prose-headings:font-sans prose-headings:font-bold prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}
