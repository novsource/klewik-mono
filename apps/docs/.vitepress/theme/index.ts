// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { loadEnv, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.config.globalProperties.$serverUrl = import.meta.env.VITE_SERVER_URL
    app.config.globalProperties.$login = import.meta.env.VITE_LOGIN
    app.config.globalProperties.$password = import.meta.env.PASSWORD

    app.provide('$serverUrl', import.meta.env.VITE_SERVER_URL)
  }
} satisfies Theme
