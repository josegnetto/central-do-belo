// Enquadramento da imagem de capa via ponto focal.
//
// O ponto escolhido pelo admin é gravado no fragmento da própria URL da capa
// (ex.: "...capa.jpg#fx=30&fy=70"). Fragmentos nunca são enviados ao servidor,
// então o Supabase Storage continua servindo o mesmo arquivo — e não é preciso
// nenhuma coluna nova no banco. URLs antigas (sem fragmento) caem no padrão
// centralizado (50/50).

export interface CoverFraming {
  /** Percentual horizontal do ponto focal (0 = esquerda, 100 = direita). */
  x: number;
  /** Percentual vertical do ponto focal (0 = topo, 100 = base). */
  y: number;
}

export const DEFAULT_FRAMING: CoverFraming = { x: 50, y: 50 };

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function parseCoverFraming(url: string | null | undefined): CoverFraming {
  if (!url) return DEFAULT_FRAMING;
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return DEFAULT_FRAMING;

  const params = new URLSearchParams(url.slice(hashIndex + 1));
  const x = Number(params.get("fx"));
  const y = Number(params.get("fy"));

  return {
    x: Number.isFinite(x) ? clampPercent(x) : DEFAULT_FRAMING.x,
    y: Number.isFinite(y) ? clampPercent(y) : DEFAULT_FRAMING.y,
  };
}

export function withCoverFraming(url: string, framing: CoverFraming): string {
  const base = url.split("#")[0];
  const x = clampPercent(framing.x);
  const y = clampPercent(framing.y);
  if (x === DEFAULT_FRAMING.x && y === DEFAULT_FRAMING.y) return base;
  return `${base}#fx=${x}&fy=${y}`;
}

/** Valor pronto para `object-position` (ex.: "30% 70%"). */
export function coverObjectPosition(url: string | null | undefined): string {
  const { x, y } = parseCoverFraming(url);
  return `${x}% ${y}%`;
}

/** URL sem o fragmento de enquadramento — para meta tags OG, JSON-LD, etc. */
export function stripCoverFraming(url: string): string {
  return url.split("#")[0];
}
