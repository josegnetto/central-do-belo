// Proxy cacheado para as imagens de capa do Supabase Storage.
//
// Usa a Cache API nativa da Cloudflare (`caches.default`) na borda: a primeira
// requisição de cada imagem busca do Supabase, as seguintes (de qualquer
// visitante, em qualquer lugar) são servidas direto do cache da Cloudflare
// sem tocar no Supabase. Arquivos são content-addressed (nome com timestamp +
// hash aleatório, nunca reescritos — ver ImageUploader), então cache
// "immutable" por 1 ano é seguro.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!SUPABASE_URL) {
    return new Response("Not configured", { status: 404 });
  }

  const { path } = await context.params;
  const targetUrl = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${path
    .map(encodeURIComponent)
    .join("/")}`;

  const cache = (globalThis as unknown as { caches?: { default: Cache } }).caches?.default;
  const cacheKey = new Request(targetUrl, { method: "GET" });

  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  const originResponse = await fetch(targetUrl, {
    headers: { Accept: request.headers.get("accept") ?? "image/*" },
  });

  if (!originResponse.ok || !originResponse.body) {
    return new Response("Not found", { status: originResponse.status || 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", originResponse.headers.get("content-type") ?? "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  const response = new Response(originResponse.body, {
    status: 200,
    headers,
  });

  if (cache) {
    await cache.put(cacheKey, response.clone());
  }

  return response;
}
