import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Build version — logged on startup so we can verify which bundle is running.
const BUILD_VERSION = '2026-04-18-auth-fix-7-custom-domain-v2'
console.info('[CertZen] build:', BUILD_VERSION)

// Global diagnostic: capture any unhandled error/promise rejection that mentions
// 'auth/' so we can finally identify the source of auth/argument-error.
window.addEventListener('error', (ev) => {
  if (String(ev.message || '').includes('auth/') || String(ev.error?.code || '').startsWith('auth/')) {
    console.error('[CertZen DIAG] window error:', ev.error?.code, ev.error?.message, ev.error?.stack)
  }
})
window.addEventListener('unhandledrejection', (ev) => {
  const r = ev.reason
  if (String(r?.code || '').startsWith('auth/') || String(r?.message || '').includes('auth/')) {
    console.error('[CertZen DIAG] unhandled rejection:', r?.code, r?.message, r?.stack)
  }
})

// One-time service-worker reset: users stuck on a cached bundle that throws
// auth/argument-error need a clean SW state. Bump SW_RESET_KEY to trigger again.
const SW_RESET_KEY = 'certzen-sw-reset-2026-04-18-v2-domain'
if (!localStorage.getItem(SW_RESET_KEY) && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    if (regs.length === 0) {
      localStorage.setItem(SW_RESET_KEY, '1')
      return
    }
    Promise.all(regs.map((r) => r.unregister()))
      .then(() => caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))))
      .then(() => {
        localStorage.setItem(SW_RESET_KEY, '1')
        window.location.reload()
      })
  })
}

// Recover from stale service-worker chunk errors after a new deploy.
// When a dynamic import fails (old hash no longer on server), reload once.
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
