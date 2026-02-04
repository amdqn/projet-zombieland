import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Séparer MUI (gros package)
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Séparer Framer Motion (animations)
          'vendor-motion': ['framer-motion'],
          // Séparer Leaflet (cartes)
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          // Séparer i18n
          'vendor-i18n': ['i18next', 'react-i18next'],
        },
      },
    },
    // Augmenter la limite d'avertissement pour les chunks
    chunkSizeWarningLimit: 600,
  },
})
