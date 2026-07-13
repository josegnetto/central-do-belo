import { cn } from "@/lib/cn";

export function StarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[18deg] group-hover:scale-110 group-active:rotate-[18deg] group-active:scale-95",
        className,
      )}
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="star-mark-gradient" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-accent-dark)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <path
        d="M50 5 L61 39 L98 39 L68 60 L79 95 L50 74 L21 95 L32 60 L2 39 L39 39 Z"
        fill="url(#star-mark-gradient)"
      />
      <path d="M50 5 L61 39 L50 74 L39 39 Z" fill="black" opacity="0.12" />
    </svg>
  );
}
