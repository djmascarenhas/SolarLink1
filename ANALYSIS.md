# SolarLink App Analysis

## Overview
- Single-page React app that switches between portal, home, opportunities, credits purchase, consumer portal, and business registration views based on internal state.
- Supabase is used for authentication, profiles/companies data, leads, chat logs, and credit balances; Gemini (GoogleGenAI) powers marketing copy and chat responses.

## Navigation and Session Flow
- `App.tsx` manages view state (`portal`, `home`, `opportunities`, `buy_credits`, `consumer`, `user_registration`) and restores a Supabase auth session on load. When a profile is linked to a company, the user is treated as a business account and redirected to the home dashboard. A logout call clears session state and returns to the portal.
- Scroll anchors are supported by passing hash fragments to `handleNavigate`, which defers scrolling until components mount.

## Authentication and Business Onboarding
- Business login happens in the `Hero` component: Supabase password auth is executed, then company/profile details are fetched through the service layer to populate the in-memory session. Errors surface via alerts.
- Registration uses the service layer for a multi-step flow that signs up the auth user, inserts a `companies` row with inferred document type, creates a `profiles` record linked to the company, and writes an audit log entry. Successful onboarding seeds the local session and returns the user to the home view.

## Supabase Service Layer
- `SolarLinkService` centralizes database access:
  - `onboardCompany` performs auth sign-up, `companies` insert (document type derived by length), `profiles` insert, and audit logging.
  - `getUserSessionData` retrieves the profile with joined company info to hydrate the business dashboard.
  - `createLead` stores public lead submissions in the `leads` table with initial status `novo`.
  - `processUserMessage` saves chat messages to `chat_logs`, builds a prompt with conversation history and context, calls Gemini (`gemini-2.5-flash`), stores the assistant reply, and returns it.
  - `getChatHistory` fetches ordered chat transcripts for a lead.
  - `getOpportunities` lists leads ordered by recency to power the opportunities board.
  - `unlockLead` debits credits from `companies` if the balance covers the cost and returns the new balance.

## Consumer/Chat Backend
- A Supabase Edge Function (`supabase/functions/solara-agent/index.ts`) accepts POSTed messages, logs user and assistant chat entries to `chat_logs`, and returns a lightweight, rule-based Solara response. It uses service-role Supabase credentials and permissive CORS headers for cross-origin calls.

## Configuration Notes
- Supabase client initialization currently falls back to placeholder URL and key unless `SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided in the environment. Gemini API access relies on `API_KEY` in both frontend (for marketing copy) and service-layer usage.
