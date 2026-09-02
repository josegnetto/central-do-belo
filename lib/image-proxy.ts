/**
 * Reescreve URLs de capa que apontam pro Storage do Supabase para o proxy
 * same-origin em /covers/*.
 *
 * Sem isso, o navegador de cada visitante busca a imagem direto do Supabase —
 * e cada uma dessas requisições conta como egress cobrado por GB, mesmo que
 * mil pessoas peçam a mesma foto. Passando pela rota /covers, a Cloudflare
 * cacheia a resposta na borda (uma origem, N visitantes servidos do cache),
 * derrubando o consumo do Supabase a praticamente zero depois do primeiro
 * acesso a cada imagem.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const STORAGE_PREFIX = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/`
  : null;

/** Caminho relativo (ex.: "/covers/covers/123.jpg"), ou a URL original se não for do Supabase Storage. */
export function proxiedCoverPath(url: string): string {
  if (!STORAGE_PREFIX || !url.startsWith(STORAGE_PREFIX)) return url;
  return `/covers/${url.slice(STORAGE_PREFIX.length)}`;
}

/** Versão absoluta (para meta tags OG, JSON-LD, RSS) — precisa do host porque esses campos não passam pelo resolvedor de metadata do Next. */
export function proxiedCoverAbsoluteUrl(url: string, siteUrl: string): string {
  const path = proxiedCoverPath(url);
  return path.startsWith("/") ? `${siteUrl}${path}` : path;
}
