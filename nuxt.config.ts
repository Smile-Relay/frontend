// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    siliconflowApiKey: process.env.SILICONFLOW_API_KEY,
    dashscopeApiKey: process.env.DASHSCOPE_API_KEY
  },
  ui: {
    colorMode: false
  },
  routeRules: {
    '/dashscope/**': {
      proxy: 'https://dashscope.aliyuncs.com/**'
    }
  },
  vite: {
    plugins: [
        tailwindcss(),
    ],
  },
  css: ['./app/assets/css/main.css'],
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@oku-ui/motion/nuxt',
    '@nuxtjs/i18n'
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
    ],
    strategy: 'prefix',
  }
})