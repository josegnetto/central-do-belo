"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { Eye } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import type { PostRow } from "@/lib/supabase/types";
import { slugFromTitle } from "@/lib/slug";
import { formatDateTimeLocal } from "@/lib/format";
import type { PostFormPayload } from "@/lib/validation";
import { createPost, updatePost } from "@/app/admin/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

type SaveAction = "draft" | "schedule" | "publish";

export function PostForm({ post }: { post?: PostRow }) {
  const router = useRouter();
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState<JSONContent>(post?.content ?? EMPTY_DOC);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.cover_image_url ?? null);
  const [category, setCategory] = useState(post?.category ?? CATEGORIES[0].value);
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [scheduledAt, setScheduledAt] = useState(formatDateTimeLocal(post?.published_at ?? null));
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<SaveAction | "preview" | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugFromTitle(value));
  }

  function buildPayload(
    status: PostFormPayload["status"],
    publishedAt: string | null,
  ): PostFormPayload | null {
    if (!title.trim() || !slug.trim()) {
      setError("Preencha título e slug antes de salvar.");
      return null;
    }
    if (!coverImageUrl) {
      setError("Selecione uma imagem de capa.");
      return null;
    }
    if (status === "scheduled" && !publishedAt) {
      setError("Escolha a data e hora do agendamento.");
      return null;
    }

    return {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      coverImageUrl,
      category,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      status,
      publishedAt,
    };
  }

  async function persist(payload: PostFormPayload) {
    return isEditing && post ? updatePost(post.id, payload) : createPost(payload);
  }

  const scheduledAtIso = scheduledAt ? new Date(scheduledAt).toISOString() : null;

  function handleSave(action: SaveAction) {
    setError(null);
    const status = action === "draft" ? "draft" : action === "schedule" ? "scheduled" : "published";
    const publishedAt = action === "publish" ? new Date().toISOString() : scheduledAtIso;
    const payload = buildPayload(status, publishedAt);
    if (!payload) return;

    setPendingAction(action);
    startTransition(async () => {
      const result = await persist(payload);
      setPendingAction(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/posts/${result.id}/edit`);
      router.refresh();
    });
  }

  function handlePreview() {
    setError(null);
    // Pré-visualizar salva o estado atual sem alterar status/data de publicação já definidos.
    const status = post?.status ?? "draft";
    const publishedAt = post ? post.published_at : scheduledAtIso;
    const payload = buildPayload(status, publishedAt);
    if (!payload) return;

    setPendingAction("preview");
    startTransition(async () => {
      const result = await persist(payload);
      setPendingAction(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.open(`/admin/posts/${result.id}/preview`, "_blank");
      router.refresh();
    });
  }

  const busy = isPending;

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink-soft">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título da publicação"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink-soft">
              Slug (URL)
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="titulo-da-publicacao"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-ink-soft">
              Resumo
            </label>
            <Textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Um resumo curto exibido nos cards e nos resultados de busca"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">Conteúdo</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <details className="shadow-soft-sm rounded-md border border-line bg-paper p-4">
            <summary className="cursor-pointer text-sm font-medium text-ink-soft">
              SEO (opcional)
            </summary>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="seoTitle" className="mb-1 block text-sm font-medium text-ink-soft">
                  Título para SEO
                </label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Se vazio, usa o título da publicação"
                />
              </div>
              <div>
                <label htmlFor="seoDescription" className="mb-1 block text-sm font-medium text-ink-soft">
                  Descrição para SEO
                </label>
                <Textarea
                  id="seoDescription"
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Se vazio, usa o resumo"
                />
              </div>
            </div>
          </details>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-ink-soft">
              Categoria
            </label>
            <Select id="category" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>

          <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} />

          <div>
            <label htmlFor="scheduledAt" className="mb-1 block text-sm font-medium text-ink-soft">
              Data/hora de agendamento
            </label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          {post ? (
            <p className="text-xs text-muted">
              Status atual: <span className="font-semibold text-ink-soft">{post.status}</span>
            </p>
          ) : null}

          {error ? <p className="text-sm text-accent">{error}</p> : null}

          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => handleSave("draft")}
            >
              {pendingAction === "draft" ? "Salvando..." : "Salvar rascunho"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => handleSave("schedule")}
            >
              {pendingAction === "schedule" ? "Agendando..." : "Agendar publicação"}
            </Button>
            <Button type="button" disabled={busy} onClick={() => handleSave("publish")}>
              {pendingAction === "publish" ? "Publicando..." : "Publicar agora"}
            </Button>
            <Button type="button" variant="ghost" disabled={busy} onClick={handlePreview}>
              <Eye className="h-4 w-4" />
              {pendingAction === "preview" ? "Preparando..." : "Pré-visualizar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
