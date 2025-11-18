import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import path from 'node:path'

export default defineConfig({
  plugins: [react()],
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
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/e2e/**'],
    setupFiles: ['./tests/vitest-setup.ts'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})
