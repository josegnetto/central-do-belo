import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { StarMark } from "@/components/ui/StarMark";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Condições de uso do portal Central do Belo.",
};

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Termos de Uso" }]} />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <StarMark className="h-6 w-6" />
        Termos de Uso
      </h1>
      <p className="mt-2 text-sm text-muted">Última atualização: 13 de julho de 2026</p>

      <div className="article-body prose prose-lg mt-6 max-w-none">
        <p>
          Ao acessar o <strong>{SITE_NAME}</strong>, você concorda com os termos descritos abaixo.
          Se não concordar com algum ponto, recomendamos que não utilize o site.
        </p>

        <h2>1. Sobre o conteúdo</h2>
        <p>
          O {SITE_NAME} é um portal jornalístico independente dedicado à cobertura do Botafogo-PB.
          Todo o conteúdo é produzido de boa-fé, com base em informações públicas e apuração
          própria. Análises e indicações (como as da editoria Scout) representam{" "}
          <strong>opinião editorial</strong>, não informação oficial do clube.
        </p>

        <h2>2. Independência</h2>
        <p>
          Este portal <strong>não possui vínculo oficial</strong> com o Botafogo Futebol Clube da
          Paraíba. Marcas, escudos e nomes citados pertencem aos seus respectivos donos e são
          usados apenas em contexto informativo e jornalístico.
        </p>

        <h2>3. Propriedade intelectual</h2>
        <p>
          Os textos publicados aqui são de autoria do {SITE_NAME}. É permitido citar trechos com
          crédito e link para a publicação original. A reprodução integral sem autorização é
          proibida.
        </p>

        <h2>4. Correções</h2>
        <p>
          Prezamos pela precisão. Se você identificar qualquer erro em nossas publicações, entre em
          contato pelos canais da página de <Link href="/contato">contato</Link> — correções são
          tratadas com prioridade.
        </p>

        <h2>5. Publicidade</h2>
        <p>
          O site exibe anúncios de terceiros (Google AdSense) para financiar sua operação. Não nos
          responsabilizamos pelo conteúdo dos anúncios nem pelos sites por eles vinculados. Veja
          também nossa <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>

        <h2>6. Limitação de responsabilidade</h2>
        <p>
          Trabalhamos para manter o site disponível e as informações atualizadas, mas não
          garantimos disponibilidade ininterrupta nem ausência total de erros. O uso das
          informações publicadas é de responsabilidade do leitor.
        </p>

        <h2>7. Alterações</h2>
        <p>
          Estes termos podem ser revisados a qualquer momento. A versão vigente é sempre a
          publicada nesta página.
        </p>
      </div>
    </div>
  );
}
