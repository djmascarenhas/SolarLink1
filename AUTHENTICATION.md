# Estratégia de Autenticação

## Decisão
Optamos por continuar com a autenticação do Supabase (opção **a**), validando o JWT no backend. A stack já utilizava o Supabase para login e acesso ao banco, então manter o provedor reduz acoplamento, reaproveita as sessões existentes e evita criar uma infraestrutura paralela de emissão/rotação de tokens.

## Fluxo
1. **Front-end** obtém e armazena a sessão Supabase de forma consistente no `AuthContext`, disponibilizando o access token para chamadas autenticadas.
2. **Edge Functions** exigem o header `Authorization: Bearer <token>` e validam o JWT via Supabase antes de executar a lógica.
3. **Policies**: middleware de autorização garante que apenas papéis permitidos (admin, business ou consumer) acessem cada função.

## Middlewares Disponíveis
- `authenticateRequest(req)`: extrai e valida o token, retornando `user` ou `Response` 401.
- `authorizeRoles(user, roles)`: bloqueia acesso (403) se o papel do usuário não estiver na lista permitida.
- `jsonError(message, status)`: resposta padrão com CORS e JSON para erros de auth.

Esses utilitários estão em `supabase/functions/_shared/auth.ts` e são reutilizados pelo `solara-agent`.
