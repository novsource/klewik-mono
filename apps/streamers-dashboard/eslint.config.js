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
  'features:auction',
  'features:auction-slot',
  'features:donations',
  'features:integrations',
  'features:wheel',
  'entities:auction',
  'entities:auction-slot',
  'entities:donation',
  'entities:integrations',
  'entities:wheel',
  'shared:api',
  'shared:constants',
  'shared:hooks',
  'shared:lib',
  'shared:router',
  'shared:store',
  'shared:ui',
  'shared:utils',
]

const perfectionistFSDImportsFeaturesSlice = [
  {
    groupName: 'features:auction',
    elementNamePattern: ['^~features/auction/'],
  },
  {
    groupName: 'features:auction-slot',
    elementNamePattern: ['^~features/auction-slot/'],
  },
  {
    groupName: 'features:donations',
    elementNamePattern: ['^~features/donations'],
  },
  {
    groupName: 'features:integrations',
    elementNamePattern: ['^~features/integrations'],
  },
  {
    groupName: 'features:wheel',
    elementNamePattern: ['^~features/wheel'],
  },
]

const perfectionistFSDImportsEntitiesSlice = [
  {
    groupName: 'entities:auction',
    elementNamePattern: ['^~entities/auction/'],
  },
  {
    groupName: 'entities:auction-slot',
    elementNamePattern: ['^~entities/auction-slot/'],
  },
  {
    groupName: 'entities:donation',
    elementNamePattern: ['^~entities/donation/'],
  },
  {
    groupName: 'entities:integrations',
    elementNamePattern: ['^~entities/integrations'],
  },
  {
    groupName: 'entities:wheel',
    elementNamePattern: ['^~entities/wheel'],
  },
]

const perfectionistFSDImportsSharedSlice = [
  {
    groupName: 'shared:api',
    elementNamePattern: ['^~shared/api'],
  },
  {
    groupName: 'shared:constants',
    elementNamePattern: ['^~shared/constants'],
  },
  {
    groupName: 'shared:hooks',
    elementNamePattern: ['^~shared/hooks'],
  },
  {
    groupName: 'shared:lib',
    elementNamePattern: ['^~shared/lib'],
  },
  {
    groupName: 'shared:router',
    elementNamePattern: ['^~shared/router'],
  },
  {
    groupName: 'shared:store',
    elementNamePattern: ['^~shared/store'],
  },
  {
    groupName: 'shared:ui',
    elementNamePattern: ['^~shared/ui'],
  },
  {
    groupName: 'shared:utils',
    elementNamePattern: ['^~shared/utils'],
  },
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
  ...perfectionistFSDImportsFeaturesSlice,
  ...perfectionistFSDImportsEntitiesSlice,
  ...perfectionistFSDImportsSharedSlice,
]

export default antfu({
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
