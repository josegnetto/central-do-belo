import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { StarMark } from "@/components/ui/StarMark";
import { EDITORIAL_BYLINE, SITE_NAME, getContactEmail } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política Editorial",
  description:
    "Como o Central do Belo apura, escreve, credita fontes e corrige erros: nossa linha editorial e política de correções.",
  alternates: { canonical: `${getSiteUrl()}/politica-editorial` },
};

export default function PoliticaEditorialPage() {
  const email = getContactEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Política Editorial" }]} />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <StarMark className="h-6 w-6" />
        Política Editorial
      </h1>
      <p className="mt-2 text-sm text-muted">Última atualização: 7 de agosto de 2026</p>

      <div className="article-body prose prose-lg mt-6 max-w-none">
        <p>
          Esta página explica como o <strong>{SITE_NAME}</strong> produz seu conteúdo: quem
          escreve, de onde vêm as informações, como separamos fato de opinião e o que fazemos
          quando erramos.
        </p>

        <h2>1. Quem escreve</h2>
        <p>
          A maior parte das publicações é assinada pela <strong>{EDITORIAL_BYLINE}</strong>,
          formada por torcedores que acompanham o Botafogo-PB de perto. Textos produzidos por
          jornalistas e colaboradores convidados são <strong>assinados com o nome do autor</strong>{" "}
          no topo da publicação. Em ambos os casos, todo texto publicado aqui é{" "}
          <strong>escrito por pessoas</strong> e revisado pela redação antes de ir ao ar — que
          responde editorialmente por tudo que publica. Não publicamos conteúdo gerado
          automaticamente sem revisão, nem textos copiados de outros veículos.
        </p>

        <h2>2. Como apuramos</h2>
        <ul>
          <li>
            Partimos de fontes primárias sempre que possível: súmulas, tabelas e notas oficiais da
            CBF, da FPF e do próprio clube, coletivas de imprensa e transmissões das partidas.
          </li>
          <li>
            Quando a informação vem de outro veículo, isso é dito claramente no texto, com{" "}
            <strong>crédito e link</strong> para a publicação original.
          </li>
          <li>
            Boato não é notícia. Informação que não conseguimos confirmar ou é publicada como
            especulação, com essa ressalva explícita, ou não é publicada.
          </li>
        </ul>

        <h2>3. Fato e opinião</h2>
        <p>
          As editorias têm papéis diferentes e isso está sinalizado em cada página:
        </p>
        <ul>
          <li>
            <strong>Notícias</strong> — relato factual e verificável.
          </li>
          <li>
            <strong>Raio-X Pré-Jogo</strong> e <strong>Análise Pós-Jogo</strong> — leitura tática,
            baseada em dados e observação, com interpretação da redação.
          </li>
          <li>
            <strong>Scout</strong> — opinião editorial. São sugestões e estudos nossos sobre
            possíveis reforços, <strong>não</strong> informação oficial de negociação do clube.
          </li>
        </ul>

        <h2>4. Imagens</h2>
        <p>
          Usamos imagens próprias, de bancos com licença de uso ou material de divulgação, sempre
          com o crédito devido. Se você é o autor de alguma imagem publicada aqui e quer o crédito
          corrigido ou a remoção do material, fale conosco — resolvemos rapidamente.
        </p>

        <h2>5. Correções</h2>
        <p>
          Erramos como qualquer redação, e corrigir é parte do trabalho. Nosso compromisso:
        </p>
        <ul>
          <li>Erros factuais são corrigidos assim que confirmados.</li>
          <li>
            Correções relevantes ficam registradas no próprio texto, com a data da alteração — não
            apagamos o histórico silenciosamente.
          </li>
          <li>
            Para apontar um erro, use a página de <Link href="/contato">contato</Link>
            {email ? (
              <>
                {" "}ou escreva para <a href={`mailto:${email}`}>{email}</a>
              </>
            ) : null}
            . Correções têm prioridade sobre qualquer outra mensagem.
          </li>
        </ul>

        <h2>6. Independência e publicidade</h2>
        <p>
          O {SITE_NAME} <strong>não tem vínculo oficial</strong> com o Botafogo Futebol Clube da
          Paraíba e não recebe pauta do clube. O site é sustentado por publicidade, e a{" "}
          <strong>área comercial não interfere na linha editorial</strong>: anunciante não define,
          aprova nem veta conteúdo. Qualquer publicação paga ou patrocinada, caso venha a existir,
          será identificada como tal no próprio texto.
        </p>
        <p>
          Veja também nossos <Link href="/termos-de-uso">Termos de Uso</Link> e a{" "}
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
