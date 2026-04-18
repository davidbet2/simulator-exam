---
name: google-adsense
description: >
  Google AdSense specialist for SimulatorExam. Manages ad placements, unit creation,
  CSP configuration, policy compliance, RPM optimization, and AdSense+GA4 integration.
  Use when asked about "AdSense", "ads", "publicidad", "CSP ads", "RPM", "ad units",
  "ingresos publicitarios", "AdBanner", "adsbygoogle", or "política de AdSense".
argument-hint: "<task: optimize placements | fix CSP | review policy | configure auto ads | analyze revenue>"
allowed-tools: Read Write Grep Glob fetch WebSearch
---

# Skill: Google AdSense Expert

## Cuándo se Activa
- "AdSense" / "adsbygoogle" / "AdBanner"
- "errores CSP de ads" / "doubleclick" / "googlesyndication"
- "ads no se muestran" / "unidades de anuncio"
- "RPM" / "ingresos de publicidad"
- "política de AdSense" / "serving limit"
- "optimizar ads" / "placement strategy"

---

## Estado Actual del Proyecto

```
Componente: src/features/ads/components/AdBanner.jsx
Variables: VITE_ADSENSE_PUBLISHER_ID, VITE_ADSENSE_SLOT
Script: pagead2.googlesyndication.com en index.html
CSP: ya configurado en firebase.json (adtrafficquality.google, doubleclick.net)
Placements activos: DashboardPage, ExploreExamsPage (verificar más)
```

---

## Flujo de Trabajo

```
FASE 1: DIAGNÓSTICO
  → Leer src/features/ads/components/AdBanner.jsx
  → Buscar AdBanner en todo el codebase (grep)
  → Verificar VITE_ADSENSE_* en .env
  → Verificar CSP en firebase.json

FASE 2: ANÁLISIS
  → Identificar páginas sin ads donde tendría sentido añadirlos
  → Verificar política: no más de 3 por página, no durante examen
  → Revisar si hay errores de CLS por ads sin contenedor fijo

FASE 3: IMPLEMENTACIÓN
  → Añadir/mover placements con justificación de RPM
  → Corregir CSP si hay violaciones
  → Añadir contenedor con minHeight para evitar CLS

FASE 4: VERIFICACIÓN
  → AdSense Console → Ad Preview Tool
  → Verificar en PageSpeed Insights que CLS no empeoró
  → Monitorear RPM 7 días
```

---

## Placements Óptimos para SimulatorExam

```
✅ ALTA PRIORIDAD (añadir si no están):
  /results    → Después del score (usuario enganched post-examen)
  /explore    → Entre cards de exam sets (in-feed format)
  /dashboard  → Entre stats y historial

❌ NO COLOCAR:
  /exam       → Activo durante examen (distrae + política)
  Top of page → Above-the-fold (CLS + política)
  /admin      → Panel administrativo

⚠️ OPCIONAL:
  /explore/:slug → Landing del exam set, below the fold
  /pricing       → Con cuidado, puede distraer del CTA de upgrade
```

---

## AdBanner Component Correcto

```jsx
import { useEffect, useRef } from 'react'

export function AdBanner({ adSlot, adFormat = 'auto', adLayout, placementId }) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current || !adSlot) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch { /* silently ignore duplicate push */ }
  }, [adSlot])

  if (!adSlot || !import.meta.env.VITE_ADSENSE_PUBLISHER_ID) return null

  return (
    // Contenedor con minHeight previene CLS
    <div style={{ minHeight: '90px', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      />
    </div>
  )
}
```

---

## Tipos de Unidades Recomendadas

| Tipo | data-ad-format | Dónde Usar |
|------|---------------|-----------|
| Display responsive | `auto` | DashboardPage, ResultsPage |
| In-feed | `fluid` + `data-ad-layout="in-article"` | ExploreExamsPage entre cards |
| Multiplex | `autorelaxed` | ExamSetLandingPage — sección "más sets" |

---

## CSP Headers Completos para AdSense

En `firebase.json`, el header CSP debe incluir:
```
script-src: 
  https://pagead2.googlesyndication.com
  https://*.adtrafficquality.google

connect-src:
  https://pagead2.googlesyndication.com
  https://*.adtrafficquality.google
  https://googleads.g.doubleclick.net

frame-src:
  https://googleads.g.doubleclick.net
  https://tpc.googlesyndication.com
  https://*.adtrafficquality.google

img-src:
  https://*.adtrafficquality.google
  https://googleads.g.doubleclick.net
  https://pagead2.googlesyndication.com
```

---

## Optimización de RPM

```
1. Keywords relevantes en data-ad-client (ayuda al targeting):
   - Usar data-ad-keywords o el prop keywords del AdBanner

2. Categoría del sitio (en AdSense console):
   Admin → Brand safety → Content categories
   Seleccionar: Education, Technology, Professional services

3. Bloquear categorías de bajo valor:
   AdSense → Blocking controls
   Bloquear: Gambling, Politics, Low-value categories

4. Activar Auto Ads como complemento:
   AdSense → Sites → tu sitio → Auto ads ON
   Deja que Google encuentre más espacios rentables

5. Ad balance (acceso gradual):
   No tocar los primeros 30 días — recopilar datos
   Luego: AdSense → Optimization → Ad balance
```

---

## Checklist de Política AdSense

- [ ] No más de 3 unidades de display por página
- [ ] Ningún ad dentro de /exam (durante examen activo)
- [ ] Ads no apilados (siempre contenido entre ellos)
- [ ] No hay texto/imágenes que simulen botones de ads
- [ ] No hay flechas o llamadas a acción hacia los ads
- [ ] Los ads no cubren contenido del usuario
- [ ] Página tiene contenido suficiente (no páginas vacías con solo ads)
- [ ] Sitio accesible sin JavaScript (el contenido principal existe sin ads)

---

## Debugging: Ads No se Muestran

```
1. Verificar en DevTools → Console:
   - ¿Errores de CSP? → Añadir dominio faltante a firebase.json
   - ¿"adsbygoogle.push() error: No slot size"? → Revisar minHeight contenedor

2. Verificar env vars:
   console.log(import.meta.env.VITE_ADSENSE_PUBLISHER_ID)  // debe tener valor

3. Verificar en red (DevTools → Network):
   - ¿pagead2.googlesyndication.com carga correctamente?
   - ¿Hay 4xx o bloqueo por extensión ad-blocker?

4. AdSense Console → Policy center:
   - ¿Hay violaciones de política activas?

5. Cuenta nueva / período de revisión:
   - AdSense puede tardar 30 días en activar ads en sitios nuevos
```

---

## Documentación Oficial
- AdSense Help Center: https://support.google.com/adsense
- AdSense + CSP: https://support.google.com/adsense/answer/10505218
- Auto Ads: https://support.google.com/adsense/answer/9261306
- AdSense Policies: https://support.google.com/adsense/answer/48182
- In-feed ads: https://support.google.com/adsense/answer/6242051
- Revenue optimization: https://support.google.com/adsense/answer/10098543
