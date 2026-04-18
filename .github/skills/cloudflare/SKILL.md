---
name: cloudflare
description: >
  Cloudflare CDN/DNS/Security/Performance expert for SimulatorExam.
  Configures cache rules, WAF firewall rules, DDoS protection, Web Analytics,
  Speed Observatory, and performance optimizations. Use when asked about
  "cloudflare", "CDN", "cache", "WAF", "firewall", "DDoS", "DNS", "performance",
  "observatory", "purge cache", or "web analytics".
argument-hint: "<task: configure cache rules | audit WAF | analyze traffic | optimize performance>"
allowed-tools: Read Write Grep Glob fetch WebSearch terminal
---

# Skill: Cloudflare Expert

## Cuándo se Activa
- "configura cloudflare" / "ajusta el CDN"
- "las reglas de caché" / "purgar caché"
- "WAF" / "firewall" / "bloquear bots"
- "DDoS" / "rate limiting"
- "observatory" / "perf de cloudflare"
- "analytics de cloudflare" / "web analytics"
- "DNS" / "propagación DNS"

---

## Flujo de Trabajo

```
FASE 1: DIAGNÓSTICO
  → Identificar área: DNS | Cache | Security | Performance | Analytics
  → Verificar zona y plan de Cloudflare (Free/Pro/Business)
  → Leer config actual (firebase.json para headers que pueden conflictuar)

FASE 2: ANÁLISIS
  → Revisar cache rules existentes
  → Verificar si hay conflictos CSP/CORS con Cloudflare Transform Rules
  → Chequear si Rocket Loader está activo (debe estar OFF para React)

FASE 3: IMPLEMENTACIÓN
  → Proponer cambios con impacto estimado
  → Confirmar antes de modificar reglas de seguridad
  → Documentar en memory/decisions/ si es cambio arquitectónico

FASE 4: VERIFICACIÓN
  → Correr Speed Observatory test
  → Verificar purga de caché post-deploy
  → Monitorear Web Analytics 24h post-cambio
```

---

## Configuración Óptima para React SPA + Firebase Hosting

### Cache Rules (en orden de prioridad)

```
Prioridad 1 — Bypass para Firebase Auth API
  Criterio: hostname contains "identitytoolkit.googleapis.com"
  Acción: Bypass cache

Prioridad 2 — Assets estáticos (Vite hashed)
  Criterio: URI path matches regex: \.(js|css|woff2?|ttf|eot|svg|png|jpg|ico|webp|avif)$
  Acción: Cache Everything, Edge TTL = 1 año, Browser TTL = 1 año

Prioridad 3 — HTML shell (SPA index)
  Criterio: URI path equals "/" OR ends with ".html"
  Acción: Cache, Edge TTL = 5 minutos, Browser TTL = no-store

Prioridad 4 — Manifest y Service Worker
  Criterio: URI path matches: /manifest.webmanifest|/sw.js
  Acción: Cache, Edge TTL = 1 hora, Browser TTL = 0
```

### Performance Settings

```yaml
Compression:
  Brotli: ON
  Gzip: ON (fallback)

Protocols:
  HTTP/3 (QUIC): ON
  0-RTT: ON

JavaScript:
  Rocket Loader: OFF  ← CRÍTICO para React
  Minification: OFF   ← Vite ya minifica

Images:
  Polish: Lossy (si se sirven imágenes desde el origen)
  
Early Hints: ON (preload CSS/JS más rápido)
```

### Security Settings

```yaml
SSL/TLS: Full (strict)  # Firebase tiene cert válido
Always HTTPS: ON
HSTS: max-age=31536000, includeSubDomains
Min TLS: 1.2

Bot Fight Mode: ON
Super Bot Fight Mode (Pro+): ON si disponible

WAF Rules recomendadas:
  - Block: cf.client.bot AND NOT cf.verified_bot_category in {"Search Engine Crawlers"}
  - Rate Limit "/api/*": 100 req/min por IP
  - Challenge: ip.src in $cf.botCategory in {"AI Scrapers And Crawlers"}
```

---

## Cache Purge en Deploy

Agregar a firebase deploy pipeline:

```bash
#!/bin/bash
# scripts/purge-cloudflare-cache.sh
curl -s -X DELETE \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}' \
  | jq '.success'
```

Variables de entorno requeridas (en `.env.local`, NUNCA commitear):
```
CF_ZONE_ID=<zone_id>
CF_API_TOKEN=<api_token_with_cache_purge_permission>
```

---

## Web Analytics SPA Integration

```html
<!-- index.html — antes de </head> -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "TU_TOKEN_AQUÍ"}'></script>
```

Para SPA con React Router (registrar navegaciones):
```js
// src/core/router/AppRouter.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function CloudflarePageView() {
  const location = useLocation()
  useEffect(() => {
    window.__cfBeacon?.trackPageview?.()
  }, [location.pathname])
  return null
}
```

---

## Speed Observatory: Guía de Uso

1. Dashboard → Speed → Observatory
2. "Run test" → URL: `https://simulatorexam.web.app/`
3. Comparar: Mobile (Moto G4) vs Desktop (Broadband)
4. Métricas clave para esta SPA:
   - LCP < 2.5s (Largest Contentful Paint)
   - FID < 100ms (First Input Delay)
   - CLS < 0.1 (Cumulative Layout Shift)
   - TTFB < 800ms (Time To First Byte — impacta el CDN hit ratio)

---

## Diagnóstico de Problemas Comunes

```
Síntoma: Error 521 → Firebase Hosting está caído / deploy fallido
Síntoma: CORS en Firestore → Cloudflare no debe interceptar *.firebaseio.com
Síntoma: React app en blanco → Rocket Loader activo o index.html cacheado con TTL alto
Síntoma: Login Firebase falla → Verificar WAF no bloquea identitytoolkit.googleapis.com
Síntoma: Assets no actualizados → Purgar caché tras deploy
Síntoma: HSTS error en local → Deshabilitar HSTS en zona de pruebas
```

---

## Documentación Oficial

- Fundamentals: https://developers.cloudflare.com/fundamentals/
- Cache Rules: https://developers.cloudflare.com/cache/how-to/cache-rules/
- WAF: https://developers.cloudflare.com/waf/
- Web Analytics: https://developers.cloudflare.com/web-analytics/
- Speed Observatory: https://developers.cloudflare.com/speed/observatory/
- Analytics GraphQL API: https://developers.cloudflare.com/analytics/graphql-api/
- Workers: https://developers.cloudflare.com/workers/
