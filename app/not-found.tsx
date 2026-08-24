import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CookieBanner } from "@/components/public/CookieBanner";
import { StarMark } from "@/components/ui/StarMark";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procurou não existe ou foi movida.",
  robots: { index: false, follow: true },
};

/**
 * Página 404 própria. Sem ela, o Next.js entrega uma tela em branco sem
 * navegação — um "beco sem saída" que o Google marca como página quebrada
 * tanto na análise do AdSense quanto nos requisitos de destino do Google Ads.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
            <StarMark className="h-4 w-4" />
            Erro 404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Essa página saiu de campo
          </h1>
          <p className="mt-4 text-muted">
            O endereço que você acessou não existe ou a publicação foi movida. Use os atalhos
            abaixo para voltar ao jogo.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-dark"
            >
              Ir para a home
            </Link>
            <Link
              href="/publicacoes"
              className="rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Ver todas as publicações
            </Link>
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Ou navegue por editoria
            </h2>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/${category.slug}`}
                    className="nav-underline text-sm text-muted transition-colors hover:text-accent"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
