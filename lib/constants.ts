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

/**
 * E-mail de contato exibido nas páginas de Contato e Política de Privacidade.
 *
 * O Google (AdSense e Google Ads) exige uma forma de contato direta e
 * funcional; perfis de rede social sozinhos costumam não ser aceitos. A LGPD
 * também exige um canal para o titular exercer seus direitos. Defina
 * `NEXT_PUBLIC_CONTACT_EMAIL` com um endereço que realmente receba mensagens —
 * enquanto ele não existir, o bloco de e-mail simplesmente não é exibido (é
 * pior mostrar um endereço que não funciona).
 */
export function getContactEmail(): string | null {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return email ? email : null;
}

/**
 * Assinatura das publicações. O Google avalia autoria e responsabilidade
 * editorial ("quem escreveu isto?") na análise de conteúdo.
 */
export const EDITORIAL_BYLINE = "Redação Central do Belo";

export const DEVELOPER = {
  name: "josegnetto",
  github: "https://github.com/josegnetto",
};
