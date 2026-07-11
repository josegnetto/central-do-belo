import type { Metadata } from "next";
import { searchPosts } from "@/lib/posts";
import { PostCard } from "@/components/public/PostCard";
import { SearchBox } from "@/components/public/SearchBox";

export const metadata: Metadata = {
  title: "Busca",
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchPosts(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold text-ink">Busca</h1>
      <div className="mt-5 max-w-md">
        <SearchBox initialQuery={query} />
      </div>

      {query ? (
        <p className="mt-6 text-sm text-muted">
          {results.length > 0
            ? `${results.length} resultado(s) para "${query}"`
            : `Nenhum resultado para "${query}"`}
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">Digite um termo para buscar publicações.</p>
      )}

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
