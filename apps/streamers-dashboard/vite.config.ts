import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer()],
  build: {
    sourcemap: false,
    rollupOptions: {},
  },
  resolve: {
    alias: {
      '~app': path.resolve(__dirname, './src/app'),
      '~pages': path.resolve(__dirname, './src/pages'),
      '~widgets': path.resolve(__dirname, './src/widgets'),
      '~features': path.resolve(__dirname, './src/features'),
      '~entities': path.resolve(__dirname, './src/entities'),
      '~ui': path.resolve(__dirname, './src/shared/ui'),
      '~shared': path.resolve(__dirname, './src/shared'),
      '~root': path.resolve(__dirname, './'),
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        secure: false,
        timeout: 0,
      },
    },
  },
})
