import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:         resolve(__dirname, 'index.html'),
        booking:      resolve(__dirname, 'booking.html'),
        packages:     resolve(__dirname, 'packages.html'),
        destinations: resolve(__dirname, 'destinations.html'),
        admin:        resolve(__dirname, 'admin.html'),
        login:        resolve(__dirname, 'login.html'),
        register:     resolve(__dirname, 'register.html'),
        about:        resolve(__dirname, 'about.html'),
      }
    }
  }
})
