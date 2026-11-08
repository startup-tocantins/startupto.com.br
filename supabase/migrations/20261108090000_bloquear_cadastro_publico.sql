-- Bloqueia cadastros pela API pública do Supabase Auth
-- (equivale a "Allow new users to sign up: off", aplicado no banco).
--
-- Só o servidor do site cria contas: ele envia em user_metadata.chave_cadastro um
-- segredo (env SUPABASE_CHAVE_CADASTRO) cujo SHA-256 fica em privado.segredos, e
-- apaga a chave do metadata logo após criar a conta. Signup público e OTP com
-- criação de usuário não conhecem o segredo e são recusados.
--
-- O hash NÃO fica neste arquivo. Para definir/rotacionar (SQL Editor, como postgres):
--   insert into privado.segredos (chave, hash)
--   values ('cadastro', encode(extensions.digest('<SUPABASE_CHAVE_CADASTRO>', 'sha256'), 'hex'))
--   on conflict (chave) do update set hash = excluded.hash;

create table if not exists privado.segredos (
  chave text primary key,
  hash text not null
);
revoke all on privado.segredos from public, anon, authenticated;

create or replace function privado.bloquear_cadastro_publico()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  esperado text;
  recebido text := new.raw_user_meta_data ->> 'chave_cadastro';
begin
  select hash into esperado from privado.segredos where chave = 'cadastro';
  if esperado is null
     or recebido is null
     or encode(extensions.digest(recebido, 'sha256'), 'hex') <> esperado then
    raise exception 'Cadastro público desativado: use o site da Associação.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

revoke all on function privado.bloquear_cadastro_publico() from public, anon, authenticated;

drop trigger if exists bloquear_cadastro_publico on auth.users;
create trigger bloquear_cadastro_publico
  before insert on auth.users
  for each row execute function privado.bloquear_cadastro_publico();
