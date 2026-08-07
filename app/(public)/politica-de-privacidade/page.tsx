import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { StarMark } from "@/components/ui/StarMark";
import { SITE_NAME, getContactEmail } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Central do Belo coleta, usa e protege seus dados, em conformidade com a LGPD.",
  alternates: { canonical: `${getSiteUrl()}/politica-de-privacidade` },
};

export default function PoliticaDePrivacidadePage() {
  const siteUrl = getSiteUrl();
  const email = getContactEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Política de Privacidade" }]}
      />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <StarMark className="h-6 w-6" />
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-muted">Última atualização: 13 de julho de 2026</p>

      <div className="article-body prose prose-lg mt-6 max-w-none">
        <p>
          Esta Política de Privacidade descreve como o <strong>{SITE_NAME}</strong> ({siteUrl})
          coleta, utiliza e protege as informações dos visitantes, em conformidade com a Lei Geral
          de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>

        <h2>1. Quais dados coletamos</h2>
        <p>
          O {SITE_NAME} é um portal de notícias de leitura livre: <strong>não exigimos cadastro</strong>{" "}
          e não coletamos dados pessoais identificáveis diretamente de você. De forma automática,
          podem ser coletados dados de navegação, como páginas visitadas, tempo de permanência,
          tipo de dispositivo, navegador e localização aproximada (cidade/estado), sempre de forma
          agregada e anônima.
        </p>

        <h2>2. Cookies</h2>
        <p>
          Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência de navegação,
          lembrar preferências (como o tema claro/escuro) e medir audiência. Você pode desativar os
          cookies nas configurações do seu navegador, mas algumas funcionalidades podem deixar de
          funcionar corretamente.
        </p>

        <h2>3. Google Analytics</h2>
        <p>
          Utilizamos o Google Analytics para entender como os visitantes usam o site (páginas mais
          lidas, origem do tráfego, etc.). Esses dados são coletados de forma agregada e não nos
          permitem identificar você individualmente. Saiba mais na{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade do Google
          </a>
          .
        </p>

        <h2>4. Publicidade — Google AdSense</h2>
        <p>
          Exibimos anúncios fornecidos pelo <strong>Google AdSense</strong>. O Google, como
          fornecedor terceiro, utiliza cookies (incluindo o cookie DART/DoubleClick) para exibir
          anúncios com base em suas visitas anteriores a este e a outros sites.
        </p>
        <ul>
          <li>
            Você pode desativar a publicidade personalizada visitando as{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Configurações de anúncios do Google
            </a>
            .
          </li>
          <li>
            Para saber mais sobre como o Google usa dados de sites parceiros, visite{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              esta página
            </a>
            .
          </li>
        </ul>

        <p>
          Além do Google, outros fornecedores terceiros podem veicular anúncios neste site por meio
          da rede do Google. Esses parceiros também podem usar cookies para medir desempenho e
          limitar a frequência com que um mesmo anúncio é exibido a você.
        </p>

        <h2>5. Seus direitos (LGPD)</h2>
        <p>
          Nos termos da LGPD, você pode solicitar a confirmação da existência de tratamento de
          dados, o acesso, a correção ou a eliminação de dados pessoais eventualmente tratados por
          nós, bem como revogar o consentimento dado para o uso de cookies.
        </p>
        <p>
          Para exercer esses direitos, escreva para{" "}
          {email ? (
            <a href={`mailto:${email}`}>{email}</a>
          ) : (
            <>os canais da nossa página de <Link href="/contato">contato</Link></>
          )}
          {email ? (
            <>
              {" "}ou use os canais da página de <Link href="/contato">contato</Link>
            </>
          ) : null}
          . O responsável pelo tratamento dos dados coletados neste site é a equipe do{" "}
          {SITE_NAME}.
        </p>

        <h2>6. Links externos</h2>
        <p>
          Nossas publicações podem conter links para sites de terceiros. Não nos responsabilizamos
          pelas práticas de privacidade desses sites — recomendamos a leitura das políticas de cada
          um.
        </p>

        <h2>7. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. A data da última atualização está
          sempre indicada no topo da página.
        </p>
      </div>
    </div>
  );
}
