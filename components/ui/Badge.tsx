import { cn } from "@/lib/cn";
import { StarMark } from "@/components/ui/StarMark";

type Tone = "accent" | "neutral" | "muted";

const toneClasses: Record<Tone, string> = {
  accent: "bg-accent text-paper shadow-[0_2px_10px_-2px_var(--color-accent-soft)]",
  neutral: "bg-ink text-paper",
  muted: "bg-paper-muted text-ink-soft border border-line",
};

export function Badge({
  children,
  tone = "accent",
  star = false,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  star?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 self-start rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {star ? <StarMark variant="solid" className="h-2.5 w-2.5" /> : null}
      {children}
    </span>
  );
}
