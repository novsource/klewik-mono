import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',

  jsonc: false,
  yaml: false,

  typescript: true,
  react: true,

  ignores: ['**/*.config.ts', '**/*.config.js'],
  rules: {
    'antfu/top-level-function': 'off',
    'no-console': 'warn',
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

          'app',
          'pages',
          'widgets',
          'features',
          'entities',
          'shared',

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
        ],
      },
    ],
  },
  ignore: ['**/*.d.ts, **/*.mts'],
})
