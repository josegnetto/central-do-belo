import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList, Newspaper, User } from "lucide-react";
import { StarMark } from "@/components/ui/StarMark";
import { MainStar } from "@/components/ui/MainStar";
import { InstagramIcon, XIcon } from "@/components/icons/BrandIcons";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SOCIAL_LINKS } from "@/lib/constants";

const TAGLINE_ITEMS = [
  { label: "Notícia", icon: Newspaper },
  { label: "Análise", icon: ClipboardList },
  { label: "Scouts", icon: User },
];

export function HomeBanner() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 15%, var(--color-accent) 0, transparent 32%), radial-gradient(circle at 90% 80%, var(--color-accent) 0, transparent 34%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:gap-8 md:px-6 md:py-20">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <span className="star-divider flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]">
            <StarMark className="h-3 w-3" /> Seu portal do Belo
          </span>

          <div className="mt-10 flex flex-col items-center gap-1 md:mt-11 md:items-start">
            <span className="relative font-serif text-5xl font-black tracking-tight text-ink md:text-6xl">
              <MainStar className="absolute -top-8 left-1/2 h-8 w-8 -translate-x-1/2 md:-top-9 md:h-9 md:w-9" />
              {SITE_SHORT_NAME}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {SITE_NAME}
            </span>
          </div>

          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
            {SITE_DESCRIPTION}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {TAGLINE_ITEMS.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="hover-pop flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <Icon className="h-4 w-4 text-accent" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start">
            <Link
              href="/publicacoes"
              className="hover-pop group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-bold text-paper shadow-[0_10px_28px_-8px_var(--color-accent-soft)] transition-colors duration-300 hover:bg-accent-dark"
            >
              Ver últimas notícias
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-accent hover:text-accent"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-accent hover:text-accent"
              >
                <XIcon className="h-4 w-4" />
              </a>
              <span className="text-xs text-muted">{SOCIAL_LINKS.handle}</span>
            </div>
          </div>
        </div>

        <div className="relative hidden items-center justify-center py-4 md:flex">
          <div
            className="absolute h-56 w-56 rounded-full bg-accent/25 blur-3xl md:h-72 md:w-72"
            aria-hidden
          />
          <div
            className="absolute h-64 w-64 rounded-full border border-dashed border-line/70 md:h-80 md:w-80"
            aria-hidden
          />
          <Image
            src="/logobelo.png"
            alt="Escudo do Botafogo-PB"
            width={416}
            height={520}
            priority
            className="float-slow relative h-52 w-auto drop-shadow-[0_25px_45px_rgba(0,0,0,0.4)] md:h-72"
          />
        </div>
      </div>
    </section>
  );
}
