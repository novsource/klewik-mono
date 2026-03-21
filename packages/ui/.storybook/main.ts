import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: getAbsolutePath('@storybook/react-vite'),

  viteFinal: async (config) => {
    return {
      ...mergeConfig(config, {
        plugins: [react(), nxViteTsPaths()],
        optimizeDeps: {
          include: [
            'react',
            'react-dom',
          ]
        },
      }),
    }
  }
};

// const config: StorybookConfig = {
//   stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
//   addons: [],
//   framework: getAbsolutePath('@storybook/react-vite'),

//   // core: {
//   //   builder: getAbsolutePath('@storybook/builder-vite'),
//   // },

//   viteFinal: async (config) => {
//     return mergeConfig(config, {
//       plugins: [react()],
//       optimizeDeps: {
//         include: ['react', 'react-dom'],
//       },
//       envPrefix: 'STORYBOOK_',
//     })
//   },
// }

// const config: StorybookConfig = {
//   stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
//   addons: [
//   ],
//   framework: {
//     name: '@storybook/react-vite',
//     options: {},
//   },
//   docs: {
//     autodocs: 'tag',
//   },
// };

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
