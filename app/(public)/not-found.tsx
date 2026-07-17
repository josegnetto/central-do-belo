import type { Metadata } from "next";
import Link from "next/link";
import { StarMark } from "@/components/ui/StarMark";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
      <StarMark className="h-10 w-10" />
      <h1 className="mt-6 text-3xl font-bold text-ink md:text-4xl">Página não encontrada</h1>
      <p className="mt-3 text-muted">
        O link pode estar quebrado ou a publicação pode ter sido removida. Confira as opções
        abaixo.
      </p>

      <Link
        href="/"
        className="hover-pop mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-bold text-paper shadow-[0_10px_28px_-8px_var(--color-accent-soft)] transition-colors duration-300 hover:bg-accent-dark"
      >
        Voltar para a home
      </Link>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.value}
            href={`/${category.slug}`}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
