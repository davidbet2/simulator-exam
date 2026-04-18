import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-reload when the Service Worker updates after a new deploy.
// Flow: new SW installs → skipWaiting fires (autoUpdate) → controllerchange event
// → page reloads with fresh bundle. Zero user action required.
// Guard: only reload once per SW change to avoid infinite loops.
if ('serviceWorker' in navigator) {
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })
}

// Recover from stale SW chunk errors after a new deploy.
// When a dynamic import fails (old hash no longer on server), reload once.
// Guard: sessionStorage flag prevents an infinite reload loop if the error persists.
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('preloadErrorReloaded')) return
  sessionStorage.setItem('preloadErrorReloaded', '1')
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
