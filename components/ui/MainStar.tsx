import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A estrela principal da marca (imagem fornecida pelo cliente), usada só nos
 * pontos de maior destaque — acima do "CDB" na logo e no banner da home.
 * Para estrelas pequenas/decorativas pelo resto do site, use StarMark.
 */
export function MainStar({ className }: { className?: string }) {
  return (
    <Image
      src="/estrela.png"
      alt=""
      width={329}
      height={313}
      className={cn(
        "select-none object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[18deg] group-hover:scale-110 group-active:rotate-[18deg] group-active:scale-95",
        className,
      )}
      aria-hidden
    />
  );
}
