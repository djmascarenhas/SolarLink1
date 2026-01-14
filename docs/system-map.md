# Mapa de Páginas e Conexões Externas

Este documento resume como o aplicativo SolarLink organiza suas páginas (views) e como elas se conectam ao Supabase, à função edge e à IA da Google (Gemini).

## Visão geral de navegação (App)

O `App.tsx` controla a navegação baseada em estado (`currentView`) e renderiza diferentes seções conforme o valor atual:

| View (`currentView`) | Componentes principais | Objetivo |
| --- | --- | --- |
| `portal` | `PortalHub` | Tela de entrada com seleção entre fluxo de consumidor e portal de empresas. |
| `home` | `Hero`, `WhyChooseUs`, `HowItWorks`, `Features`, `Pricing`, `Faq`, `CtaSection` | Página inicial do portal de empresas (cadastro/login, apresentação e FAQ com IA). |
| `opportunities` | `Opportunities` | Painel de leads disponíveis para compra/consumo. |
| `buy_credits` | `BuyCredits` | Tela para aquisição de créditos. |
| `consumer` | `ConsumerPortal` (usa `ConsumerForm`, `ConsumerSelection`, `ConsumerChat`) | Jornada do consumidor com coleta de dados, escolha de contexto e chat com a agente Solara. |
| `user_registration` | `UserRegistration` | Cadastro de usuários adicionais da empresa logada. |

Sessão de usuário: na montagem, o app restaura a sessão via `supabase.auth.getSession()` e busca perfil/empresa em `profiles`/`companies` para reabrir o portal de empresas; também escuta mudanças com `supabase.auth.onAuthStateChange` e efetua logout com `supabase.auth.signOut()`. 【F:App.tsx†L2-L195】

## Conexões com banco Supabase

A instância global do cliente está em `lib/supabaseClient.ts`, que lê `SUPABASE_URL` e `SUPABASE_ANON_KEY` para criar o client no navegador. 【F:lib/supabaseClient.ts†L1-L9】

### Serviço central (lib/solarLinkService.ts)

O `SolarLinkService` centraliza chamadas Supabase/IA para diferentes fluxos:

- **Onboarding da empresa:** cria usuário no `auth`, registra empresa em `companies`, cria `profiles` ligado à empresa e grava log em `audit_logs`. 【F:lib/solarLinkService.ts†L18-L75】
- **Sessão do usuário:** busca `profiles` com relacionamento `companies` para preencher o painel. 【F:lib/solarLinkService.ts†L78-L97】
- **Leads do consumidor:** insere novos leads em `leads` via formulário público. 【F:lib/solarLinkService.ts†L99-L121】
- **Chat da Solara (lead):** grava mensagem do cliente em `chat_logs`, recupera histórico e chama Gemini para gerar resposta, que é salva novamente em `chat_logs`. 【F:lib/solarLinkService.ts†L123-L205】
- **Histórico do chat:** leitura completa de `chat_logs` por `lead_id`. 【F:lib/solarLinkService.ts†L207-L219】
- **Oportunidades:** lista todos os registros de `leads` (ordenados por criação) para o painel de oportunidades. 【F:lib/solarLinkService.ts†L221-L238】
- **Consumo de créditos:** valida saldo em `companies`, debita créditos e registra auditoria (helper `logAction` em `audit_logs`). 【F:lib/solarLinkService.ts†L240-L282】

### Componentes que chamam Supabase diretamente

- **Hero (login/cadastro inicial):** usa `supabase.auth.signInWithPassword` para login e delega o cadastro ao `SolarLinkService`. 【F:components/Hero.tsx†L90-L165】
- **UserRegistration (time da empresa):** cria novos usuários no `auth`, registra perfis em `profiles` e audita em `audit_logs`. 【F:components/company/UserRegistration.tsx†L31-L108】
- **App:** operações de sessão (`getSession`, `onAuthStateChange`, `signOut`). 【F:App.tsx†L35-L118】

## IA e outras integrações

- **Gemini (Google GenAI):**
  - Inicializado no `SolarLinkService` para gerar respostas no chat do lead. 【F:lib/solarLinkService.ts†L2-L204】
  - Usado no `Hero` para melhorar textos de apresentação da empresa. 【F:components/Hero.tsx†L73-L116】
  - Usado no `Faq` para responder perguntas dos usuários e, opcionalmente, fazer busca (`googleSearch`). 【F:components/Faq.tsx†L34-L92】
- **Supabase Edge Function (`supabase/functions/solara-agent/index.ts`):** função Deno que recebe mensagens, usa client com service role para persistir em `chat_logs` e retorna resposta simulada da agente. Deve ser deployada via `supabase functions deploy`. 【F:supabase/functions/solara-agent/index.ts†L2-L77】

## Fluxo do consumidor (resumo)

1. `PortalHub` leva ao `ConsumerPortal` (view `consumer`).
2. `ConsumerForm` coleta dados e chama `SolarLinkService.createLead` (quando ID real está disponível) para registrar lead.
3. `ConsumerChat` usa `SolarLinkService.processUserMessage` para salvar mensagens em `chat_logs` e gerar respostas da Solara com Gemini. 【F:components/consumer/ConsumerChat.tsx†L22-L103】【F:lib/solarLinkService.ts†L123-L205】

## Fluxo do portal de empresas (resumo)

1. `PortalHub` leva ao `home` (portal de empresas).
2. `Hero` permite login (`supabase.auth.signInWithPassword`) e cadastro via `SolarLinkService.onboardCompany`.
3. Após logar, `UserStatusBar` mostra saldo/empresa, `Opportunities` consome `SolarLinkService.getOpportunities`, `BuyCredits` exibe compra (lógica de débito em `unlockLead`).
4. `UserRegistration` adiciona membros via `supabase.auth.signUp` + `profiles` + `audit_logs`. 【F:components/Hero.tsx†L90-L195】【F:components/company/UserRegistration.tsx†L31-L108】【F:lib/solarLinkService.ts†L18-L238】
