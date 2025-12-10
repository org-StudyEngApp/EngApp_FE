import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@api': path.resolve(__dirname, './src/api'),
    }
  },
  define: {
    global: 'window',
  },
  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  optimizeDeps: {
    include: ['@stomp/stompjs', 'sockjs-client']
  }
});