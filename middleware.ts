import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Convenção antiga (middleware.ts / função `middleware`), mantida de propósito:
// o `proxy.ts` do Next.js 16 roda só em runtime Node.js, sem opção de Edge, e o
// adaptador @opennextjs/cloudflare ainda não suporta middleware em Node.js —
// só Edge. middleware.ts está deprecated mas continua funcional (com um aviso
// no build) e é o único jeito de rodar isso no Cloudflare Workers hoje.
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
