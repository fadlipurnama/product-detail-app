import { defineConfig } from 'vite';

export default defineConfig({
  // index.html berada di root frontend/ — Vite default, tidak perlu root override

  build: {
    // Output ke dist/ (Vite default)
    outDir: 'dist',
    // Kosongkan dist/ sebelum build
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    // Proxy request /api ke backend Express agar tidak kena CORS saat dev
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
