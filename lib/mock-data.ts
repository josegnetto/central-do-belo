import type { JSONContent } from "@tiptap/core";
import type { PostRow } from "@/lib/supabase/types";
import { estimateReadingTimeMinutes, extractPlainText } from "@/lib/reading-time";

function doc(paragraphs: string[]): JSONContent {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

const now = new Date();
function daysAgo(days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
function daysFromNow(days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

interface MockSeed {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: PostRow["category"];
  status: PostRow["status"];
  cover_image_url: string;
  published_at: string | null;
  created_at: string;
  content: JSONContent;
}

const seeds: MockSeed[] = [
  {
    id: "1",
    title: "Belo vence fora de casa e assume a liderança do returno",
    slug: "belo-vence-fora-de-casa-lideranca-returno",
    excerpt:
      "Time comandado por gol decisivo no segundo tempo garante três pontos importantes na briga pelo acesso.",
    category: "noticia",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-noticia-1/1200/675",
    published_at: daysAgo(1),
    created_at: daysAgo(1),
    content: doc([
      "O Botafogo-PB conquistou uma vitória importante fora de casa neste fim de semana, resultado que coloca a equipe na liderança do returno da competição.",
      "O gol da partida saiu aos 32 minutos do segundo tempo, em jogada de contra-ataque construída pelo meio-campo do Belo.",
      "Com o resultado, a comissão técnica projeta manter a base do time para os próximos compromissos, mirando o acesso.",
    ]),
  },
  {
    id: "2",
    title: "Diretoria confirma contratação de lateral para reforçar o elenco",
    slug: "diretoria-confirma-contratacao-lateral",
    excerpt: "Jogador chega por empréstimo até o fim da temporada e já treina com o grupo esta semana.",
    category: "noticia",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-noticia-2/1200/675",
    published_at: daysAgo(3),
    created_at: daysAgo(3),
    content: doc([
      "O Botafogo-PB anunciou nesta semana a contratação de um novo lateral-direito para reforçar o time na reta final da temporada.",
      "O atleta assinou contrato de empréstimo e deve ser relacionado já para o próximo compromisso do Belo.",
    ]),
  },
  {
    id: "3",
    title: "Raio-X: como chega o Belo para o clássico deste domingo",
    slug: "raio-x-como-chega-o-belo-classico-domingo",
    excerpt: "Desfalques, prováveis escalações e o retrospecto recente entre as equipes antes da bola rolar.",
    category: "raio_x",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-raiox-1/1200/675",
    published_at: daysAgo(2),
    created_at: daysAgo(2),
    content: doc([
      "Neste domingo, o Botafogo-PB entra em campo em mais um clássico decisivo pela competição estadual.",
      "O time deve ir a campo com a mesma base que vem sendo utilizada nas últimas rodadas, com uma dúvida no meio-campo.",
      "Veja abaixo os principais números e o retrospecto recente entre as duas equipes.",
    ]),
  },
  {
    id: "4",
    title: "Análise: os números do Belo na vitória sobre o rival estadual",
    slug: "analise-numeros-belo-vitoria-rival-estadual",
    excerpt: "Posse de bola, finalizações e eficiência ofensiva: entenda os fatores que definiram o resultado.",
    category: "analise_pos_jogo",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-analise-1/1200/675",
    published_at: daysAgo(4),
    created_at: daysAgo(4),
    content: doc([
      "A vitória do Botafogo-PB no último confronto estadual trouxe números que confirmam a evolução tática da equipe.",
      "O time teve maior posse de bola no segundo tempo e converteu suas chances com mais eficiência que o adversário.",
      "A defesa também teve atuação sólida, cedendo poucos espaços nas transições rivais.",
    ]),
  },
  {
    id: "5",
    title: "Scout: três nomes do mercado que podem reforçar o meio-campo",
    slug: "scout-tres-nomes-mercado-meio-campo",
    excerpt: "Levantamento aponta jogadores com contrato perto do fim e perfil compatível com o sistema de jogo do Belo.",
    category: "contratacao",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-scout-1/1200/675",
    published_at: daysAgo(5),
    created_at: daysAgo(5),
    content: doc([
      "Com a janela de transferências se aproximando, o Botafogo-PB pode buscar reforços para o meio-campo.",
      "Levantamos três nomes do mercado nacional com perfil que se encaixaria no sistema de jogo proposto pela comissão técnica.",
    ]),
  },
  {
    id: "6",
    title: "Raio-X Pré-Jogo: desfalques e escalação provável para a próxima rodada",
    slug: "raio-x-desfalques-escalacao-proxima-rodada",
    excerpt: "Departamento médico e escalação: tudo o que você precisa saber antes do próximo compromisso do Belo.",
    category: "raio_x",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-raiox-2/1200/675",
    published_at: daysAgo(7),
    created_at: daysAgo(7),
    content: doc([
      "O Botafogo-PB se prepara para mais um compromisso decisivo na competição, com o departamento médico de olho em dois jogadores.",
      "A escalação provável deve manter o desenho tático utilizado nos últimos jogos.",
    ]),
  },
  {
    id: "7",
    title: "Pós-jogo: pontos positivos e o que precisa melhorar no ataque do Belo",
    slug: "pos-jogo-pontos-positivos-ataque-belo",
    excerpt: "Time voltou a marcar no segundo tempo, mas desperdiçou chances claras ainda no primeiro tempo.",
    category: "analise_pos_jogo",
    status: "published",
    cover_image_url: "https://picsum.photos/seed/belo-analise-2/1200/675",
    published_at: daysAgo(9),
    created_at: daysAgo(9),
    content: doc([
      "Apesar do resultado positivo, o Botafogo-PB ainda precisa corrigir a eficiência ofensiva no primeiro tempo dos jogos.",
      "A comissão técnica já trabalha ajustes para a movimentação dos atacantes nas próximas semanas de treino.",
    ]),
  },
  {
    id: "8",
    title: "Rascunho: pauta em apuração sobre reforço para o ataque",
    slug: "rascunho-pauta-reforco-ataque",
    excerpt: "Texto ainda em edição, aguardando confirmação de fontes antes da publicação.",
    category: "contratacao",
    status: "draft",
    cover_image_url: "https://picsum.photos/seed/belo-scout-2/1200/675",
    published_at: null,
    created_at: daysAgo(0),
    content: doc(["Pauta em apuração — conteúdo de exemplo para demonstrar o fluxo de rascunhos no painel admin."]),
  },
  {
    id: "9",
    title: "Agendado: prévia especial para o próximo grande clássico",
    slug: "agendado-previa-especial-proximo-classico",
    excerpt: "Publicação agendada para ir ao ar próximo à data do jogo.",
    category: "raio_x",
    status: "scheduled",
    cover_image_url: "https://picsum.photos/seed/belo-raiox-3/1200/675",
    published_at: daysFromNow(3),
    created_at: daysAgo(0),
    content: doc(["Conteúdo de exemplo para demonstrar o fluxo de agendamento de publicações no painel admin."]),
  },
];

export const MOCK_POSTS: PostRow[] = seeds.map((seed) => {
  const content_text = extractPlainText(seed.content);
  return {
    id: seed.id,
    title: seed.title,
    slug: seed.slug,
    excerpt: seed.excerpt,
    content: seed.content,
    content_text,
    cover_image_url: seed.cover_image_url,
    category: seed.category,
    status: seed.status,
    published_at: seed.published_at,
    author_id: null,
    author_name: null,
    reading_time_minutes: estimateReadingTimeMinutes(seed.content),
    seo_title: null,
    seo_description: null,
    created_at: seed.created_at,
    updated_at: seed.created_at,
  };
});
