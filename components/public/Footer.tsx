import Link from "next/link";
import { CATEGORIES, SITE_DESCRIPTION, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, XIcon } from "@/components/icons/BrandIcons";

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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <span className="text-xs text-muted">{SOCIAL_LINKS.handle}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Editorias
            </h4>
            <ul className="mt-4 flex flex-col items-center gap-2.5 md:items-start">
              {CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-line pt-6 text-xs text-muted md:flex-row md:justify-between">
          <span>
            © {year} {SITE_NAME}. Portal independente, sem vínculo oficial com o clube.
          </span>
          <span className="star-divider">★</span>
        </div>
      </div>
    </footer>
  );
}
