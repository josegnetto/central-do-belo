import type { PostRow } from "@/lib/supabase/types";
import { PostCard } from "@/components/public/PostCard";

export function RelatedPosts({ posts }: { posts: PostRow[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 border-t border-line pt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
        <span className="star-divider" aria-hidden>
          ★
        </span>
        Notícias relacionadas
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
