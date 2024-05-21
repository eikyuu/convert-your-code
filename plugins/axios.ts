import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: 'https://api.openai.com/v1', // Remplacez par l'URL de base de votre API
    headers: {
      common: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${nuxtApp.$config.public.apiKey}`
      }
    }
  })

  nuxtApp.provide('api', api)
})