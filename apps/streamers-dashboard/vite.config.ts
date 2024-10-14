import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vite-plugin-svgr/client" />
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
