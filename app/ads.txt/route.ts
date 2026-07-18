// Publisher ID fixo (não depende de env var em runtime): no adaptador
// @opennextjs/cloudflare, process.env em Route Handlers só é populado a
// partir das vars configuradas no Worker (dashboard/wrangler), então se
// NEXT_PUBLIC_ADSENSE_CLIENT_ID não estiver provisionada lá (mesmo estando
// em .env.local), esta rota cairia em 404 silenciosamente em produção.
export const dynamic = "force-static";

export function GET() {
  return new Response("google.com, pub-1169188851207661, DIRECT, f08c47fec0942fa0\n", {
    headers: { "Content-Type": "text/plain" },
  });
}
