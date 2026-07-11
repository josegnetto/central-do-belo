import Link from "next/link";
import { Pencil } from "lucide-react";
import { requireAdminUser } from "@/lib/auth";
import { listPostsForAdmin } from "@/lib/posts";
import { CATEGORIES, getCategoryByValue } from "@/lib/constants";
import type { PostCategory, PostStatus } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

const STATUS_LABEL: Record<PostStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
};

interface PageProps {
  searchParams: Promise<{ status?: string; category?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const user = await requireAdminUser();
  const { status, category } = await searchParams;

  const posts = await listPostsForAdmin({
    status: status as PostStatus | undefined,
    category: category as PostCategory | undefined,
  });

  function filterHref(next: { status?: string | null; category?: string | null }) {
    const params = new URLSearchParams();
    const nextStatus = next.status === null ? undefined : (next.status ?? status);
    const nextCategory = next.category === null ? undefined : (next.category ?? category);
    if (nextStatus) params.set("status", nextStatus);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  return (
    <AdminShell email={user.email}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Publicações</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-paper shadow-[0_8px_24px_-8px_var(--color-accent-soft)] hover:bg-accent-dark"
        >
          Nova publicação
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={filterHref({ status: null })}
          className={`rounded-sm px-3 py-1.5 text-xs font-medium ${!status ? "bg-accent text-paper" : "border border-line text-ink-soft hover:border-accent hover:text-accent"}`}
        >
          Todos os status
        </Link>
        {(Object.keys(STATUS_LABEL) as PostStatus[]).map((s) => (
          <Link
            key={s}
            href={filterHref({ status: s })}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium ${status === s ? "bg-accent text-paper" : "border border-line text-ink-soft hover:border-accent hover:text-accent"}`}
          >
            {STATUS_LABEL[s]}
          </Link>
        ))}
        <span className="mx-1 w-px bg-line" />
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={filterHref({ category: c.value })}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium ${category === c.value ? "bg-accent text-paper" : "border border-line text-ink-soft hover:border-accent hover:text-accent"}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="shadow-soft overflow-hidden rounded-md border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper-muted text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Nenhuma publicação encontrada.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-line last:border-0">
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-ink">{post.title}</td>
                  <td className="px-4 py-3 text-ink-soft">{getCategoryByValue(post.category).label}</td>
                  <td className="px-4 py-3">
                    <Badge tone={post.status === "published" ? "accent" : "muted"}>
                      {STATUS_LABEL[post.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {formatDateTime(post.published_at ?? post.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        aria-label="Editar publicação"
                        className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-soft hover:bg-paper-muted"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
