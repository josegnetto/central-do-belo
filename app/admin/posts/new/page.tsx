import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Nova publicação" };

export default async function NewPostPage() {
  const user = await requireAdminUser();

  return (
    <AdminShell email={user.email}>
      <h1 className="mb-6 text-2xl font-bold text-ink">Nova publicação</h1>
      <PostForm />
    </AdminShell>
  );
}
