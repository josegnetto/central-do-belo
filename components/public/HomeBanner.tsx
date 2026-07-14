import Image from "next/image";
import { ClipboardList, Newspaper, User } from "lucide-react";
import { StarMark } from "@/components/ui/StarMark";
import { InstagramIcon, XIcon } from "@/components/icons/BrandIcons";
import { SITE_NAME, SITE_SHORT_NAME, SOCIAL_LINKS } from "@/lib/constants";

const TAGLINE_ITEMS = [
  { label: "Notícia", icon: Newspaper },
  { label: "Análise", icon: ClipboardList },
  { label: "Scouts", icon: User },
];

export function HomeBanner() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-12 md:flex-row md:justify-between md:px-6 md:py-16">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="relative mt-7 font-serif text-4xl font-black tracking-tight text-ink md:mt-8 md:text-5xl">
              <StarMark className="absolute -top-6 left-1/2 h-6 w-6 -translate-x-1/2 md:-top-7 md:h-7 md:w-7" />
              {SITE_SHORT_NAME}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {SITE_NAME}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
            {TAGLINE_ITEMS.map(({ label, icon: Icon }, index) => (
              <span key={label} className="flex items-center gap-5">
                {index > 0 ? (
                  <span className="star-divider text-sm" aria-hidden>
                    ★
                  </span>
                ) : null}
                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
                  <Icon className="h-5 w-5 text-accent" />
                  {label}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
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

        <Image
          src="/logobelo.png"
          alt="Escudo do Botafogo-PB"
          width={416}
          height={520}
          priority
          className="h-40 w-auto shrink-0 md:h-56"
        />
      </div>
    </section>
  );
}
