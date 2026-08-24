"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StarMark } from "@/components/ui/StarMark";

/**
 * Tela de erro própria. Garante que uma falha pontual (Supabase fora do ar,
 * por exemplo) não vire uma página em branco sem navegação durante a análise
 * do Google.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
      <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
        <StarMark className="h-4 w-4" />
        Algo deu errado
      </p>
      <h1 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
        Não conseguimos carregar esta página
      </h1>
      <p className="mt-4 text-muted">
        Foi uma falha temporária do nosso lado. Tente novamente em instantes — se o problema
        continuar, fale com a gente pela página de contato.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-dark"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Ir para a home
        </Link>
        <Link
          href="/contato"
          className="rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Falar com a redação
        </Link>
      </div>
    </div>
  );
}
