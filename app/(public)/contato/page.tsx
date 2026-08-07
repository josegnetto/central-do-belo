import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Mail as MailIcon } from "lucide-react";
import { InstagramIcon, XIcon } from "@/components/icons/BrandIcons";
import { StarMark } from "@/components/ui/StarMark";
import { SITE_NAME, SOCIAL_LINKS, getContactEmail } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do Central do Belo: sugestões de pauta, correções e parcerias.",
  alternates: { canonical: `${getSiteUrl()}/contato` },
};

export default function ContatoPage() {
  const email = getContactEmail();

  const channels = [
    ...(email
      ? [
          {
            label: "E-mail",
            handle: email,
            href: `mailto:${email}`,
            icon: MailIcon,
            description: "Melhor canal para correções, pautas e assuntos comerciais.",
          },
        ]
      : []),
    {
      label: "Instagram",
      handle: SOCIAL_LINKS.handle,
      href: SOCIAL_LINKS.instagram,
      icon: InstagramIcon,
      description: "Envie uma mensagem direta (DM) — é o canal mais rápido.",
    },
    {
      label: "X (Twitter)",
      handle: SOCIAL_LINKS.handle,
      href: SOCIAL_LINKS.x,
      icon: XIcon,
      description: "Mencione ou mande DM para falar com a redação.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Contato" }]} />
      <h1 className="mt-3 flex items-center gap-2 text-3xl font-bold text-ink">
        <StarMark className="h-6 w-6" />
        Contato
      </h1>
      <p className="mt-2 text-muted">
        Sugestão de pauta, correção de informação, parceria ou publicidade? Fale com a equipe do{" "}
        {SITE_NAME} por qualquer um dos canais abaixo.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {channels.map(({ label, handle, href, icon: Icon, description }) => (
          <a
            key={label}
            href={href}
            {...(href.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
            className="card-glow group flex flex-col gap-2 rounded-md border border-line bg-paper-muted/40 p-5"
          >
            <span className="flex items-center gap-2 font-semibold text-ink">
              <Icon className="h-5 w-5 text-accent" />
              {label}
            </span>
            <span className="text-sm font-medium text-accent">{handle}</span>
            <span className="text-sm text-muted">{description}</span>
          </a>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        Respondemos o mais rápido possível, geralmente em até 48 horas. Correções de conteúdo têm
        prioridade — veja como tratamos erros na nossa{" "}
        <Link href="/politica-editorial" className="font-semibold text-accent hover:text-accent-dark">
          Política Editorial
        </Link>
        .
      </p>
    </div>
  );
}
