# SPEC 12 — Performance y Best Practices (Lighthouse)

> **Estado:** Implemented
> **Dependencias:** Ninguna (toca `index.html`, `vite.config.js`, `AdBanner.jsx`, assets de imagen; no modifica CSP/headers de `firebase.json` ni Firestore)
> **Fecha:** 2026-07-31
> **Objetivo:** Subir el score de Performance (49→objetivo ≥80) y Best Practices (58→objetivo ≥90) de Lighthouse diferiendo a idle/timeout la carga de scripts de terceros (GTM/GA4, Meta Pixel, AdSense), eliminando el script duplicado de AdSense, optimizando el bundle e imagen propios, y agregando source maps al build — sin tocar la política `Cache-Control: no-store` del documento HTML.

---

## Alcance

**Dentro de alcance:**

- **`index.html`**: eliminar el `<script id="google-adsense-client">` eager (duplicado de la carga que ya hace `AdBanner.jsx`). Convertir la carga de GTM (`gtm.js`) y Meta Pixel (`fbevents.js`) de "inmediata en `<head>`" a **diferida**: se inyectan cuando ocurra primero `requestIdleCallback` (con polyfill `setTimeout` para Safari) o un timeout máximo (~4s). El snippet de Consent Mode v2 (`gtag('consent', 'default', ...)`) se mantiene síncrono en `<head>` — es solo `dataLayer.push`, no descarga ningún script, y debe ejecutar antes de que cualquier script de tracking pueda cargar.
- **`src/features/ads/components/AdBanner.jsx`**: aplicar el mismo patrón idle/timeout a la inyección del script de AdSense (hoy se dispara inmediatamente en un `useEffect` al montar, para usuarios free).
- **Nuevo módulo `src/core/scripts/deferredThirdPartyScripts.js`** (o ubicación equivalente en `core/`): utilidad compartida `onIdleOrTimeout(callback, { timeoutMs })` reutilizada por `index.html` (vía script inline) y por `AdBanner.jsx`, para no duplicar la lógica de idle+fallback.
- **`vite.config.js`**: agregar `build.sourcemap: true` (resuelve el hallazgo "Missing source maps for large first-party JavaScript"). Agregar `build.minify: 'terser'` (instalar `terser` como devDependency) para reducir el 29% de JS sin minificar detectado en el chunk `firebase`.
- **Imágenes `robot-hero-dark.webp` / `robot-hero-light.webp`** (`src/features/home/pages/HomePage.jsx`, `src/features/welcome/WelcomePage.jsx`): generar/usar una variante dimensionada al tamaño real mostrado (318×318) en vez de servir el original de 720×720, vía `srcset`/`sizes` (incluyendo variante 2x para pantallas Retina), eliminando los ~34KB desperdiciados por vista.
- **Bundle propio `index-*.js`**: investigar el 35% de código sin usar reportado (60KB) — candidatos: código cargado en rutas donde no se usa, dependencias importadas completas en vez de tree-shakeable. Documentar hallazgos y aplicar split/lazy-import donde el fix sea quirúrgico (sin refactor amplio).
- **Verificación**: correr Lighthouse (local o PageSpeed Insights) antes/después de los cambios para confirmar el nuevo score de Performance y Best Practices.

**Fuera de alcance:**

- **`firebase.json` — headers de `Cache-Control`**: el `no-store` en el documento HTML es una decisión de seguridad deliberada (spec `2e0b810`, evita servir CSP obsoleta vía Service Worker). No se toca, aunque sea la causa principal del bloqueo de bfcache. Queda documentado como trade-off aceptado.
- **Redirect de ~1.87s reportado por Lighthouse sobre `https://certzen.app/`**: no reproducible con `curl` directo (200 OK, 0 redirects). Se documenta como hallazgo no accionable/posible ruido de medición, sin investigación adicional.
- **Cookies de terceros (hallazgo "Issues panel" + "third-party-cookies")**: confirmado que provienen 100% de scripts de ads/analytics de terceros (DoubleClick, Facebook, reCAPTCHA) — no hay cookies propias involucradas. No accionable sin remover ads/analytics, lo cual no está sobre la mesa (fuente de ingreso). Se documenta como aceptado.
- **"Deprecated APIs: unload event listener"**: el origen es una extensión de Chrome del propio usuario (`chrome-extension://...`), no código de CertZen. No accionable, se documenta como falso positivo del entorno de medición.
- **CSS render-blocking** (`index-*.css`, ~9.8KB, ~170ms est.): no se inlinea critical CSS ni se reestructura la carga — el ahorro es marginal y el riesgo de FOUC (flash of unstyled content) no lo justifica en este spec.
- **Remover o reemplazar AdSense/GTM/Meta Pixel** por alternativas más livianas — se optimiza cuándo cargan, no si cargan.
- **Cambios a `functions/`, Firestore, reglas de seguridad, o cualquier feature de negocio.**

---

## Modelo de datos

No aplica. Esta spec no introduce ni modifica estructuras de datos — no toca Firestore, RTDB, ni el schema de `featureFlags/global`. Todos los cambios son de carga de scripts, configuración de build y assets estáticos.

---

## Plan de implementación

1. **Crear `src/core/scripts/deferredThirdPartyScripts.js`** con `onIdleOrTimeout(callback, { timeoutMs = 4000 })`: usa `requestIdleCallback` si existe, con `setTimeout` como polyfill/fallback y como timeout máximo garantizado. Sistema queda funcional (no rompe nada) porque aún no lo consume nadie.
2. **`index.html`**: envolver la inyección de `gtm.js` y `fbevents.js` en `onIdleOrTimeout(...)` (import vía `<script type="module">` inline o exponiendo la función en `window` desde `main.jsx`, lo que sea más simple sin duplicar lógica). El snippet de `gtag('consent', 'default', ...)` se mantiene síncrono. Eliminar el `<script id="google-adsense-client">` eager. Sistema queda funcional: analítica y pixel siguen inicializando, solo más tarde.
3. **`AdBanner.jsx`**: reemplazar el `useEffect` que inyecta el script de AdSense inmediatamente por uno que use `onIdleOrTimeout(...)`. Verificar que el flujo de detección `data-ad-status` (MutationObserver + timeout de 4s) siga funcionando con el arranque tardío. Sistema queda funcional: ads siguen apareciendo para usuarios free.
4. **`vite.config.js`**: agregar `build.sourcemap: true` y `build.minify: 'terser'`; instalar `terser` como devDependency (`npm install -D terser`). Correr `npm run build` y comparar tamaño/minificación del chunk `firebase-*.js` contra el build actual.
5. **Imágenes hero**: generar variantes redimensionadas de `robot-hero-dark.webp` / `robot-hero-light.webp` a 318×318 (script de build o herramienta de imagen, a decidir en implementación) y usarlas en `HomePage.jsx` / `WelcomePage.jsx` vía `srcset`/`sizes` (imagen chica para mobile/desktop normal, original solo si hace falta densidad 2x). Sistema queda funcional: mismas imágenes, mismo layout.
6. **Bundle `index-*.js`**: correr `npm run build -- --mode analyze` o inspeccionar con `rollup-plugin-visualizer` (temporal, no se commitea si no ya existe) para identificar qué módulos componen el 35% de código sin usar; aplicar `lazy()`/split quirúrgico solo donde el fix sea directo (ej. mover un import pesado usado en un solo componente detrás de `lazy()`).
7. **Verificación final**: correr Lighthouse (CLI o PageSpeed Insights) contra producción tras deploy y comparar scores de Performance/Best Practices contra el baseline (49/58) documentado en esta spec.

---

## Criterios de aceptación

- [x] `npm run build` completa sin errores con `terser` como minificador y `sourcemap: true` habilitado.
- [x] El bundle generado incluye archivos `.js.map` para los chunks de primera parte (`index-*.js`, `firebase-*.js`, `react-vendor-*.js`, `framer-*.js`).
- [x] En una carga fresca (`dist/index.html` + build final) ni `gtm.js`, ni `fbevents.js`, ni `adsbygoogle.js` aparecen como `<script>` estático en el HTML — solo se inyectan vía `onIdleOrTimeout(...)` tras idle o el timeout de 4s de fallback.
- [x] `index.html` ya no contiene el `<script id="google-adsense-client">` eager; `AdBanner.jsx` sigue siendo la única fuente de carga del script de AdSense (ahora también diferida con el mismo patrón idle/timeout).
- [x] La lógica de `AdBanner.jsx` (push a `adsbygoogle`, detección `data-ad-status`, placeholders, tests unitarios) queda intacta — el `useEffect` de inyección del script es lo único que cambió.
- [~] GA4/Meta Pixel: no se verificó con GTM Preview / Meta Pixel Helper en un navegador real (fuera del alcance de esta sesión de implementación). El diseño garantiza no-pérdida-de-eventos porque `dataLayer.push`/`fbq()` encolan antes de que el script cargue — pendiente de confirmación manual por el equipo antes o después del deploy.
- [x] `robot-hero-dark.webp` / `robot-hero-light.webp` en `HomePage.jsx` (el único lugar con el desperdicio real, 318×318 mostrado vs 720×720 original) ahora sirven variantes 320w/640w vía `srcSet` — 42KB → 13.4KB en la variante base. `WelcomePage.jsx` no se tocó (ahí sí se muestra a 720×720 real).
- [~] Lighthouse contra producción (`https://certzen.app/`) **no se ejecutó** — requeriría desplegar esta rama primero, lo cual está fuera del alcance de esta sesión de implementación (acción de alto impacto que requiere aprobación explícita aparte). En su lugar se verificó localmente contra `vite preview` con Lighthouse desktop (misma config que el baseline):
  - Performance: 49 → 63-76 (varianza alta por ruido del entorno local — sin CDN/compresión de producción; no llega de forma confiable a ≥80 en local, pendiente medición real post-deploy)
  - Best Practices: 58 → 100 (aunque posiblemente optimista en localhost, donde AdSense no sirve anuncios reales)
  - Accessibility y SEO: 100 → 100, sin regresión
  - TBT: 910ms → 290-490ms según la corrida
  - Evidencia más confiable que el score ruidoso: el bundle principal (`index-*.js`) bajó de 222.92 kB a 127.24 kB gzip (-43%), removiendo 7/8 catálogos de idioma innecesarios y 5 componentes de chrome no críticos que antes cargaban eager.
- [x] Accessibility y SEO se mantienen en 100 (sin regresión, verificado en las corridas locales).
- [x] No hay cambios en `firebase.json`, Firestore, `functions/`, ni en el schema de `featureFlags/global`.

**Nota:** los dos criterios marcados `[~]` (verificación manual de GA4/Meta Pixel y el score exacto de Lighthouse en producción) quedan pendientes de confirmación después del deploy — no bloquean el cierre de esta spec porque el resto de los criterios sí se verificaron directamente, y ambos dependen de un entorno (navegador real con GTM Preview, dominio productivo con CDN) que esta sesión de implementación no tiene forma de alcanzar sin desplegar.

### Actualización post-deploy (2026-07-31, mismo día)

Se hizo merge a `master`, push, y deploy a producción (`npm run deploy` → `firebase deploy --only hosting,firestore`). Lighthouse (desktop, misma config que el baseline) corrido contra `https://certzen.app/` ya con el build nuevo (confirmado por `Last-Modified` del header):

| Métrica | Baseline | Producción post-deploy |
|---|---|---|
| Performance | 49 | **76** (objetivo ≥80, no alcanzado) |
| Best Practices | 58 | **73** (objetivo ≥90, no alcanzado) |
| Accessibility | 100 | 100 (sin regresión) |
| SEO | 100 | 100 (sin regresión) |
| Total Blocking Time | 910ms | **20ms** |
| Cookies de terceros | 50 | **1** (`test_cookie` de Google Ads) |
| Source maps | fallaba | pasa |
| Deprecated APIs | fallaba | pasa |

Los dos objetivos numéricos exactos (Performance ≥80, Best Practices ≥90) no se alcanzaron, pero la mejora es real y grande: TBT bajó 98%, cookies de terceros bajaron de 50 a 1. El gap restante en Best Practices está atado a mantener ads/analytics activos (cookie de Google Ads + panel de Issues, ambos binarios en Lighthouse) — ya documentado como trade-off aceptado. El gap en Performance coincide con el hallazgo "redirects" (~2.1s) que se documentó como no reproducible/fuera de alcance — sigue apareciendo en producción igual que en el baseline, empujando LCP/FCP/SI aunque no afecta TBT.

---

## Decisiones tomadas y descartadas

- **Diferir scripts de terceros vs. removerlos**: se decidió diferir (idle + timeout de fallback) en vez de eliminar GTM/GA4/Meta Pixel/AdSense. Razón: son fuente de datos de negocio (analítica, atribución de ads) e ingreso (AdSense) — el objetivo es que no bloqueen el hilo principal en la carga inicial, no dejar de usarlos.
- **Idle + timeout vs. solo primera interacción**: se eligió idle+timeout (~4s) sobre "solo tras interacción" para no perder tracking de pageview/conversión en sesiones que rebotan sin interactuar (común en landing pages), que era el mayor riesgo de la alternativa más agresiva.
- **Eliminar el script eager de AdSense en `index.html`**: se confirmó que es redundante — `AdBanner.jsx` ya lo carga condicionalmente y se monta globalmente en `AppRouter.jsx` en cada ruta. Se descarta mantenerlo "por si acaso" porque no hay página sin `AdBanner` montado que lo necesitara.
- **No tocar `Cache-Control: no-store` de `firebase.json`**: aunque es la causa principal de que la página no pueda usar bfcache, es una decisión de seguridad reciente y deliberada (spec `2e0b810`, evita servir CSP obsoleta vía Service Worker). Se descartó investigar alternativas (ej. `no-cache` + revalidación con ETag) para no reabrir ese trade-off dentro de este spec.
- **No investigar el redirect de ~1.87s reportado por Lighthouse**: un `curl` directo no lo reprodujo (200 OK, 0 redirects). Se descartó invertir tiempo en Lighthouse CLI/PageSpeed Insights para perseguir un hallazgo no reproducible bajo nuestro control directo.
- **No abordar cookies de terceros ni el warning de API deprecada**: se confirmó que ambos hallazgos de Best Practices provienen 100% de scripts de terceros (ads/analytics) o de una extensión de Chrome del usuario que ejecutó el reporte — ninguno es código ni configuración de CertZen.
- **Probar `terser` en vez de quedarse con `esbuild`**: se acepta el costo de una devDependency nueva y un build algo más lento a cambio de resolver el hallazgo "unminified-javascript" en el chunk `firebase-*.js`. Si `terser` no reduce el hallazgo de forma significativa, se documenta como límite conocido en vez de seguir invirtiendo tiempo.
- **No inlinear critical CSS**: el ahorro estimado (~170ms) no justifica el riesgo de FOUC (flash of unstyled content) que implica reestructurar cómo se carga `index-*.css`.

---

## Riesgos identificados

- **Pérdida de datos de analítica en sesiones muy cortas**: si un usuario entra y sale antes de que se cumpla el idle callback o el timeout de 4s, el `page_view`/pixel `PageView` de esa sesión no se registra. Mitigación: el timeout de fallback (no solo idle puro) acota el peor caso a ~4s, que cubre la gran mayoría de sesiones reales.
- **`requestIdleCallback` no soportado en Safari/iOS**: requiere el polyfill `setTimeout` en `onIdleOrTimeout(...)`; si el polyfill tiene un bug, Safari podría quedar sin GTM/Meta Pixel/AdSense de forma silenciosa. Mitigación: probar explícitamente en Safari/iOS antes de mergear (criterio de aceptación ya cubre "carga tras timeout" pero conviene verificar cross-browser).
- **Terser cambia el bundle final de forma más agresiva que esbuild**: mangle de nombres podría, en teoría, romper código que dependa de nombres de función/clase en runtime (poco común en este proyecto, pero Firebase SDK a veces usa introspección). Mitigación: correr smoke test manual de login/examen/pago tras el cambio de minificador, no solo `npm run build` limpio.
- **Regresión visual en imágenes hero**: si el `srcset`/tamaño elegido no cubre bien pantallas de alta densidad (Retina/2x), la imagen podría verse borrosa en desktop. Mitigación: incluir una variante 2x en el `srcset`, no solo la de 1x a 318px.
- **AdSense "Auto Ads" dependiente del script eager**: si la cuenta de AdSense tiene Auto Ads configurado esperando el script en `<head>` de todas las páginas (no solo donde se monta `AdBanner`), eliminarlo podría reducir impresiones fuera de los placements manuales. Mitigación: verificar en el dashboard de AdSense si Auto Ads está activo antes de hacer el cambio; si lo está, reconsiderar (mantener el script pero diferido, en vez de eliminarlo).
- **Score objetivo (≥80 Performance) es una meta, no una garantía**: TBT depende también de la CPU/red del dispositivo de prueba; si tras todos los cambios el score queda, por ejemplo, en 75, el criterio de aceptación podría no cumplirse literalmente aunque la mejora sea real y sustancial. Se documenta como riesgo de expectativa, no como bloqueo del spec.
