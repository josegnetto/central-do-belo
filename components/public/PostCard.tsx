import Image from "next/image";
import Link from "next/link";
import type { PostRow } from "@/lib/supabase/types";
import { getCategoryByValue } from "@/lib/constants";
import { getPostUrlPath } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function PostCard({
  post,
  size = "default",
}: {
  post: PostRow;
  size?: "default" | "large";
}) {
  const category = getCategoryByValue(post.category);
  const href = getPostUrlPath(post);

  return (
    <article className="card-glow group flex flex-col overflow-hidden rounded-md border border-line bg-paper-muted/40">
      <Link href={href} className="relative block overflow-hidden bg-paper-muted">
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div
          className={
            size === "large"
              ? "relative aspect-[16/9] w-full"
              : "relative aspect-[16/10] w-full"
          }
        >
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes={size === "large" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              priority={size === "large"}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge tone="accent" star>
          {category.label}
        </Badge>
        <Link href={href}>
          <h3
            className={
              size === "large"
                ? "text-2xl md:text-3xl font-bold leading-tight text-ink group-hover:text-accent transition-colors"
                : "text-lg font-bold leading-snug text-ink group-hover:text-accent transition-colors"
            }
          >
            {post.title}
          </h3>
        </Link>
        {post.excerpt ? (
          <p className="text-sm text-muted line-clamp-2">{post.excerpt}</p>
        ) : null}
        <div className="mt-auto pt-2 text-xs text-muted">
          {formatDate(post.published_at ?? post.created_at)} · {post.reading_time_minutes} min de leitura
        </div>
      </div>
    </article>
  );
}
