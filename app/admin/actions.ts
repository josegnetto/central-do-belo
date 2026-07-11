"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { estimateReadingTimeMinutes, extractPlainText } from "@/lib/reading-time";
import { postFormSchema, type PostFormPayload } from "@/lib/validation";
import type { JSONContent } from "@tiptap/core";

export type ActionResult = { ok: true; id: string } | { ok: false; error: string };

function buildRow(payload: PostFormPayload) {
  const content = payload.content as JSONContent;
  const contentText = extractPlainText(content);
  const readingTime = estimateReadingTimeMinutes(content);

  let publishedAt = payload.publishedAt;
  if (payload.status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  }
  if (payload.status === "draft") {
    publishedAt = payload.publishedAt;
  }

  return {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt || null,
    content,
    content_text: contentText,
    cover_image_url: payload.coverImageUrl,
    category: payload.category,
    status: payload.status,
    published_at: publishedAt,
    reading_time_minutes: readingTime,
    seo_title: payload.seoTitle || null,
    seo_description: payload.seoDescription || null,
  };
}

export async function createPost(input: PostFormPayload): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Configure o Supabase para publicar conteúdo real (veja o README)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row = buildRow(parsed.data);
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...row, author_id: user?.id ?? null })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Já existe uma publicação com esse slug." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, id: data.id };
}

export async function updatePost(id: string, input: PostFormPayload): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Configure o Supabase para publicar conteúdo real (veja o README)." };
  }

  const supabase = await createClient();
  const row = buildRow(parsed.data);
  const { error } = await supabase.from("posts").update(row).eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Já existe uma publicação com esse slug." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function deletePost(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);

  revalidatePath("/", "layout");
  redirect("/admin");
}
