import type { JSONContent } from "@tiptap/core";
import type { PostCategory, PostStatus } from "@/lib/constants";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: JSONContent;
  content_text: string;
  cover_image_url: string | null;
  category: PostCategory;
  status: PostStatus;
  published_at: string | null;
  author_id: string | null;
  reading_time_minutes: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: PostRow;
        Insert: Partial<PostRow> & {
          title: string;
          slug: string;
          category: PostCategory;
        };
        Update: Partial<PostRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
  };
};
