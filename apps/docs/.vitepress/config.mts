import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "content",

  title: "Klewik Docs",
  description: "Документация к поинтовому аукциону Klewik",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Стримерам', link: '/streamers/index.md' },
      { text: 'Зрителям', link: '/watchers/index.md' }
    ],

    sidebar: [
      { text: 'Перед тем как начать', link: '/before-start.md' },
      {
        text: 'Для стримеров',
        items: [
          {
            text: 'Получение доступа', link: '/streamers/index.md'
          },
          {
            text: 'Создание аукциона', link: '/streamers/create-auction.md'
          },
          {
            text: 'Игры в аукционе', collapsed: true, items: [
              {
                text: "Виды", link: '/streamers/game/game-types.md'
              },
              { text: "Режимы", link: '/streamers/game/game-mods.md' },
              { text: "Форматы", link: '/streamers/game/game-formats.md' },
            ]
          },
          {
            text: 'О лотах в аукционе', link: '/streamers/about-lots.md'
          },
          {
            text: 'Пожертвования от зрителей', link: '/streamers/viewers-donations.md'
          },
          {
            text: 'Настройка аукциона', link: '/streamers/auction-settings.md'
          },
          {
            text: 'FAQ', link: '/streamers/faq.md'
          }
        ]
      },
      {
        text: 'Для зрителей',
        items: [
          { text: 'Донат на лот', link: '/watchers/index.md' },
          { text: "FAQ", link: '/watchers/donation.md' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
