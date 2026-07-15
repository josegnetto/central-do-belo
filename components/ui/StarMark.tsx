import { cn } from "@/lib/cn";

const FACETS = [
  "M50,55 L39,39 L50,5 L61,39 Z", // topo
  "M50,55 L61,39 L98,39 L68,60 Z", // direita
  "M50,55 L68,60 L79,95 L50,74 Z", // base direita
  "M50,55 L50,74 L21,95 L32,60 Z", // base esquerda
  "M50,55 L32,60 L2,39 L39,39 Z", // esquerda
];

const GEM_COLORS = ["#ff6a5c", "var(--color-accent)", "#b8241c", "#7d1712", "#9c1e16"];
const SOLID_OPACITIES = [1, 0.85, 0.7, 0.55, 0.7];

interface StarMarkProps {
  className?: string;
  /** "gem" = facetada em vermelho fixo (marca oficial). "solid" = uma cor só
   * (currentColor), para usar sobre fundos coloridos como badges vermelhas. */
  variant?: "gem" | "solid";
}

// Estrela facetada (estilo "gem"): um único desenho de estrela, reaproveitado
// em todo o site no lugar do caractere genérico "★".
export function StarMark({ className, variant = "gem" }: StarMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        "shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[18deg] group-hover:scale-110 group-active:rotate-[18deg] group-active:scale-95",
        className,
      )}
      aria-hidden
      fill="none"
    >
      {FACETS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={variant === "gem" ? GEM_COLORS[i] : "currentColor"}
          opacity={variant === "solid" ? SOLID_OPACITIES[i] : undefined}
        />
      ))}
    </svg>
  );
}
