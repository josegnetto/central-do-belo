"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo layout="stacked" size="lg" href={null} />
          <p className="mt-4 text-sm text-muted">Painel administrativo</p>
        </div>

        {!configured ? (
          <div className="mb-6 rounded-sm border border-line bg-paper-muted p-4 text-sm text-ink-soft">
            Supabase ainda não configurado. O painel está em modo de visualização com dados de
            exemplo.{" "}
            <Link href="/admin" className="font-semibold text-accent">
              Ir para o painel
            </Link>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="shadow-soft flex flex-col gap-4 rounded-md border border-line bg-paper p-6"
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-soft">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-soft">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <Button type="submit" disabled={loading || !configured} className="w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
