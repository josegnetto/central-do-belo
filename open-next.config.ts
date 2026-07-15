import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Configuração mínima: sem cache incremental persistente (R2) por enquanto.
// Isso significa que páginas com `revalidate` funcionam (renderizam sob demanda
// e ficam em cache só dentro do isolate/instância do Worker), mas sem um cache
// compartilhado entre requisições/deploys. Para um site de notícias com
// volume ainda baixo, isso é perfeitamente aceitável — o ganho de configurar
// um bucket R2 como cache incremental é uma otimização futura opcional, não
// um requisito para o site funcionar.
export default defineCloudflareConfig();
