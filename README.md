<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xn6f5LcYakKEWcApwLujnfLYUP1ryCAY

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Banco de dados com Prisma + PostgreSQL

1. Configure a URL do PostgreSQL em `.env` (ex.: copie de `.env.example`).
2. Gere o cliente e crie as tabelas:
   `npm run prisma:migrate`
3. Popule dados de teste:
   `npm run prisma:seed`
