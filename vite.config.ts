import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Custom plugin to inject headers
const injectHeaders = () => ({
  name: 'inject-headers',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Simulate authenticated user
      res.setHeader('gap-auth', 'dev@cluster-iq.io');
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), injectHeaders()],

  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets'),
      src: path.resolve(__dirname, 'src'),
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@patternfly/react-core'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_CIQ_API_URL || 'http://localhost:8081',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api/v1'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('sending request to the target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('received response from the target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
