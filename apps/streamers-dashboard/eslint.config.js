import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',

  stylistic: {
    indent: 4, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  jsonc: false,
  yaml: false,

  typescript: true,
  react: true,
})
