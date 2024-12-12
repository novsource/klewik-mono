import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@ui': path.resolve(__dirname, './src/shared/components/ui'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@icons': path.resolve(__dirname, './src/shared/icons'),
      '@routing': path.resolve(__dirname, './src/shared/router'),
      '@layouts': path.resolve(__dirname, './src/shared/router/layouts'),
      '@utils': path.resolve(__dirname, './src/lib/utils'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/shared/store'),
      '@root': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
