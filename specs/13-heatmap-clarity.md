# SPEC 13 — Heatmap de interacción (Microsoft Clarity)

> **Estado:** Implemented
> **Dependencias:** Reutiliza `src/core/scripts/deferredThirdPartyScripts.js` y `bootstrapThirdPartyScripts.js` (patrón de carga diferida, spec 12) y `src/features/consent/consent.js` (Consent Mode v2 + evento `certzen:consent-changed`, gate de consentimiento ya usado por `AdBanner.jsx`).
> **Fecha:** 2026-08-14
> **Objetivo:** Agregar Microsoft Clarity (heatmaps de click/scroll + grabaciones de sesión) a todo el sitio, cargado de forma diferida y gateado por el mismo consentimiento de cookies que GA4/Meta Pixel/AdSense, enmascarando el contenido de preguntas/respuestas/resultados en las grabaciones para no exponer el banco de contenido pagado.

---

## Alcance

**Dentro de alcance:**

- **`src/core/scripts/bootstrapThirdPartyScripts.js`**: agregar `loadClarityScript()` que inyecta el snippet oficial de Microsoft Clarity (`clarity.ms/tag/<PROJECT_ID>`), usando `import.meta.env.VITE_CLARITY_PROJECT_ID`. Se dispara dentro del `onIdleOrTimeout(...)` ya existente, y **solo si `readStoredConsent() === 'granted'`** (mismo chequeo que usa `AdBanner.jsx` para AdSense). Si la env var no está configurada, la función hace early-return sin efecto (no rompe nada).
- **Listener de consentimiento tardío**: en el mismo módulo, agregar `window.addEventListener('certzen:consent-changed', ...)` para cargar Clarity si el usuario otorga consentimiento *después* del arranque inicial (responde el banner tarde). Un flag interno (`clarityLoaded`) evita inyectar el script dos veces.
- **`.env.example`**: agregar `VITE_CLARITY_PROJECT_ID=`.
- **Enmascarado de contenido sensible** vía atributo `data-clarity-mask="true"` de Clarity:
  - `src/features/exam/pages/ExamPage.jsx` — en el contenedor raíz que envuelve `QuestionCard`/`ConfidencePicker`/`TimerBox`.
  - `src/features/results/ResultsPage.jsx` y `src/features/results/ReviewPage.jsx` — en su contenedor raíz (cubre preguntas, respuestas correctas/incorrectas y explicaciones).
  - El heatmap de clicks/scroll de Clarity **sigue activo** en estas páginas — solo se enmascara el texto en las grabaciones de sesión, no se excluye el tracking de interacción.
- **`src/features/public/pages/PrivacyPage.jsx`**: agregar Microsoft Clarity a la lista de proveedores de terceros/analítica ya documentada (mismo formato que la entrada existente de GA4/Meta Pixel), mencionando que respeta el mismo consentimiento y que enmascara contenido de examen/resultados.
- **Verificación de `CookieConsentBanner.jsx`**: confirmar (sin necesariamente modificar) que el texto genérico de "cookies analíticas" ya cubre Clarity, sin requerir un checkbox nuevo — Clarity cae bajo la misma categoría `analytics_storage` que ya gestiona Consent Mode v2.

**Fuera de alcance:**

- **Panel propio en Admin para visualizar heatmaps in-app** — se usa el dashboard nativo de clarity.microsoft.com. Construir una vista embebida queda para un spec futuro si se necesita.
- **Grabación de sesión sin enmascarado en `/exam` o `/results`/`/review`** — siempre se enmascara el contenido de esas páginas, sin excepción.
- **Cambios a GTM/GA4/Meta Pixel/AdSense existentes** — Clarity se suma al patrón ya existente, no lo modifica.
- **Actualización legal exhaustiva de `PrivacyPage.jsx`/`TermsPage.jsx`** más allá de agregar la mención de Clarity como proveedor de analítica, siguiendo el mismo formato que las entradas existentes.

---

## Modelo de datos

No aplica. Esta spec no introduce ni modifica estructuras de datos propias (Firestore, RTDB) — Clarity gestiona su propio almacenamiento de sesiones/heatmaps en su plataforma externa (clarity.microsoft.com). El único dato nuevo del lado del proyecto es la variable de entorno `VITE_CLARITY_PROJECT_ID`.

---

## Plan de implementación

1. **`.env.example`**: agregar `VITE_CLARITY_PROJECT_ID=`. El usuario crea un proyecto en clarity.microsoft.com y configura el ID real en su `.env` local / variables de entorno de Firebase Hosting. Sistema queda funcional: sin el valor configurado, no hay efecto.
2. **`bootstrapThirdPartyScripts.js` — `loadClarityScript()`**: implementar el snippet oficial de Clarity (inyección de `<script>` con `clarity.ms/tag/<PROJECT_ID>`), con early-return si `import.meta.env.VITE_CLARITY_PROJECT_ID` no existe. Llamarla dentro del `onIdleOrTimeout(...)` existente junto a `loadGtm()`/`loadMetaPixelScript()`, condicionada a `readStoredConsent() === 'granted'`. Sistema queda funcional: Clarity carga diferido solo con consentimiento previo ya otorgado.
3. **Listener de consentimiento tardío**: agregar el listener `certzen:consent-changed` en el mismo módulo, con flag `clarityLoaded` para evitar doble inyección. Sistema queda funcional: usuarios que aceptan cookies después del arranque inicial también activan Clarity, sin necesitar recargar.
4. **Enmascarado**: agregar `data-clarity-mask="true"` a los contenedores raíz de `ExamPage.jsx`, `ResultsPage.jsx` y `ReviewPage.jsx`. Sistema queda funcional: no cambia comportamiento visual ni de negocio, solo instruye a Clarity a ocultar ese subárbol en las grabaciones.
5. **`PrivacyPage.jsx`**: agregar la entrada de Microsoft Clarity junto a las de GA4/Meta Pixel/AdSense ya documentadas. Sistema queda funcional: solo texto informativo.
6. **Verificación manual**: con consentimiento aceptado, confirmar en Network que `clarity.ms` carga diferido (no bloquea LCP); confirmar que rechazar el consentimiento impide la carga; confirmar en el dashboard de Clarity que las grabaciones de `/exam` y `/results` muestran el texto enmascarado (bloques grises) mientras el heatmap de esas páginas sí registra clicks/scroll.

---

## Criterios de aceptación

- [x] Con consentimiento otorgado, el script de Clarity se inyecta diferido (idle/timeout), no bloquea el hilo principal en la carga inicial. Verificado en `npm run dev` con `VITE_CLARITY_PROJECT_ID=y2biy4wll9`: request a `clarity.ms/tag/y2biy4wll9` y eventos `e.clarity.ms/collect` fluyendo tras el idle/timeout.
- [~] Con consentimiento denegado o pendiente, el script de Clarity NO se inyecta vía nuestro código — verificado que `loadClarityScript()` respeta el gate. **Sin embargo**, se detectó que el contenedor de GTM del proyecto ya tiene un tag de Microsoft Clarity propio configurado (visible como request `clarity.ms/tag/y2biy4wll9?ref=gtm`, distinto del nuestro), que sigue disparando incluso con `analytics_storage: denied`. Ese tag vive en tagmanager.google.com, fuera de este repo y de este spec — se documenta como hallazgo pendiente de revisión manual en el dashboard de GTM (posible duplicado/fuga de consentimiento no controlable desde el código).
- [x] Si el usuario otorga consentimiento después de la carga inicial (vía el banner), Clarity se carga en ese momento sin necesitar recargar la página, y no se inyecta dos veces (flag `clarityLoaded` compartido entre `onIdleOrTimeout` y el listener `certzen:consent-changed`).
- [x] El contenido de `ExamPage`, `ResultsPage` y `ReviewPage` lleva `data-clarity-mask="true"` en su contenedor raíz — pendiente de confirmación visual en el reproductor de grabaciones de Clarity (requiere tráfico real acumulado en el dashboard).
- [x] `PrivacyPage.jsx` menciona a Microsoft Clarity como proveedor de analítica de terceros, con el mismo formato que las entradas existentes.
- [x] Sin `VITE_CLARITY_PROJECT_ID` configurado, la app funciona igual que hoy — `loadClarityScript()` hace early-return, no rompe nada, no lanza errores en consola.
- [x] `npm run build` pasa sin errores.
- [x] `npx eslint src` pasa sin errores ni warnings.

---

## Decisiones tomadas y descartadas

- **Sí:** Microsoft Clarity sobre Hotjar o una solución custom con Firestore/BigQuery — es gratuito sin límite de sesiones, no requiere backend propio, y el patrón de carga diferida ya existente en el proyecto se reutiliza directamente sin esfuerzo de infraestructura nuevo.
- **Sí:** reutilizar el gate de consentimiento existente (`readStoredConsent()` + evento `certzen:consent-changed`) en vez de agregar un checkbox nuevo al banner — Clarity es, a efectos de privacidad, una cookie de analítica igual que GA4, ya cubierta por la categoría `analytics_storage` de Consent Mode v2.
- **Sí:** enmascarar el contenido de `/exam` y `/results`/`/review` en vez de excluir esas páginas del tracking por completo — permite seguir viendo el heatmap de interacción (dónde hacen click, cuánto scrollean) en las páginas de mayor interés de negocio, sin exponer el banco de preguntas pagado en las grabaciones de sesión.
- **Sí:** `VITE_CLARITY_PROJECT_ID` como variable de entorno en vez de hardcodeado — sigue la convención `VITE_*` ya establecida en el proyecto para configuración de terceros, aunque el ID en sí no sea secreto.
- **No:** panel propio en Admin para visualizar heatmaps in-app — el dashboard nativo de clarity.microsoft.com ya cubre la necesidad inmediata; construir una vista embebida es esfuerzo no pedido explícitamente.
- **No:** excluir `/exam`/`/results` del tracking (en vez de enmascarar) — se descartó porque perdería visibilidad de interacción en las páginas más relevantes del producto.

---

## Actualización post-deploy (2026-08-14, mismo día)

Tras el deploy a producción, se verificó en `certzen.app` con sesión real (consentimiento ya `granted`) que `www.clarity.ms/tag/y2biy4wll9` cargaba, pero **no llegaban datos al dashboard de Clarity**. Causa raíz encontrada: el `Content-Security-Policy` en `firebase.json` no incluía ningún dominio `clarity.ms`, así que el navegador bloqueaba silenciosamente la carga de `scripts.clarity.ms` (la librería real de tracking) y los beacons de datos a `e.clarity.ms/collect` — solo el primer script "tag" llegaba a network por no depender de esos subdominios.

**Fix aplicado:** se agregó `https://*.clarity.ms` a `script-src`, `img-src` y `connect-src` en `firebase.json` (siguiendo la guía oficial de Microsoft Clarity, que usa múltiples subdominios de datos). Se desplegó solo el cambio de headers de Hosting (`firebase deploy --only hosting`, sin rebuild) y se confirmó que quedó fuera de este spec original — se documenta aquí porque es parte necesaria para que el spec funcione end-to-end, no un tema separado.

Este hallazgo también aplica al tag de Clarity que ya existía en GTM (documentado arriba): sin este fix de CSP, tampoco esa carga habría podido enviar datos.

## Riesgos identificados

- **El snippet de Clarity podría no exponer una API pública de "unload" para desactivarlo tras cargar** — si el usuario retira el consentimiento después de haberlo otorgado (revocación), el script ya cargado seguiría corriendo hasta el siguiente refresh de página. Mitigación: documentar como limitación conocida, consistente con cómo se maneja hoy AdSense/Meta Pixel (tampoco tienen unload dinámico en este proyecto).
- **`data-clarity-mask="true"` requiere que Clarity esté configurado para respetar el atributo por defecto (masking automático activado en el proyecto de Clarity)** — si el proyecto de Clarity tiene "Mask by default" desactivado en su dashboard, el atributo podría no aplicar como se espera. Mitigación: verificar la configuración del proyecto en clarity.microsoft.com como parte de la verificación manual (paso 6).
- **Doble inyección del script si `onIdleOrTimeout` corre y el listener de consentimiento tardío se dispara casi simultáneamente** — mitigado por el flag `clarityLoaded` compartido entre ambos caminos.
- **Sesiones cortas que rebotan antes del idle/timeout (~4s) no quedan registradas** — mismo riesgo aceptado ya documentado en spec 12 para GTM/Meta Pixel/AdSense; no es un riesgo nuevo introducido por esta spec.
