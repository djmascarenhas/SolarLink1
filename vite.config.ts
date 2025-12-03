/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTests.ts',
      css: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // Also expose API_KEY just in case
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    }
  };
});
