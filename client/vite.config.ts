import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path' // Ajout du préfixe "node:"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // On utilise import.meta.dirname à la place de __dirname
      'react': path.resolve(import.meta.dirname, './node_modules/react'),
      'react-dom': path.resolve(import.meta.dirname, './node_modules/react-dom'),
    },
  },
})