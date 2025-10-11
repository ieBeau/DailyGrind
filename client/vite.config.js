import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig(({ command }) => {

  let environment = 'development';

  if (command === 'serve') environment = 'development';
  else environment = 'production';

  return {
    plugins: [react()],
    preview: {
      allowedHosts: [
        'https://dailygrind-coffee.onrender.com'
      ]
    },
    server: {
      proxy: {
        '/api': environment === "development"
          ? `http://localhost:3000`
          : 'https://dailygrind-server.onrender.com'
      }
    }
  }
})
