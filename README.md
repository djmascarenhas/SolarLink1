<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SolarLink — Portal Vercel

Guia rápido para rodar e publicar o portal SolarLink em um ambiente Vercel usando Vite.

## Requisitos
- Node.js 18+ e npm
- Conta no Supabase (URL e chave pública ANON)
- Chave de API do Gemini

## Como rodar localmente
1. Instale as dependências: `npm install`
2. Crie o arquivo `.env.local` na raiz com as variáveis abaixo.
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse `http://localhost:5173` para ver o app.

## Variáveis de ambiente
Adicione no `.env.local` ou nas variáveis do projeto na Vercel:

```
VITE_SUPABASE_URL=seu-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-supabase
VITE_GEMINI_API_KEY=sua-chave-gemini
```

## Deploy na Vercel
1. Faça push do repositório para o GitHub e importe-o na Vercel como projeto Vite.
2. Em **Project Settings → Environment Variables**, cadastre as chaves listadas acima.
3. Mantenha o comando de build padrão `npm run build` e o diretório de saída `dist`.
4. Publique. O build estático do Vite é compatível com o hosting estático da Vercel e o app lerá as variáveis configuradas em tempo de execução.

## Dicas de solução de problemas
- Se o build falhar por falta de variáveis, confirme se elas estão preenchidas na Vercel (ou no `.env.local` para ambiente local).
- Confira se a versão do Node no ambiente corresponde à 18 ou superior.
- Rode `npm run build` localmente para validar o bundle antes de publicar.
