// vite.config.js
import { defineConfig } from "file:///C:/Users/david.betancur_pragm/Desktop/SimulatorExam/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/david.betancur_pragm/Desktop/SimulatorExam/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/david.betancur_pragm/Desktop/SimulatorExam/node_modules/vite-plugin-pwa/dist/index.js";
import { lingui } from "file:///C:/Users/david.betancur_pragm/Desktop/SimulatorExam/node_modules/@lingui/vite-plugin/dist/index.cjs";
var vite_config_default = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@lingui/babel-plugin-lingui-macro"]
      }
    }),
    lingui(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "icons/*.png"],
      manifest: {
        name: "CertZen \u2014 Domina tu Certificaci\xF3n",
        short_name: "CertZen",
        description: "Simulador inteligente de ex\xE1menes de certificaci\xF3n. Practica, aprende y aprueba con confianza.",
        theme_color: "#6366f1",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // PNGs excluidos del precache — dolphin assets son grandes y cambian frecuentemente
        globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
        globIgnores: ["**/dolphin_full_system/**"],
        // Never let the SW intercept Firebase Auth popup/redirect handler routes.
        // Without this, /__/auth/handler gets served from the SW cache (index.html)
        // instead of the Firebase Hosting auth endpoint, breaking Google sign-in popups.
        navigateFallbackDenylist: [/^\/__\//],
        runtimeCaching: [
          {
            // NetworkFirst: siempre intenta red primero → garantiza assets frescos en cada deploy
            urlPattern: /\/dolphin_full_system\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "dolphin-assets-v1",
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          framer: ["framer-motion"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkYXZpZC5iZXRhbmN1cl9wcmFnbVxcXFxEZXNrdG9wXFxcXFNpbXVsYXRvckV4YW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGRhdmlkLmJldGFuY3VyX3ByYWdtXFxcXERlc2t0b3BcXFxcU2ltdWxhdG9yRXhhbVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZGF2aWQuYmV0YW5jdXJfcHJhZ20vRGVza3RvcC9TaW11bGF0b3JFeGFtL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5pbXBvcnQgeyBsaW5ndWkgfSBmcm9tICdAbGluZ3VpL3ZpdGUtcGx1Z2luJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGx1Z2luczogWydAbGluZ3VpL2JhYmVsLXBsdWdpbi1saW5ndWktbWFjcm8nXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgbGluZ3VpKCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5zdmcnLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnLCAnaWNvbnMvKi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdDZXJ0WmVuIFx1MjAxNCBEb21pbmEgdHUgQ2VydGlmaWNhY2lcdTAwRjNuJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ0NlcnRaZW4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NpbXVsYWRvciBpbnRlbGlnZW50ZSBkZSBleFx1MDBFMW1lbmVzIGRlIGNlcnRpZmljYWNpXHUwMEYzbi4gUHJhY3RpY2EsIGFwcmVuZGUgeSBhcHJ1ZWJhIGNvbiBjb25maWFuemEuJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjNjM2NmYxJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMwZjE3MmEnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7IHNyYzogJy9pY29ucy9pY29uLTE5Mi5wbmcnLCBzaXplczogJzE5MngxOTInLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tNTEyLnBuZycsIHNpemVzOiAnNTEyeDUxMicsIHR5cGU6ICdpbWFnZS9wbmcnIH0sXG4gICAgICAgICAgeyBzcmM6ICcvaWNvbnMvaWNvbi01MTIucG5nJywgc2l6ZXM6ICc1MTJ4NTEyJywgdHlwZTogJ2ltYWdlL3BuZycsIHB1cnBvc2U6ICdtYXNrYWJsZScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIHNraXBXYWl0aW5nOiB0cnVlLFxuICAgICAgICBjbGllbnRzQ2xhaW06IHRydWUsXG4gICAgICAgIC8vIFBOR3MgZXhjbHVpZG9zIGRlbCBwcmVjYWNoZSBcdTIwMTQgZG9scGhpbiBhc3NldHMgc29uIGdyYW5kZXMgeSBjYW1iaWFuIGZyZWN1ZW50ZW1lbnRlXG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28sc3ZnLHdvZmYyfSddLFxuICAgICAgICBnbG9iSWdub3JlczogWycqKi9kb2xwaGluX2Z1bGxfc3lzdGVtLyoqJ10sXG4gICAgICAgIC8vIE5ldmVyIGxldCB0aGUgU1cgaW50ZXJjZXB0IEZpcmViYXNlIEF1dGggcG9wdXAvcmVkaXJlY3QgaGFuZGxlciByb3V0ZXMuXG4gICAgICAgIC8vIFdpdGhvdXQgdGhpcywgL19fL2F1dGgvaGFuZGxlciBnZXRzIHNlcnZlZCBmcm9tIHRoZSBTVyBjYWNoZSAoaW5kZXguaHRtbClcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgRmlyZWJhc2UgSG9zdGluZyBhdXRoIGVuZHBvaW50LCBicmVha2luZyBHb29nbGUgc2lnbi1pbiBwb3B1cHMuXG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2tEZW55bGlzdDogWy9eXFwvX19cXC8vXSxcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBOZXR3b3JrRmlyc3Q6IHNpZW1wcmUgaW50ZW50YSByZWQgcHJpbWVybyBcdTIxOTIgZ2FyYW50aXphIGFzc2V0cyBmcmVzY29zIGVuIGNhZGEgZGVwbG95XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXFwvZG9scGhpbl9mdWxsX3N5c3RlbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnTmV0d29ya0ZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZG9scGhpbi1hc3NldHMtdjEnLFxuICAgICAgICAgICAgICBuZXR3b3JrVGltZW91dFNlY29uZHM6IDgsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogMzAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7IGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1jYWNoZScsIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogMTAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIGZpcmViYXNlOiAgICAgIFsnZmlyZWJhc2UvYXBwJywgJ2ZpcmViYXNlL2F1dGgnLCAnZmlyZWJhc2UvZmlyZXN0b3JlJ10sXG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICBmcmFtZXI6ICAgICAgICBbJ2ZyYW1lci1tb3Rpb24nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFWLFNBQVMsb0JBQW9CO0FBQ2xYLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxjQUFjO0FBRXZCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyxtQ0FBbUM7QUFBQSxNQUMvQztBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsd0JBQXdCLGFBQWE7QUFBQSxNQUNwRSxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsVUFDTCxFQUFFLEtBQUssdUJBQXVCLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUNsRSxFQUFFLEtBQUssdUJBQXVCLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUNsRSxFQUFFLEtBQUssdUJBQXVCLE9BQU8sV0FBVyxNQUFNLGFBQWEsU0FBUyxXQUFXO0FBQUEsUUFDekY7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxhQUFhO0FBQUEsUUFDYixjQUFjO0FBQUE7QUFBQSxRQUVkLGNBQWMsQ0FBQyxrQ0FBa0M7QUFBQSxRQUNqRCxhQUFhLENBQUMsMkJBQTJCO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJekMsMEJBQTBCLENBQUMsU0FBUztBQUFBLFFBQ3BDLGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQTtBQUFBLFlBRUUsWUFBWTtBQUFBLFlBQ1osU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsdUJBQXVCO0FBQUEsY0FDdkIsWUFBWSxFQUFFLFlBQVksSUFBSSxlQUFlLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFBQSxZQUNoRTtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTLEVBQUUsV0FBVyxzQkFBc0IsWUFBWSxFQUFFLFlBQVksSUFBSSxlQUFlLEtBQUssS0FBSyxLQUFLLElBQUksRUFBRTtBQUFBLFVBQ2hIO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixVQUFlLENBQUMsZ0JBQWdCLGlCQUFpQixvQkFBb0I7QUFBQSxVQUNyRSxnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDekQsUUFBZSxDQUFDLGVBQWU7QUFBQSxRQUNqQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
