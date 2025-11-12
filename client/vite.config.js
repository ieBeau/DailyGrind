import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig(({ command }) => {

  const environment = command === 'serve' ? 'development' : 'production';
  
  return {
    plugins: [react()],
    preview: {
      allowedHosts: [
        'https://dailygrind-coffee.onrender.com'
      ]
    },
    server: {
      proxy: {
        '/api': {
          target: environment === "development"
          ? `http://localhost:3000`
          : 'https://dailygrind-server.onrender.com',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
