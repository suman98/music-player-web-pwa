import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@music-library/core': '@music-library/core/dist/index.js',
    },
  },
  ssr: {
    noExternal: ['@music-library/core'],
  },
})
