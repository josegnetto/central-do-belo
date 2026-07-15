import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Pages/Workers não tem o otimizador de imagem nativo da Vercel.
    // A alternativa (Cloudflare Images) é um serviço pago à parte, configurado
    // pelo dashboard da Cloudflare — não pelo next.config. Por isso desligamos
    // a otimização built-in do Next: as imagens continuam funcionando
    // normalmente (lazy loading, srcset, etc.), só sem o redimensionamento
    // automático no servidor. Já comprimimos/redimensionamos no upload
    // (lib/image-compress.ts), então o impacto prático é pequeno.
    unoptimized: true,
    // Mantido por documentação/uso futuro (ex.: se ativar Cloudflare Images
    // depois). Sem efeito enquanto `unoptimized: true` estiver ativo.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;

// Permite que `next dev` acesse bindings do Cloudflare (quando configurados)
// durante o desenvolvimento local, sem precisar rodar via wrangler.
initOpenNextCloudflareForDev();
