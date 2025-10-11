import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'comp214-dailygrind.onrender.com'
    ]
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // proxy to server PORT
    },
  }
})
