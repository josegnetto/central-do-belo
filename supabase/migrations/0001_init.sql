-- Central do Belo — schema inicial
-- Rode este arquivo no SQL Editor do seu projeto Supabase.

create extension if not exists "pgcrypto";

create type post_category as enum ('noticia', 'raio_x', 'analise_pos_jogo', 'contratacao');
create type post_status as enum ('draft', 'scheduled', 'published');

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  content_text text not null default '',
  cover_image_url text,
  category post_category not null,
  status post_status not null default 'draft',
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  reading_time_minutes int not null default 1,
  seo_title text,
  seo_description text,
  search_vector tsvector generated always as (
    to_tsvector(
      'portuguese',
      coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content_text, '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_search_vector_idx on posts using gin (search_vector);
create index if not exists posts_category_idx on posts (category);
create index if not exists posts_status_published_at_idx on posts (status, published_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row
  execute function set_updated_at();

alter table posts enable row level security;

-- Leitura pública: só publicações "ao vivo" (publicadas, ou agendadas cuja data já passou)
drop policy if exists "public_read_live_posts" on posts;
create policy "public_read_live_posts" on posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    or (status = 'scheduled' and published_at <= now())
  );

-- Administradores (únicos usuários autenticados do projeto) têm acesso total
drop policy if exists "authenticated_full_access" on posts;
create policy "authenticated_full_access" on posts
  for all
  to authenticated
  using (true)
  with check (true);

-- Storage: bucket público para imagens de capa
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

drop policy if exists "covers_public_read" on storage.objects;
create policy "covers_public_read" on storage.objects
  for select
  using (bucket_id = 'covers');

drop policy if exists "covers_authenticated_insert" on storage.objects;
create policy "covers_authenticated_insert" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'covers');

drop policy if exists "covers_authenticated_update" on storage.objects;
create policy "covers_authenticated_update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'covers');

drop policy if exists "covers_authenticated_delete" on storage.objects;
create policy "covers_authenticated_delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'covers');
