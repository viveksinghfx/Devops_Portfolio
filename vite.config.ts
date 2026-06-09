import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    hmr: false,
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react:   ['react', 'react-dom', 'react-router-dom'],
          motion:  ['framer-motion'],
          gsap:    ['gsap'],
          smooth:  ['lenis'],
          icons:   ['lucide-react'],
        },
      },
    },
  },
});
