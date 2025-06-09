import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080/',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true
      },
      '/avatars': {
        target: 'http://localhost:8080/',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:8080/',
        changeOrigin: true
      }
    }
  }
})
