import antfu from '@antfu/eslint-config'

/**
 * For now is not supporting tailwindCSS v4
 * https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325
 */
// import tailwind from 'eslint-plugin-tailwindcss'

const perfectionistFSDImportsGroups = [
  'app',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
]

const perfectionistFSDImportsCustomGroups = [
  {
    groupName: 'app',
    elementNamePattern: ['^~app'],
  },
  {
    groupName: 'pages',
    elementNamePattern: ['^~pages'],
  },
  {
    groupName: 'widgets',
    elementNamePattern: ['^~widgets'],
  },
  {
    groupName: 'features',
    elementNamePattern: ['^~features'],
  },
  {
    groupName: 'entities',
    elementNamePattern: ['^~entities'],
  },
  {
    groupName: 'shared',
    elementNamePattern: ['^~shared'],
  },
]

export default antfu({
  type: 'app',

  jsonc: false,
  yaml: false,

  typescript: true,
  react: true,

  rules: {
    'antfu/top-level-function': 'off',
    'no-console': 'warn',
    'ts/consistent-type-definitions': ['error', 'type'],
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        fallbackSort: { type: 'unsorted' },
        ignoreCase: true,
        specialCharacters: 'keep',
        internalPattern: ['^~/.+', '^@/.+'],
        groups: [
          'type',
          [
            'parent-type',
            'sibling-type',
            'index-type',
            'internal-type',
          ],

          'react',
          'react-hook-form',
          'others-react-start-libs',

          'external',

          ...perfectionistFSDImportsGroups,

          'builtin',
          'internal',
          ['parent', 'sibling', 'index'],
          'side-effect',
          'object',
          'unknown',
        ],
        customGroups: [
          {
            groupName: 'react',
            elementNamePattern: ['^react$', '^react-dom$'],

          },
          {
            groupName: 'others-react-start-libs',
            elementNamePattern: ['^react-.+'],
          },
          {
            groupName: 'react-hook-form',
            elementNamePattern: ['^react-hook-form$'],
          },
          ...perfectionistFSDImportsCustomGroups,
        ],
      },
    ],
  },
  ignore: ['**/*.d.ts, **/*.mts', '**/*.config.ts'],
})
