<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xn6f5LcYakKEWcApwLujnfLYUP1ryCAY

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## O que fazer em seguida

Se você acabou de clonar o repositório e quer saber por onde começar, siga estes passos rápidos:

1. **Criar a configuração local**
   - Copie o arquivo `.env.local.example` (se existir) para `.env.local` ou crie o arquivo manualmente.
   - Preencha a variável `GEMINI_API_KEY` com a sua chave da API Gemini.
2. **Explorar a interface**
   - Rode `npm run dev` e acesse a aplicação em `http://localhost:5173`.
   - Navegue pelo portal do consumidor para testar os fluxos principais e verificar se as rotas estão funcionando.
3. **Executar os testes**
   - Rode `npm test` para validar os componentes críticos (ex.: Header) com Vitest e Testing Library.
4. **Próximos passos sugeridos**
   - Consulte o arquivo `IMPROVEMENTS_PLAN.md` para ver melhorias já implementadas e o roadmap futuro.
   - Priorize a validação de formulários e a integração com o Gemini API nas rotas do portal do consumidor.
