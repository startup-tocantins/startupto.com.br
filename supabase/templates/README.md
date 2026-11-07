# Templates do Supabase Auth (emails.md, seção A)

Cole no painel do Supabase em **Authentication → Emails → Templates**:

| Template do Supabase | Assunto | Arquivo |
|---|---|---|
| Magic Link | Seu link de acesso | `link-de-acesso.html` |
| Change Email Address | Confirme seu novo e-mail | `troca-de-email.html` |

Os links usam `token_hash` e apontam para `/auth/confirm` do site, que abre a sessão no servidor —
funciona mesmo se a pessoa abrir o e-mail em outro aparelho.
