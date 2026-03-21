import antfu from '@antfu/eslint-config'

export default antfu(
	{
		type: 'app',

		jsonc: false,
		yaml: false,

		typescript: true,
		react: true,

		stylistic: {
			indent: 'tab',
		},

		rules: {
			'antfu/top-level-function': 'off',
			'antfu/consistent-list-newline': 'error',
			'no-console': 'warn',
			'ts/consistent-type-definitions': ['error', 'type'],
		},
	},
	// ...tailwindcss.configs['flat/recommended'],
	// {
	// 	rules: {
	// 		'tailwindcss/no-custom-classname': 'off',
	// 	},
	// 	settings: {
	// 		tailwindcss: {
	// 			callees: ['cn', 'cva'],
	// 			cssFiles: [
	// 				'**/*.css',
	// 				'!**/node_modules',
	// 				'!**/.*',
	// 				'!**/dist',
	// 				'!**/build',
	// 			],
	// 			cssFilesRefreshRate: 5_000,
	// 			removeDuplicates: true,
	// 			skipClassAttribute: false,
	// 			whitelist: [],
	// 		},
	// 	},
	// },
)
