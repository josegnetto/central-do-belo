import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, shouldUseMockData } from "@/lib/supabase/env";

export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdminUser() {
  if (!isSupabaseConfigured()) {
    // Em desenvolvimento, permite navegar no painel com dados de exemplo.
    if (shouldUseMockData()) {
      return { id: "mock-admin", email: "admin@exemplo.com" } as const;
    }
    // Em produção, NUNCA libere o painel sem autenticação real. Se as variáveis
    // do Supabase faltarem (esquecidas ou com erro de digitação na Vercel), o
    // certo é falhar fechado — antes o painel fora do ar do que aberto a
    // qualquer visitante.
    throw new Error(
      "Supabase não está configurado em produção: o painel administrativo foi bloqueado. " +
        "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
