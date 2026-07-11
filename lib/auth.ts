import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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
    // Sem Supabase configurado ainda: permite navegar no painel com dados de exemplo.
    return { id: "mock-admin", email: "admin@exemplo.com" } as const;
  }
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
