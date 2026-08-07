export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

/**
 * Enquanto o projeto Supabase real não é criado, o site roda com dados de
 * exemplo (ver lib/mock-data.ts) para permitir visualizar o design.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/**
 * Os dados de exemplo só podem aparecer em desenvolvimento.
 *
 * Em produção eles seriam conteúdo fictício com imagens de banco genérico
 * (picsum.photos) — exatamente o que o Google AdSense classifica como
 * "conteúdo sem valor original" e motivo comum de reprovação. Se o Supabase
 * não estiver configurado em produção, o site mostra "nenhuma publicação"
 * em vez de conteúdo falso.
 */
export function shouldUseMockData(): boolean {
  return !isSupabaseConfigured() && process.env.NODE_ENV !== "production";
}
