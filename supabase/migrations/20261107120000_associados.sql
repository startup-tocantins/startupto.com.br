-- Associação Tocantinense de Startups — dados de associados
-- Dados pessoais vivem apenas aqui (nunca no Sanity).

create type public.modalidade as enum ('comunidade', 'associado');
create type public.status_associado as enum (
  'comunidade',
  'pendente_aprovacao',
  'aguardando_pagamento',
  'ativo',
  'inadimplente',
  'recusado',
  'cancelado'
);
create type public.categoria_associado as enum ('fundador', 'titular');
create type public.papel as enum ('membro', 'admin');
create type public.tipo_documento as enum ('cpf', 'cnpj');

-- ---------------------------------------------------------------------------
-- Perfis (1:1 com auth.users)
-- ---------------------------------------------------------------------------
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null check (char_length(nome) between 2 and 200),
  email text not null,
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  cidade text not null,                      -- slug da cidade (Sanity)
  tipo_documento public.tipo_documento,
  documento text check (documento is null or documento ~ '^[0-9]{11}$|^[0-9]{14}$'),
  startup_nome text,
  setor text,                                -- slug (Sanity)
  estagio text,                              -- slug (Sanity)
  site text,
  logo_path text,                            -- caminho no bucket "logos"
  modalidade public.modalidade not null default 'comunidade',
  status public.status_associado not null default 'comunidade',
  categoria public.categoria_associado not null default 'titular',
  isento boolean not null default false,
  motivo_isencao text,
  vitrine_opt_in boolean not null default false,
  aceite_estatuto_em timestamptz,
  aceite_privacidade_em timestamptz not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  vencimento date,
  papel public.papel not null default 'membro',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint isencao_com_motivo check (not isento or coalesce(motivo_isencao, '') <> ''),
  constraint associado_completo check (
    modalidade = 'comunidade'
    or (documento is not null and tipo_documento is not null and startup_nome is not null
        and setor is not null and estagio is not null and aceite_estatuto_em is not null)
  )
);

create unique index perfis_email_idx on public.perfis (lower(email));
create index perfis_status_idx on public.perfis (status);
create index perfis_modalidade_idx on public.perfis (modalidade);

create or replace function public.tocar_atualizado_em()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

create trigger perfis_atualizado_em
  before update on public.perfis
  for each row execute function public.tocar_atualizado_em();

-- ---------------------------------------------------------------------------
-- Histórico (auditoria de mudanças de status, categoria, isenção)
-- ---------------------------------------------------------------------------
create table public.historico_associado (
  id bigint generated always as identity primary key,
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  acao text not null,
  status_anterior public.status_associado,
  status_novo public.status_associado,
  autor_id uuid references auth.users (id) on delete set null,
  observacao text,
  criado_em timestamptz not null default now()
);
create index historico_perfil_idx on public.historico_associado (perfil_id, criado_em desc);

-- ---------------------------------------------------------------------------
-- Configurações privadas (ex.: link do grupo de WhatsApp da Comunidade)
-- ---------------------------------------------------------------------------
create table public.configuracoes_privadas (
  chave text primary key,
  valor text not null default '',
  atualizado_em timestamptz not null default now(),
  atualizado_por uuid references auth.users (id) on delete set null
);
insert into public.configuracoes_privadas (chave, valor) values ('whatsapp_grupo_comunidade', '');

-- ---------------------------------------------------------------------------
-- Atas de Assembleia (arquivos no bucket privado "atas")
-- ---------------------------------------------------------------------------
create table public.atas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  data_assembleia date not null,
  caminho text not null unique,
  criado_em timestamptz not null default now(),
  criado_por uuid references auth.users (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Pedidos de exclusão de dados (LGPD, art. 18)
-- ---------------------------------------------------------------------------
create table public.solicitacoes_exclusao (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references public.perfis (id) on delete set null,
  nome text not null,
  email text not null,
  criado_em timestamptz not null default now(),
  prazo date not null default (current_date + 15),
  concluida_em timestamptz,
  observacao text
);

-- ---------------------------------------------------------------------------
-- Idempotência de webhooks do Stripe
-- ---------------------------------------------------------------------------
create table public.stripe_eventos (
  id text primary key,
  tipo text not null,
  recebido_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfis where id = (select auth.uid()) and papel = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.perfis enable row level security;
alter table public.historico_associado enable row level security;
alter table public.configuracoes_privadas enable row level security;
alter table public.atas enable row level security;
alter table public.solicitacoes_exclusao enable row level security;
alter table public.stripe_eventos enable row level security;

-- Perfis: cada pessoa lê o próprio; admin lê todos.
create policy perfis_select_proprio on public.perfis
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- Atualização do próprio perfil, restrita por privilégios de coluna (abaixo).
create policy perfis_update_proprio on public.perfis
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke all on public.perfis from anon;
revoke insert, update, delete on public.perfis from authenticated;
grant select on public.perfis to authenticated;
grant update (nome, whatsapp, cidade, startup_nome, setor, estagio, site, logo_path, vitrine_opt_in)
  on public.perfis to authenticated;

-- Histórico: o próprio associado e admins leem; escrita só pelo servidor (service role).
create policy historico_select on public.historico_associado
  for select to authenticated
  using (perfil_id = (select auth.uid()) or (select public.is_admin()));
revoke all on public.historico_associado from anon;
revoke insert, update, delete on public.historico_associado from authenticated;
grant select on public.historico_associado to authenticated;

-- Configurações privadas: apenas admins leem; escrita pelo servidor.
create policy config_select_admin on public.configuracoes_privadas
  for select to authenticated using ((select public.is_admin()));
revoke all on public.configuracoes_privadas from anon;
revoke insert, update, delete on public.configuracoes_privadas from authenticated;
grant select on public.configuracoes_privadas to authenticated;

-- Atas: associados ativos e admins listam; arquivos só por URL assinada gerada no servidor.
create policy atas_select on public.atas
  for select to authenticated
  using (
    (select public.is_admin())
    or exists (select 1 from public.perfis p where p.id = (select auth.uid()) and p.status = 'ativo')
  );
revoke all on public.atas from anon;
revoke insert, update, delete on public.atas from authenticated;
grant select on public.atas to authenticated;

-- Exclusão de dados e eventos do Stripe: apenas servidor.
revoke all on public.solicitacoes_exclusao from anon, authenticated;
revoke all on public.stripe_eventos from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Vitrine pública: somente campos públicos de associados ativos com opt-in.
-- A view roda com os privilégios do dono (ignora RLS) e expõe só estas colunas.
-- ---------------------------------------------------------------------------
create view public.vitrine
with (security_invoker = false) as
  select
    p.id,
    p.startup_nome as nome_startup,
    p.logo_path,
    p.setor,
    p.estagio,
    p.cidade,
    p.site,
    p.categoria
  from public.perfis p
  where p.status = 'ativo'
    and p.modalidade = 'associado'
    and p.vitrine_opt_in
    and p.startup_nome is not null;

revoke all on public.vitrine from anon, authenticated;
grant select on public.vitrine to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('logos', 'logos', true, 1048576, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('atas', 'atas', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;
-- Uploads e URLs assinadas são feitos pelo servidor com a service role;
-- nenhuma política de escrita é concedida a anon/authenticated.
