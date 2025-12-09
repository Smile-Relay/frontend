// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
    fonts: {
        experimental: {
            processCSSVariables: true,
        },
    },
  devtools: { enabled: true },
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
    '@nuxt/fonts'
  ]
})