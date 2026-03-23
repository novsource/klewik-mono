import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "content",

  title: "Klewik Docs",
  description: "Документация к поинтовому аукциону Klewik",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Для стримеров',
        items: [
          { text: 'Предисловие', link: '/markdown-examples' },
          {
            text: 'Создание аукциона', link: ''
          },
          {
            text: 'Игры в аукционе', collapsed: false, items: [
              {
                text: "Виды", link: ''
              },
              { text: "Режимы", link: '' },
              { text: "Форматы" },
            ]
          },
          {
            text: 'О лотах в аукционе', link: ''
          },
          {
            text: 'Пожертвования от зрителей', link: ''
          },
          {
            text: 'Настройка аукциона', link: ''
          },
          {
            text: 'FAQ', link: ''
          }
        ]
      },
      {
        text: 'Для зрителей',
        items: [
          { text: 'Донат на лот', link: '/markdown-examples' },
          { text: "FAQ", link: '' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
