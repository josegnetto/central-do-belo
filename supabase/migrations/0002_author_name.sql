-- Central do Belo — assinatura editável por publicação
-- Rode este arquivo no SQL Editor do seu projeto Supabase.
--
-- Permite assinar uma publicação com o nome de um jornalista externo.
-- Quando a coluna fica vazia (NULL), o site continua exibindo a assinatura
-- padrão da redação — ou seja, todas as publicações já existentes seguem
-- funcionando exatamente como antes.

alter table posts add column if not exists author_name text;
