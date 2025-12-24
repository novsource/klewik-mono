import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
    // projects: [{
    //   extends: true,
    //   plugins: [
    //   // The plugin will run tests for the stories defined in your Storybook config
    //   // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    //     storybookTest({
    //       configDir: path.join(dirname, '.storybook'),
    //     }),
    //   ],
    //   test: {
    //     name: 'storybook',
    //     browser: {
    //       enabled: true,
    //       headless: true,
    //       provider: playwright({}),
    //       instances: [{
    //         browser: 'chromium',
    //       }],
    //     },
    //     setupFiles: ['.storybook/vitest.setup.ts'],
    //   },
    // }],
  },
})
