import Link from "next/link";
import { StarMark } from "@/components/ui/StarMark";
import { SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const STAR_SIZE: Record<Size, string> = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

const CDB_SIZE: Record<Size, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

const CAPTION_SIZE: Record<Size, string> = {
  sm: "text-[8px]",
  md: "text-[10px]",
  lg: "text-xs",
};

const INLINE_TEXT_SIZE: Record<Size, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

interface LogoProps {
  layout?: "inline" | "stacked";
  size?: Size;
  href?: string | null;
  className?: string;
}

export function Logo({ layout = "inline", size = "sm", href = "/", className }: LogoProps) {
  const content =
    layout === "stacked" ? (
      <span className={cn("group inline-flex flex-col items-center gap-1 leading-none", className)}>
        <StarMark className={STAR_SIZE[size]} />
        <span className={cn("font-serif font-black tracking-tight text-ink", CDB_SIZE[size])}>
          {SITE_SHORT_NAME}
        </span>
        <span
          className={cn(
            "font-semibold uppercase tracking-[0.25em] text-muted",
            CAPTION_SIZE[size],
          )}
        >
          {SITE_NAME}
        </span>
      </span>
    ) : (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <StarMark className={STAR_SIZE[size]} />
        <span className={cn("font-serif font-bold tracking-tight text-ink", INLINE_TEXT_SIZE[size])}>
          {SITE_NAME}
        </span>
      </span>
    );

  if (!href) return content;

  return (
    <Link href={href} className="group inline-flex items-center shrink-0">
      {content}
    </Link>
  );
}
