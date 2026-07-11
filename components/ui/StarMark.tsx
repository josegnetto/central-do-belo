export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none">
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
