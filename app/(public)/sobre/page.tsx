import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça o Central do Belo: portal independente dedicado à cobertura completa do Botafogo-PB.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Sobre" }]} />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <span className="star-divider" aria-hidden>
          ★
        </span>
        Sobre o {SITE_NAME}
      </h1>

      <div className="article-body prose prose-lg mt-6 max-w-none">
        <p>
          O <strong>{SITE_NAME}</strong> (CDB) é um portal de notícias independente, criado por
          torcedores e dedicado exclusivamente à cobertura do <strong>Botafogo Futebol Clube da
          Paraíba</strong>, o Belo.
        </p>
        <p>Nossa produção editorial é organizada em quatro frentes:</p>
        <ul>
          <li>
            <strong>Notícias</strong> — o dia a dia do clube: bastidores, elenco, diretoria e
            competições.
          </li>
          <li>
            <strong>Raio-X Pré-Jogo</strong> — análises antes de cada partida, com prováveis
            escalações, desfalques e retrospecto.
          </li>
          <li>
            <strong>Análise Pós-Jogo</strong> — leitura tática e avaliação de desempenho depois que
            a bola para de rolar.
          </li>
          <li>
            <strong>Scout</strong> — indicações e estudos de possíveis reforços para o elenco.
          </li>
        </ul>
        <p>
          Somos um veículo <strong>independente</strong>, sem vínculo oficial com o Botafogo-PB. As
          opiniões publicadas aqui são de responsabilidade dos nossos autores e não representam o
          clube.
        </p>
        <p>
          Quer falar com a gente? Visite a página de{" "}
          <Link href="/contato">contato</Link> ou nos encontre nas redes sociais como{" "}
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
            {SOCIAL_LINKS.handle}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
