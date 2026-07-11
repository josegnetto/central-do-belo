export function HeroPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 500"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.12">
        <path d="M-100 120 C 250 20, 550 220, 900 90 S 1400 40, 1500 140" />
        <path d="M-100 220 C 250 120, 550 320, 900 190 S 1400 140, 1500 240" />
        <path d="M-100 320 C 250 220, 550 420, 900 290 S 1400 240, 1500 340" />
      </g>
      <g fill="none" stroke="var(--color-ink)" strokeWidth="1" opacity="0.06">
        <path d="M-100 60 C 250 -40, 550 160, 900 30 S 1400 -20, 1500 80" />
        <path d="M-100 400 C 250 300, 550 500, 900 370 S 1400 320, 1500 420" />
      </g>
    </svg>
  );
}
