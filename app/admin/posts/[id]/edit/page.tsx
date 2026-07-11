import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { getPostByIdForAdmin } from "@/lib/posts";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Editar publicação" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const user = await requireAdminUser();
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  return (
    <AdminShell email={user.email}>
      <h1 className="mb-6 text-2xl font-bold text-ink">Editar publicação</h1>
      <PostForm post={post} />
    </AdminShell>
  );
}
