import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/lib/constants";
import { getPostsByCategory, POSTS_PER_PAGE } from "@/lib/posts";
import { PostCard } from "@/components/public/PostCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { AdSlot } from "@/components/public/AdSlot";
import { Reveal } from "@/components/ui/Reveal";
import { StarMark } from "@/components/ui/StarMark";
import { getSiteUrl } from "@/lib/seo";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.label,
    description: category.description,
    alternates: { canonical: `${getSiteUrl()}/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, total } = await getPostsByCategory(category.value, page);
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: category.label }]} />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <StarMark className="h-6 w-6" />
        {category.label}
      </h1>
      <p className="mt-1 text-muted">{category.description}</p>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted">Nenhuma publicação nesta categoria ainda.</p>
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
                  href={p === 1 ? `/${category.slug}` : `/${category.slug}?page=${p}`}
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
        <AdSlot slot="category-bottom" className="min-h-24" />
      </div>
    </div>
  );
}
