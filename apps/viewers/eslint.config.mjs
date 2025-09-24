import antfu from '@antfu/eslint-config'

import tailwindcss from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    type: 'app',

    jsonc: false,
    yaml: false,

    typescript: true,
    react: true,

    rules: {
      'antfu/top-level-function': 'off',
      'antfu/consistent-list-newline': 'error',
      'no-console': 'warn',
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
  ...tailwindcss.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
    },
    settings: {
      tailwindcss: {
        // These are the default values but feel free to customize
        callees: ['classnames', 'clsx', 'cn'],
        cssFiles: ['**/*.css', '!**/node_modules'],
        groupByResponsive: false,
        prependCustom: false,
        removeDuplicates: true,
        whitelist: [],
      },
    },
  },
)
