<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xn6f5LcYakKEWcApwLujnfLYUP1ryCAY

## Run Locally

**Prerequisites:**  Node.js 20 and npm. If the container or host image não traz essas ferramentas instaladas, use o [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) para obtê-las:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source "$HOME/.nvm/nvm.sh"
nvm install 20
nvm use 20
```

> Dica: se você está em um ambiente sem acesso à internet para baixar pacotes APT, o nvm costuma funcionar porque baixa diretamente o binário do Node.js.

1. Instale as dependências:
   `npm install`
2. Defina `GEMINI_API_KEY` em [.env.local](.env.local) com sua chave do Gemini
3. Rode a aplicação:
   `npm run dev`

## Testes

Para validar a aplicação localmente:

```bash
npm run lint
npm test
npm run test:unit
npm run test:integration
```

Se você receber a mensagem `bash: command not found: npm`, certifique-se de ter carregado o Node.js via nvm (passos acima). Depois disso, abra um novo shell ou rode `source "$HOME/.nvm/nvm.sh" && nvm use` antes dos comandos.
