"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Excluir a publicação "${title}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      await deletePost(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Excluir publicação"
      className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-soft hover:bg-accent hover:text-paper disabled:opacity-50 cursor-pointer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
