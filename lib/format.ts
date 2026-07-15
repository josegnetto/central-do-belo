// Fuso horário do site: Brasília, sempre explícito — nunca depende do fuso
// padrão do servidor/ambiente (que muda conforme a hospedagem: Vercel,
// Cloudflare Workers, a máquina local de quem está desenvolvendo, etc.).
// Brasil não observa horário de verão desde 2019, então o offset é fixo.
export const APP_TIME_ZONE = "America/Sao_Paulo";
const SAO_PAULO_UTC_OFFSET_MINUTES = 3 * 60;

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
    hourCycle: "h23",
  }).format(new Date(iso));
}

function getSaoPauloParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

// Componentes do instante `iso` já convertidos para o horário de Brasília,
// no formato aceito por <input type="datetime-local">. Usado para popular o
// campo de agendamento ao editar uma publicação.
export function formatDateTimeLocal(iso: string | null): string {
  if (!iso) return "";
  const { year, month, day, hour, minute } = getSaoPauloParts(new Date(iso));
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

// Converte um valor de <input type="datetime-local"> (ex.: "2026-07-20T15:00"),
// sempre interpretado como horário de Brasília, para um ISO string em UTC —
// pronto para salvar em `published_at`. Não depende do fuso do navegador nem
// do servidor: dois admins em fusos diferentes agendando "15:00" agendam
// para o mesmo instante.
export function saoPauloLocalToUtcIso(localValue: string): string | null {
  if (!localValue) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(localValue);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const utcMs =
    Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)) +
    SAO_PAULO_UTC_OFFSET_MINUTES * 60 * 1000;

  return new Date(utcMs).toISOString();
}
