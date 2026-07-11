import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().trim().min(3, "Título muito curto"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug muito curto")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  excerpt: z.string().trim().max(400).optional().default(""),
  content: z.record(z.string(), z.unknown()),
  coverImageUrl: z.string().url().nullable(),
  category: z.enum(["noticia", "raio_x", "analise_pos_jogo", "contratacao"]),
  seoTitle: z.string().trim().max(120).optional().default(""),
  seoDescription: z.string().trim().max(200).optional().default(""),
  status: z.enum(["draft", "scheduled", "published"]),
  publishedAt: z.string().nullable(),
});

export type PostFormPayload = z.infer<typeof postFormSchema>;
