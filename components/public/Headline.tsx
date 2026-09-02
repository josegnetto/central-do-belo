import Image from "next/image";
import Link from "next/link";
import type { PostRow } from "@/lib/supabase/types";
import { getCategoryByValue } from "@/lib/constants";
import { getPostUrlPath } from "@/lib/seo";
import { formatRelativeTime } from "@/lib/format";
import { coverObjectPosition } from "@/lib/cover-framing";
import { proxiedCoverPath } from "@/lib/image-proxy";

/**
 * Linha de manchete compacta: miniatura, chapéu, título e horário.
 *
 * É a unidade que deixa um portal denso — cabem várias na mesma altura de um
 * card, e o leitor varre muitos títulos de uma vez. Usada na coluna de
 * destaques ao lado da manchete e na lista de últimas.
 */
export function Headline({ post, showThumb = true }: { post: PostRow; showThumb?: boolean }) {
  const category = getCategoryByValue(post.category);
  const href = getPostUrlPath(post);
  const publishedAt = post.published_at ?? post.created_at;

  return (
    <article className="group flex gap-3 py-4">
      {showThumb && post.cover_image_url ? (
        <Link
          href={href}
          className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-paper-muted sm:h-[4.5rem] sm:w-28"
        >
          <Image
            src={proxiedCoverPath(post.cover_image_url)}
            alt={post.title}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            style={{ objectPosition: coverObjectPosition(post.cover_image_url) }}
          />
        </Link>
      ) : null}

      <div className="min-w-0 flex-1">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
          {category.label}
        </span>
        <h3 className="mt-1 text-[0.95rem] font-semibold leading-snug text-ink">
          <Link
            href={href}
            className="transition-colors duration-200 group-hover:text-accent focus-visible:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-xs text-muted">
          <time dateTime={publishedAt}>{formatRelativeTime(publishedAt)}</time>
        </p>
      </div>
    </article>
  );
}
