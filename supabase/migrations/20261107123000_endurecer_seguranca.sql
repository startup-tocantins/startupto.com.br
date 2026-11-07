-- Endurecimento apontado pelo Security Advisor do Supabase.

-- 1) is_admin() sai do schema exposto pela API (public) para um schema privado.
create schema if not exists privado;
revoke all on schema privado from public, anon;
grant usage on schema privado to authenticated, service_role;

create or replace function privado.is_admin()
returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfis where id = (select auth.uid()) and papel = 'admin'
  );
$$;
revoke all on function privado.is_admin() from public, anon;
grant execute on function privado.is_admin() to authenticated, service_role;

alter policy perfis_select_proprio on public.perfis
  using (id = (select auth.uid()) or (select privado.is_admin()));
alter policy historico_select on public.historico_associado
  using (perfil_id = (select auth.uid()) or (select privado.is_admin()));
alter policy config_select_admin on public.configuracoes_privadas
  using ((select privado.is_admin()));
alter policy atas_select on public.atas
  using (
    (select privado.is_admin())
    or exists (select 1 from public.perfis p where p.id = (select auth.uid()) and p.status = 'ativo')
  );

drop function public.is_admin();

-- 2) Vitrine sem SECURITY DEFINER: a view passa a respeitar RLS (security_invoker)
--    e o papel anon recebe apenas as colunas públicas, nas linhas publicáveis.
grant select (id, startup_nome, logo_path, setor, estagio, cidade, site, categoria, status, modalidade, vitrine_opt_in)
  on public.perfis to anon;

create policy perfis_vitrine_publica on public.perfis
  for select to anon
  using (status = 'ativo' and modalidade = 'associado' and vitrine_opt_in and startup_nome is not null);

alter view public.vitrine set (security_invoker = true);

-- 3) Tabelas acessadas só pelo servidor (service role): RLS ligado e nenhuma política, de propósito.
comment on table public.solicitacoes_exclusao is 'Somente service role. RLS sem políticas é intencional.';
comment on table public.stripe_eventos is 'Somente service role. RLS sem políticas é intencional.';
