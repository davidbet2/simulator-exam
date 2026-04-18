---
name: google-analytics
description: >
  Google Analytics 4 specialist for SimulatorExam. Configures events, conversions,
  custom dimensions, Consent Mode v2, SPA route tracking, and BigQuery export.
  Use when asked about "GA4", "analytics", "eventos", "conversiones", "tracking",
  "consent mode", "funnels", "retención", "BigQuery", or "medir".
argument-hint: "<task: setup tracking | audit events | configure conversions | build funnel>"
allowed-tools: Read Write Grep Glob fetch WebSearch
---

# Skill: Google Analytics 4 Expert

## Cuándo se Activa
- "configura GA4" / "setup analytics"
- "trackear evento X" / "medir cuando el usuario hace X"
- "conversiones en GA4" / "marcar conversion"
- "consent mode" / "GDPR analytics"
- "funnel de conversión" / "analiza retención"
- "BigQuery export" / "datos de analytics"
- "reportes GA4" / "qué eventos tracking"

---

## Contexto: Eventos Prioritarios del Proyecto

```
SimulatorExam → Funnel principal:
  Visit → Sign Up → Exam Start → Exam Complete → (Upgrade to Pro)

Eventos clave:
  1. sign_up      → Registro nuevo usuario
  2. login        → Acceso recurrente
  3. exam_start   → Inicio de examen (engagement principal)
  4. exam_complete → Completó examen (evento núcleo)
  5. select_promotion → Click en upgrade a Pro (señal de revenue)
  6. purchase     → Compra efectiva del plan Pro
```

---

## Flujo de Trabajo

```
FASE 1: DIAGNÓSTICO
  → Leer src/core/analytics/ o buscar llamadas a gtag() en el codebase
  → Identificar qué eventos YA están implementados
  → Identificar gaps vs. eventos prioritarios del negocio

FASE 2: DISEÑO DEL PLAN DE MEDICIÓN
  → Listar eventos a implementar con sus parámetros
  → Confirmar con usuario antes de tocar código

FASE 3: IMPLEMENTACIÓN
  → Seguir el patrón src/core/analytics/events.js
  → Llamar analytics.xxxx() desde páginas/hooks (no desde componentes genéricos)
  → Nunca loggear PII (email, nombre, uid) como parámetro de evento

FASE 4: VERIFICACIÓN
  → Usar GA4 DebugView (extensión Google Analytics Debugger)
  → Confirmar eventos en tiempo real: Admin → DebugView
  → Verificar que los eventos aparecen en Informes → Eventos

FASE 5: CONFIGURACIÓN EN ADMIN
  → Marcar conversiones
  → Crear dimensiones personalizadas
  → Configurar audiencias si aplica
```

---

## Implementación en React 19 SPA

### Carga del script (index.html)
```html
<!-- Antes de </head> — Consent Mode primero, luego gtag -->
<script>
  // Consent Mode v2 — default DENIED (LGPD/GDPR compliant)
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
</script>
```

### Hook de page tracking (React Router)
```js
// src/core/analytics/usePageTracking.js
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTracking() {
  const location = useLocation()
  useEffect(() => {
    window.gtag?.('event', 'page_view', {
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [location.pathname])
}
// Usar en AppRouter: <Route element={<><PageTracker/><Outlet/></>}>
```

### Módulo de eventos del negocio
```js
// src/core/analytics/events.js
const g = (...args) => window.gtag?.(...args)

export const analytics = {
  // Auth
  login:  ()    => g('event', 'login', { method: 'google' }),
  signUp: ()    => g('event', 'sign_up', { method: 'google' }),

  // Core product
  examStart: ({ certId, certTitle, mode }) =>
    g('event', 'exam_start', { cert_id: certId, cert_title: certTitle, exam_mode: mode }),

  examComplete: ({ certId, scorePct, passed, durationSec }) =>
    g('event', 'exam_complete', {
      cert_id: certId, score_pct: scorePct,
      passed, duration_sec: durationSec,
    }),

  // Revenue
  upgradeCTAClick: (location) =>
    g('event', 'select_promotion', { item_id: 'pro_plan', promotion_name: 'Pro Upgrade', location }),

  purchase: ({ transactionId, value }) =>
    g('event', 'purchase', {
      transaction_id: transactionId,
      value, currency: 'COP',
      items: [{ item_id: 'pro_plan', item_name: 'Pro Plan', price: value }],
    }),
}
```

### User properties (post-login)
```js
// En useAuthStore.js, después de resolver el plan del usuario:
window.gtag?.('set', 'user_properties', {
  user_plan: isPro ? 'pro' : 'free',
})
```

---

## Configuración en GA4 Admin

### Conversiones a marcar
| Evento | Label |
|--------|-------|
| `exam_complete` (passed=true) | Examen aprobado |
| `purchase` | Upgrade a Pro |
| `sign_up` | Registro nuevo |

### Dimensiones Personalizadas (Admin → Custom definitions)
| Nombre | Alcance | Parámetro |
|--------|---------|-----------|
| Plan de usuario | Usuario | `user_plan` |
| Modo de examen | Evento | `exam_mode` |
| Certificación | Evento | `cert_id` |
| % puntuación | Evento | `score_pct` |

### Audiencias recomendadas
- **Free users activos**: plan=free + exam_start en últimos 30d
- **High-intent free**: exam_complete(passed=false) + no purchase en 7d → mostrar upgrade
- **Pro users**: user_plan=pro (para excluir de promos)

---

## Consent Mode v2: Actualizar tras aceptación

```js
// Cuando usuario acepta cookies (banner de consent):
function onConsentAccepted() {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
}
```

---

## Checklist de Auditoría

- [ ] Measurement ID en variable de entorno `VITE_GA_MEASUREMENT_ID`
- [ ] Consent Mode v2 configurado ANTES de cargar gtag
- [ ] `usePageTracking` activo en el router
- [ ] `analytics.examStart()` en useExam.js al iniciar examen
- [ ] `analytics.examComplete()` en ResultsPage al renderizar resultado
- [ ] `analytics.login()` en useAuthStore después de loginWithGoogle
- [ ] `analytics.upgradeCTAClick()` en PricingPage/UpgradeButton
- [ ] User properties seteadas post-auth
- [ ] Conversiones marcadas en Admin
- [ ] Tráfico interno filtrado (IP del developer)
- [ ] DebugView verificado con un flujo de examen completo

---

## Documentación Oficial
- Setup: https://developers.google.com/analytics/devguides/collection/ga4
- Eventos recomendados: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- Data API: https://developers.google.com/analytics/devguides/reporting/data/v1
- DebugView: https://support.google.com/analytics/answer/7201382
