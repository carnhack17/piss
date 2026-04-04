// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'], // ⚡ force le pré-bundling de Supabase
  },
});