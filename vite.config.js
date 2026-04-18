import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'CertZen — Domina tu Certificación',
        short_name: 'CertZen',
        description: 'Simulador inteligente de exámenes de certificación. Practica, aprende y aprueba con confianza.',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // PNGs excluidos del precache — dolphin assets son grandes y cambian frecuentemente
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        globIgnores: ['**/dolphin_full_system/**'],
        // Never let the SW intercept Firebase Auth popup/redirect handler routes.
        // Without this, /__/auth/handler gets served from the SW cache (index.html)
        // instead of the Firebase Hosting auth endpoint, breaking Google sign-in popups.
        navigateFallbackDenylist: [/^\/__\//],
        runtimeCaching: [
          {
            // NetworkFirst: siempre intenta red primero → garantiza assets frescos en cada deploy
            urlPattern: /\/dolphin_full_system\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dolphin-assets-v1',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase:      ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          framer:        ['framer-motion'],
        },
      },
    },
  },
})
