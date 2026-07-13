import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestPosts } from "@/lib/posts";
import { PostCard } from "@/components/public/PostCard";
import { AdSlot } from "@/components/public/AdSlot";
import { HeroPattern } from "@/components/public/HeroPattern";
import { Reveal } from "@/components/ui/Reveal";
import { SITE_DESCRIPTION } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
};

export default async function HomePage() {
  const posts = await getLatestPosts(13);
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center md:px-6">
        <h1 className="text-2xl font-bold text-ink">Nenhuma publicação ainda</h1>
        <p className="mt-2 text-muted">
          Assim que o primeiro conteúdo for publicado no painel administrativo, ele aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden border-b border-line">
        <HeroPattern className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6">
          <Reveal>
            <PostCard post={featured} size="large" />
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="my-2">
          <AdSlot slot="home-top" className="min-h-24" />
        </div>

        {rest.length > 0 ? (
          <section className="mt-8">
            <div className="mb-6 flex items-center justify-between gap-2 border-b border-line pb-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <span className="star-divider" aria-hidden>
                  ★
                </span>
                Últimas publicações
              </h2>
              <Link
                href="/publicacoes"
                className="hover-pop group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-colors duration-300 hover:text-accent-dark"
              >
                Ver notícias
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 80}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
