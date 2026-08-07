import Link from "next/link";
import { CATEGORIES, DEVELOPER, SITE_DESCRIPTION, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { GitHubIcon, InstagramIcon, XIcon } from "@/components/icons/BrandIcons";

export function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: InstagramIcon },
    { label: "X", href: SOCIAL_LINKS.x, icon: XIcon },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-line bg-paper-muted">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, var(--color-accent) 0, transparent 35%), radial-gradient(circle at 85% 80%, var(--color-accent) 0, transparent 35%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="flex max-w-xs flex-col items-center md:items-start">
            <Logo layout="stacked" size="md" />
            <p className="mt-4 text-sm text-muted">{SITE_DESCRIPTION}</p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:rotate-6 hover:border-accent hover:text-accent hover:shadow-[0_8px_20px_-6px_var(--color-accent-soft)] active:scale-90 active:border-accent active:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <span className="text-xs text-muted">{SOCIAL_LINKS.handle}</span>
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Editorias
              </h4>
              <ul className="mt-4 flex flex-col items-center gap-2.5 md:items-start">
                {CATEGORIES.map((category) => (
                  <li key={category.value}>
                    <Link
                      href={`/${category.slug}`}
                      className="nav-underline text-sm text-muted transition-colors duration-300 hover:text-accent active:text-accent"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Institucional
              </h4>
              <ul className="mt-4 flex flex-col items-center gap-2.5 md:items-start">
                {[
                  { label: "Sobre", href: "/sobre" },
                  { label: "Contato", href: "/contato" },
                  { label: "Política Editorial", href: "/politica-editorial" },
                  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
                  { label: "Termos de Uso", href: "/termos-de-uso" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="nav-underline text-sm text-muted transition-colors duration-300 hover:text-accent active:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-line pt-6 text-xs text-muted md:flex-row md:justify-between">
          <span>
            © {year} {SITE_NAME}. Portal independente, sem vínculo oficial com o clube.
          </span>
          <a
            href={DEVELOPER.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 transition-colors duration-300 hover:text-accent"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            Desenvolvido por <span className="font-semibold">{DEVELOPER.name}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
