import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, shouldUseMockData } from "@/lib/supabase/env";
import { MOCK_POSTS } from "@/lib/mock-data";
import type { PostRow } from "@/lib/supabase/types";
import type { PostCategory, PostStatus } from "@/lib/constants";

export const POSTS_PER_PAGE = 12;

function isLive(post: PostRow, nowIso: string): boolean {
  if (post.status === "published") return true;
  if (post.status === "scheduled" && post.published_at && post.published_at <= nowIso) return true;
  return false;
}

function sortByPublishedDesc(a: PostRow, b: PostRow) {
  const aDate = a.published_at ?? a.created_at;
  const bDate = b.published_at ?? b.created_at;
  return bDate < aDate ? 1 : bDate > aDate ? -1 : 0;
}

function liveFilterOr(nowIso: string) {
  return `status.eq.published,and(status.eq.scheduled,published_at.lte.${nowIso})`;
}

export async function getLatestPosts(limit = 10): Promise<PostRow[]> {
  const nowIso = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return [];
    return MOCK_POSTS.filter((p) => isLive(p, nowIso)).sort(sortByPublishedDesc).slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(liveFilterOr(nowIso))
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getPostsByCategory(
  category: PostCategory,
  page = 1,
): Promise<{ posts: PostRow[]; total: number }> {
  const nowIso = new Date().toISOString();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return { posts: [], total: 0 };
    const all = MOCK_POSTS.filter((p) => p.category === category && isLive(p, nowIso)).sort(
      sortByPublishedDesc,
    );
    return { posts: all.slice(from, to + 1), total: all.length };
  }

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("category", category)
    .or(liveFilterOr(nowIso))
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getAllPosts(page = 1): Promise<{ posts: PostRow[]; total: number }> {
  const nowIso = new Date().toISOString();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return { posts: [], total: 0 };
    const all = MOCK_POSTS.filter((p) => isLive(p, nowIso)).sort(sortByPublishedDesc);
    return { posts: all.slice(from, to + 1), total: all.length };
  }

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .or(liveFilterOr(nowIso))
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getAllLivePostsForSitemap(): Promise<
  Pick<PostRow, "category" | "slug" | "updated_at">[]
> {
  const nowIso = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return [];
    return MOCK_POSTS.filter((p) => isLive(p, nowIso));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("category, slug, updated_at")
    .or(liveFilterOr(nowIso));

  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(
  category: PostCategory,
  slug: string,
): Promise<PostRow | null> {
  const nowIso = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return null;
    const post = MOCK_POSTS.find((p) => p.category === category && p.slug === slug);
    if (!post || !isLive(post, nowIso)) return null;
    return post;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", category)
    .eq("slug", slug)
    .or(liveFilterOr(nowIso))
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getRelatedPosts(post: PostRow, limit = 3): Promise<PostRow[]> {
  const nowIso = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return [];
    return MOCK_POSTS.filter((p) => p.category === post.category && p.id !== post.id && isLive(p, nowIso))
      .sort(sortByPublishedDesc)
      .slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", post.category)
    .neq("id", post.id)
    .or(liveFilterOr(nowIso))
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function searchPosts(query: string): Promise<PostRow[]> {
  const nowIso = new Date().toISOString();
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return [];
    const needle = trimmed.toLowerCase();
    return MOCK_POSTS.filter(
      (p) =>
        isLive(p, nowIso) &&
        (p.title.toLowerCase().includes(needle) ||
          (p.excerpt ?? "").toLowerCase().includes(needle) ||
          p.content_text.toLowerCase().includes(needle)),
    ).sort(sortByPublishedDesc);
  }

  const supabase = await createClient();
  const tsQuery = trimmed.split(/\s+/).filter(Boolean).join(" & ");
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(liveFilterOr(nowIso))
    .textSearch("search_vector", tsQuery, { type: "plain", config: "portuguese" })
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) throw error;
  return data ?? [];
}

// --- Funções de administração (exigem sessão autenticada; RLS garante isolamento) ---

export interface AdminPostFilters {
  status?: PostStatus;
  category?: PostCategory;
  search?: string;
}

export async function listPostsForAdmin(filters: AdminPostFilters = {}): Promise<PostRow[]> {
  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return [];
    let items = [...MOCK_POSTS];
    if (filters.status) items = items.filter((p) => p.status === filters.status);
    if (filters.category) items = items.filter((p) => p.category === filters.category);
    if (filters.search) {
      const needle = filters.search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(needle));
    }
    return items.sort((a, b) => (b.created_at < a.created_at ? -1 : 1));
  }

  const supabase = await createClient();
  let queryBuilder = supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (filters.status) queryBuilder = queryBuilder.eq("status", filters.status);
  if (filters.category) queryBuilder = queryBuilder.eq("category", filters.category);
  if (filters.search) queryBuilder = queryBuilder.ilike("title", `%${filters.search}%`);

  const { data, error } = await queryBuilder;
  if (error) throw error;
  return data ?? [];
}

export async function getPostByIdForAdmin(id: string): Promise<PostRow | null> {
  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) return null;
    return MOCK_POSTS.find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}
