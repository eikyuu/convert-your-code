// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public : {
      apiKey: process.env.NUXT_APP_OPENAI_API_KEY || 'your-openai-api-key'
    }
  },
  devtools: { enabled: true }
})
