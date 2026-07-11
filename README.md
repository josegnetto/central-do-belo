# Central do Belo (CDB)

Portal de notícias focado exclusivamente no Botafogo-PB, com painel administrativo próprio
(sem WordPress, sem Lovable, sem dependência de terceiros). Construído com Next.js, React,
TypeScript, Tailwind CSS e Supabase. Modo escuro é o modo principal do site.

## Conteúdo

- **Notícias**
- **Raio-X Pré-Jogo**
- **Análise Pós-Jogo**
- **Scout** (indicações de contratações)

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (Postgres, Auth, Storage)
- Tiptap (editor de texto rico)
- Vercel (hospedagem)

## Rodando localmente sem Supabase configurado

O projeto já funciona com `npm run dev` mesmo sem nenhuma variável de ambiente definida: o site
público é exibido com dados de exemplo (`lib/mock-data.ts`) e o painel `/admin` fica acessível
sem login, também com dados de exemplo. Isso serve apenas para visualizar o design e o fluxo —
para publicar conteúdo real, siga o passo a passo abaixo.

```bash
npm install
npm run dev
```

## Passo a passo para colocar no ar (produção)

### 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto.
2. Vá em **SQL Editor** e rode o conteúdo do arquivo [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   Isso cria a tabela `posts`, os enums de categoria/status, as políticas de segurança (RLS) e o
   bucket de Storage `covers` para as imagens de capa.
3. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.

### 2. Criar seu usuário administrador

Como não há tela de cadastro público (só você publica conteúdo), crie o usuário manualmente:

1. No painel do Supabase, vá em **Authentication > Users > Add user**.
2. Cadastre seu e-mail e uma senha forte. Marque como confirmado ("Auto Confirm User").
3. Esse será o login usado em `/admin/login`.

Repita esse passo para cada pessoa que for publicar conteúdo.

### 3. Configurar as variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`: do passo 1.
- `NEXT_PUBLIC_SITE_URL`: coloque `http://localhost:3000` por enquanto; troque para o domínio
  definitivo quando ele estiver pronto.
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: opcionais,
  veja a seção "SEO, Analytics e AdSense" abaixo.

Rode `npm run dev` novamente e acesse `/admin/login` com o usuário criado no passo 2.

### 4. Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte seu repositório Git (GitHub/GitLab/Bitbucket).
2. Ao importar o projeto, configure as mesmas variáveis de ambiente do `.env.local` em
   **Settings > Environment Variables**.
3. Faça o deploy. A cada publicação de conteúdo, o site já atualiza automaticamente (as páginas
   usam revalidação incremental).

### 5. Domínio próprio

Quando tiver o domínio definitivo:

1. Aponte-o para o projeto na Vercel (**Settings > Domains**).
2. Atualize `NEXT_PUBLIC_SITE_URL` (local e na Vercel) para o domínio final — isso corrige as URLs
   canônicas, o `sitemap.xml` e os metadados de compartilhamento.

## SEO, Analytics e AdSense

- **Google Search Console**: em [search.google.com/search-console](https://search.google.com/search-console),
  adicione a propriedade do seu domínio, escolha verificação por "Tag HTML" e copie o valor de
  `content` para `NEXT_PUBLIC_GSC_VERIFICATION`. Depois de publicado, envie o
  `https://seudominio.com/sitemap.xml` no Search Console.
- **Google Analytics**: crie uma propriedade GA4 e copie o ID de medição (`G-XXXXXXXXXX`) para
  `NEXT_PUBLIC_GA_ID`.
- **Google AdSense**: depois que sua conta AdSense for aprovada, copie seu Publisher ID
  (`ca-pub-XXXXXXXXXXXXXXXX`) para `NEXT_PUBLIC_ADSENSE_CLIENT_ID` e substitua o valor
  `pub-XXXXXXXXXXXXXXXX` em [`public/ads.txt`](public/ads.txt) pelo seu ID real.
- **Logo para os dados estruturados**: adicione um arquivo `public/logo.png` (usado no JSON-LD de
  `NewsArticle` exibido para o Google Discover/News).

## Painel administrativo

Acesse `/admin/login`. No painel é possível:

- Criar, editar e excluir publicações.
- Fazer upload da imagem de capa (armazenada no bucket `covers` do Supabase Storage).
- Escrever o conteúdo em um editor de texto rico (Tiptap).
- Escolher a categoria (uma das quatro fixas).
- Salvar como rascunho, agendar para uma data/hora futura, ou publicar imediatamente.
- Pré-visualizar a publicação antes de torná-la pública.

Publicações agendadas ficam visíveis no site automaticamente assim que a data/hora definida é
atingida — não é necessário nenhum job ou cron para isso.

## Estrutura do projeto

```
app/(public)/        páginas públicas (home, categorias, publicação, busca)
app/admin/            painel administrativo (protegido por login)
components/public/    componentes do site público
components/admin/     componentes do painel
components/ui/        componentes de UI compartilhados
lib/                  acesso a dados, SEO, autenticação, utilitários
supabase/migrations/  schema do banco de dados
```

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servidor de produção
npm run lint     # lint
```
