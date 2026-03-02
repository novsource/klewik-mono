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
    rollupOptions: {
      output: {
        manualChunks: {
          core: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          network: [
            'axios',
            'axios-rate-limit',
            'broadcast-channel',
          ],
          ui: [
            '@base-ui/react',
            '@number-flow/react',
            'vaul',
            'next-themes',
            'sonner',
            'canvas-confetti',
            'cmdk',
            'motion',
          ],
          icons: ['lucide-react'],
          utils: ['class-variance-authority', 'dompurify'],
        },
      },
      // manualChunks(id) {
      //     // React core
      //     if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
      //       return 'react-vendor'
      //     }

      //     // Router
      //     if (id.includes('react-router-dom')) {
      //       return 'router'
      //     }

      //     // Redux
      //     if (
      //       id.includes('@reduxjs/toolkit')
      //       || id.includes('react-redux')
      //     ) {
      //       return 'redux'
      //     }

      //     // Forms & validation
      //     if (
      //       id.includes('react-hook-form')
      //       || id.includes('@hookform/resolvers')
      //       || id.includes('zod')
      //     ) {
      //       return 'forms'
      //     }

      //     // TipTap (heavy editor)
      //     if (id.includes('@tiptap')) {
      //       return 'tiptap'
      //     }

      //     // UI / animations / icons
      //     if (
      //       id.includes('lucide-react')
      //       || id.includes('motion')
      //       || id.includes('vaul')
      //       || id.includes('cmdk')
      //       || id.includes('canvas-confetti')
      //       || id.includes('sonner')
      //       || id.includes('virtua')
      //       || id.includes('react-number-format')
      //     ) {
      //       return 'ui'
      //     }

      //     // Network / async
      //     if (
      //       id.includes('axios')
      //       || id.includes('@microsoft/fetch-event-source')
      //       || id.includes('broadcast-channel')
      //       || id.includes('async-mutex')
      //     ) {
      //       return 'network'
      //     }

      //     // Utils
      //     if (
      //       id.includes('uuid')
      //       || id.includes('js-sha256')
      //       || id.includes('dompurify')
      //       || id.includes('class-variance-authority')
      //     ) {
      //       return 'utils'
      //     }

      //     // Everything else from node_modules
      //     if (id.includes('node_modules')) {
      //       return 'vendor'
      //     }
      //   },
    },
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
        // configure: (proxy) => {
        //   // Hook in to fix limitation in Vite's proxy middleware with req.overrideOptions!
        //   overrideProxyFunctions(proxy)
        // },
        // bypass: (req) => {
        //   if (req.headers.accept === 'text/event-stream') {
        //     req.overrideOptions = {
        //       target: 'http://localhost:3000',
        //       headers: {
        //         Connection: 'Keep-Alive',
        //       },
        //       proxyTimeout: 3600000, // 1 hour - prevent the SSE connection from timing out for outgoing requests.
        //       timeout: 3600000, // 1 hour - prevent the SSE connection from timing out for incoming requests.
        //     }
        //     return true // Proxy to the target.
        //   }
        // },
      },
    },
  },
})

// /*
//  * Hook in to fix limitation in Vite's proxy middleware.
//  * Unfortunately Vite's proxy middleware always passes an empty options object to the proxy.web() function,
//  * which prevents us from dynamically setting the target on the options.
//  * So we override the http-proxy web() & ws() functions here (which Vite will call).
//  * Vite: https://github.com/vitejs/vite/blob/924b352c3484683051f744501b191fd4f6e63501/packages/vite/src/node/server/middlewares/proxy.ts#L221
//  */
// function overrideProxyFunctions(proxy: HttpProxy) {
//   const oldWebFn = proxy.web
//   const oldWsFn = proxy.ws

//   // Override https://github.com/http-party/node-http-proxy/blob/9b96cd725127a024dabebec6c7ea8c807272223d/lib/http-proxy/index.js#L96
//   proxy.web = proxy.proxyRequest = function (req: Request, res) {
//     const fixedOptions = { ...req.overrideOptions }
//     oldWebFn.call(proxy, req, res, fixedOptions)
//   }

//   // Override https://github.com/http-party/node-http-proxy/blob/9b96cd725127a024dabebec6c7ea8c807272223d/lib/http-proxy/index.js#L97
//   // Vite only passes head, and doesn't pass any options.
//   proxy.ws = proxy.proxyWebsocketRequest = function (req, res, head) {
//     const fixedOptions = { ...req.overrideOptions }
//     oldWsFn.call(proxy, req, res, head, fixedOptions)
//   }
// }
