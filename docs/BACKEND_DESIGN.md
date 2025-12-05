# Plano de Backend e Modelo de Dados

## Casos de uso prioritários
- **Autenticação e sessão**: login/logout, recuperação de senha e persistência de sessão. Decidir se mantemos Supabase Auth ou migramos para provedor próprio.
- **CRUD de perfis e empresas**: criação de conta de empresa, associação de usuários a empresas, gestão de papéis (admin, vendedor, técnico, financeiro) e atualização de dados cadastrais.
- **Gestão de oportunidades**: registro de leads/propostas, atribuição a empresas/usuários, alteração de status (novo, em contato, proposta, ganho, perdido) e histórico de interação.
- **Gestão de créditos**: compra de créditos (checkout externo), débito de créditos ao reservar/visualizar oportunidade, estornos e auditoria das operações.
- **Uploads**: envio de documentos e mídias (ex.: comprovantes, anexos de proposta) com associação a usuário/empresa/oportunidade.

## Stack recomendada
- **Runtime/Framework**: NestJS sobre Node.js 20 com Fastify para melhor throughput. Convenções de módulos ajudam a separar domínios (auth, companies, opportunities, billing, uploads).
- **Banco**: PostgreSQL gerenciado (pode continuar em Supabase ou instância própria). Mantém JSONB para campos flexíveis como `address`.
- **ORM**: Prisma (boa DX e migrações). Em caso de migração a partir do Supabase, usar `prisma db pull` para importar o esquema inicial.
- **Autenticação**:
  - **Opção A — manter Supabase Auth**: preservar login existente do front. API backend usa JWT do Supabase (via middleware) e consulta claims `sub` para mapear usuários. Vantagem: menor esforço e UI de senha já integrada.
  - **Opção B — migrar**: implementar auth própria (ex.: NestJS + Passport + JWT + rotas /auth). Exige fluxo de reset de senha e sincronização dos usuários já criados; precisa de migração dos hashes.
- **Armazenamento de arquivos**: Supabase Storage (se mantido) ou provider S3-compatível. Upload via URL pré-assinada, salvando metadados no banco.

## Modelo de dados inicial
Alinhado com o front atual (campos observados em `Hero.tsx`, `UserRegistration.tsx` e formulários de consumidor):

### auth & perfis
- **profiles** (já usada pelo front):
  - `id` (UUID, PK) — mesmo ID do usuário do Supabase Auth.
  - `company_id` (FK → companies.id)
  - `full_name`, `email`, `whatsapp`
  - `role` (enum: admin, vendedor, tecnico, financeiro)
  - `created_at`, `updated_at`

### empresas
- **companies**:
  - `id` (UUID, PK)
  - `name`
  - `document` (CNPJ/CPF) + `document_type` (enum)
  - `address` (JSONB: { cidade, uf, cep, rua })
  - `credits` (integer, default 0)
  - `created_at`, `updated_at`

### oportunidades
- **opportunities**:
  - `id` (UUID, PK)
  - `company_id` (FK → companies.id, nullable para leads ainda não vendidos)
  - `assigned_user_id` (FK → profiles.id, opcional)
  - `consumer_name`, `consumer_email`, `consumer_phone`
  - `site_address` (JSONB)
  - `system_size_kwp`, `estimated_value`, `notes`
  - `status` (enum: new, contacted, proposal, won, lost)
  - `source` (enum: marketplace, inbound, referral)
  - `created_at`, `updated_at`

### créditos & faturamento
- **credit_purchases**:
  - `id` (UUID, PK)
  - `company_id` (FK)
  - `quantity` (int), `unit_price`, `total_price`
  - `provider` (ex.: stripe, mercado_pago), `provider_checkout_id`, `status` (pending, paid, failed, refunded)
  - `receipt_url` (opcional, ex.: comprovante de pagamento)
  - `created_at`, `confirmed_at`
- **credit_ledger** (para auditoria de uso de créditos):
  - `id` (UUID, PK)
  - `company_id` (FK)
  - `opportunity_id` (FK, opcional)
  - `delta` (int, + para compra/estorno, - para consumo)
  - `reason` (enum: purchase, reserve_opportunity, refund)
  - `metadata` (JSONB)
  - `created_at`

### sessões
- **sessions** (caso migre de Supabase Auth):
  - `id` (UUID, PK)
  - `user_id` (FK → profiles.id)
  - `refresh_token`, `expires_at`, `user_agent`, `ip_address`
  - Se permanecer no Supabase, usar `supabase.auth.getSession()` no front e validar JWT no backend sem tabela própria.

### uploads
- **uploads**:
  - `id` (UUID, PK)
  - `uploader_id` (FK → profiles.id)
  - `company_id` (FK)
  - `opportunity_id` (FK, opcional)
  - `path` (chave no storage), `mime_type`, `size`
  - `visibility` (enum: private, company, public)
  - `created_at`

## Integração com o front atual
- Endpoints devem aceitar e retornar os campos já consumidos pelo front (ex.: `companies.address` como JSON com `cidade/uf/cep/rua`, `credits` para exibir saldo, `role` em `profiles`).
- Reaproveitar o `userSession` esperado no `AuthContext` (`{ name, type, id, details: { companyName, credits, companyId, role } }`). A API de login deve devolver o perfil + empresa para preencher esses campos.
- Manter as tabelas `profiles`, `companies` e `chat_logs` existentes para evitar ruptura. Migrações adicionais podem ser feitas via Prisma Migrate.

## Próximos passos sugeridos
1. Validar se Supabase Auth será mantido (Opção A) ou migrado (Opção B) e mapear esforço de migração de usuários existentes.
2. Gerar esquema Prisma a partir do banco atual e adicionar tabelas `opportunities`, `credit_purchases`, `credit_ledger` e `uploads`.
3. Implementar módulos NestJS:
   - `auth` (JWT do Supabase ou próprio),
   - `companies`/`profiles`,
   - `opportunities` (com consumo de créditos),
   - `billing` (webhook de pagamento → `credit_purchases` + lançamento em `credit_ledger`),
   - `uploads` (URL pré-assinada + metadados).
4. Criar policies no Supabase (RLS) ou guards no Nest para garantir que usuários só acessem dados da própria empresa, exceto admins do sistema.
