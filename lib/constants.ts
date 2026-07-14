export type PostCategory =
  | "noticia"
  | "raio_x"
  | "analise_pos_jogo"
  | "contratacao";

export type PostStatus = "draft" | "scheduled" | "published";

export interface CategoryDefinition {
  value: PostCategory;
  slug: string;
  label: string;
  labelSingular: string;
  description: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    value: "noticia",
    slug: "noticias",
    label: "Notícias",
    labelSingular: "Notícia",
    description: "As últimas notícias sobre o Botafogo-PB.",
  },
  {
    value: "raio_x",
    slug: "raio-x-pre-jogo",
    label: "Raio-X Pré-Jogo",
    labelSingular: "Raio-X Pré-Jogo",
    description: "Análises e escalações antes de cada partida.",
  },
  {
    value: "analise_pos_jogo",
    slug: "analise-pos-jogo",
    label: "Análise Pós-Jogo",
    labelSingular: "Análise Pós-Jogo",
    description: "O que ficou de cada jogo do Belo.",
  },
  {
    value: "contratacao",
    slug: "contratacoes",
    label: "Scout",
    labelSingular: "Indicação de Contratação",
    description: "Indicações e sugestões de reforços para o Belo.",
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByValue(value: PostCategory): CategoryDefinition {
  const category = CATEGORIES.find((c) => c.value === value);
  if (!category) {
    throw new Error(`Categoria desconhecida: ${value}`);
  }
  return category;
}

export const SITE_NAME = "Central do Belo";
export const SITE_SHORT_NAME = "CDB";
export const SITE_TAGLINE = "Notícia ★ Análise ★ Scouts";
export const SITE_DESCRIPTION =
  "Cobertura completa e independente do Botafogo-PB: notícias, raio-x pré-jogo, análises pós-jogo e indicações de contratações.";

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/centraldobeloo",
  x: "https://x.com/centraldobeloo",
  handle: "@centraldobeloo",
};

export const DEVELOPER = {
  name: "josegnetto",
  github: "https://github.com/josegnetto",
};
