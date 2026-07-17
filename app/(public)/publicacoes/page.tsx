import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, POSTS_PER_PAGE } from "@/lib/posts";
import { PostCard } from "@/components/public/PostCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { AdSlot } from "@/components/public/AdSlot";
import { Reveal } from "@/components/ui/Reveal";
import { StarMark } from "@/components/ui/StarMark";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Todas as publicações",
  description: "Todas as notícias, raio-x, análises e indicações de contratação do Botafogo-PB.",
  alternates: { canonical: "/publicacoes" },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllPostsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, total } = await getAllPosts(page);
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Todas as publicações" }]} />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <StarMark className="h-6 w-6" />
        Todas as publicações
      </h1>
      <p className="mt-1 text-muted">Notícias, raio-x, análises e indicações de contratação, tudo em um só lugar.</p>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted">Nenhuma publicação ainda.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginação">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? "/publicacoes" : `/publicacoes?page=${p}`}
                  className={`hover-pop flex h-11 w-11 items-center justify-center rounded-sm text-sm font-medium transition-all duration-300 ${
                    p === page ? "bg-accent text-paper" : "border border-line text-ink-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </nav>
          ) : null}
        </>
      )}

      <div className="mt-12">
        <AdSlot slot="publicacoes-bottom" className="min-h-24" />
      </div>
    </div>
  );
}
