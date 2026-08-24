import Image from "next/image";
import Link from "next/link";
import type { PostRow } from "@/lib/supabase/types";
import { getCategoryByValue } from "@/lib/constants";
import { getPostUrlPath } from "@/lib/seo";
import { formatRelativeTime } from "@/lib/format";
import { coverObjectPosition } from "@/lib/cover-framing";

/**
 * A manchete: a publicação principal, dominando o topo da home.
 *
 * Segue o padrão dos portais (g1, ge, Estadão): chapéu da editoria, título
 * grande e a foto logo abaixo do cabeçalho — sem nada de institucional antes.
 * O título é o `h1` da home, então o texto mais importante da página é uma
 * notícia de verdade, não o nome do site (que já está no cabeçalho).
 */
export function LeadStory({ post }: { post: PostRow }) {
  const category = getCategoryByValue(post.category);
  const href = getPostUrlPath(post);
  const publishedAt = post.published_at ?? post.created_at;

  return (
    <article className="group">
      <Link href={href} className="block">
        {/* No desktop a foto é mais achatada de propósito: em 16/9 ela sozinha
            comeria ~500px da primeira tela e empurraria o título para fora da
            dobra. No celular, onde a coluna é estreita, 16/9 volta a ser o
            enquadramento certo. */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-paper-muted lg:aspect-[21/9]">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              style={{ objectPosition: coverObjectPosition(post.cover_image_url) }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </Link>

      <div className="mt-4">
        <Link
          href={`/${category.slug}`}
          className="text-xs font-bold uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-dark"
        >
          {category.label}
        </Link>

        <h1 className="mt-2 text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
          <Link
            href={href}
            className="transition-colors duration-200 group-hover:text-accent focus-visible:text-accent"
          >
            {post.title}
          </Link>
        </h1>

        {post.excerpt ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
            {post.excerpt}
          </p>
        ) : null}

        <p className="mt-3 text-xs text-muted">
          <time dateTime={publishedAt}>{formatRelativeTime(publishedAt)}</time>
          {" · "}
          {post.reading_time_minutes} min de leitura
        </p>
      </div>
    </article>
  );
}
