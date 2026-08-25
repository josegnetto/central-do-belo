import { InstagramIcon, XIcon } from "@/components/icons/BrandIcons";
import { StarMark } from "@/components/ui/StarMark";
import { SOCIAL_LINKS } from "@/lib/constants";

/**
 * Filete de identidade da home: uma linha entre o cabeçalho e a manchete
 * dizendo o que o site é, com os perfis sociais ao lado.
 *
 * É o que restou (de propósito) do antigo banner institucional de tela
 * inteira: o site é novo e quem chega pelo Google precisa entender em segundos
 * que portal é este — mas essa apresentação não pode custar a dobra. Uma linha
 * apresenta; a manchete continua sendo a primeira coisa de peso na tela.
 */
export function WelcomeStrip() {
  return (
    <div className="border-b border-line bg-paper-muted/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 md:px-6">
        <p className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft sm:tracking-[0.14em]">
          <StarMark className="h-3 w-3 shrink-0" />
          <span className="truncate">
            Cobertura independente do Botafogo-PB
            <span className="hidden text-muted md:inline"> — notícias, análises e scout</span>
          </span>
        </p>

        {/* No celular os ícones saem para "Botafogo-PB" nunca ser truncado;
            os perfis seguem no rodapé e na página de contato. */}
        <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram do Central do Belo"
            className="text-muted transition-colors duration-300 hover:text-accent"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL_LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) do Central do Belo"
            className="text-muted transition-colors duration-300 hover:text-accent"
          >
            <XIcon className="h-3.5 w-3.5" />
          </a>
          <span className="hidden text-xs text-muted md:inline">{SOCIAL_LINKS.handle}</span>
        </div>
      </div>
    </div>
  );
}
