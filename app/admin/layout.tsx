import type { Metadata } from "next";

// O painel depende da sessão de cada requisição: nunca deve ser pré-gerado no
// build (que roda sem as variáveis do Supabase) nem cacheado entre usuários.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Painel administrativo",
    template: "%s | Painel administrativo",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full bg-paper-muted">{children}</div>;
}
