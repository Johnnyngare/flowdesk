// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      supabase: {
        redirectOptions: {
          login: '/login',
          callback: '/confirm',
          exclude: ['/', '/login', '/signup'],
        }
      }
    }
  },
})


