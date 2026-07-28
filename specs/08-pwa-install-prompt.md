# SPEC 08 — Banner de instalación PWA

> **Status:** Implementado
> **Depends on:** —
> **Date:** 2026-07-27
> **Objective:** Mostrar un banner (mobile) o toast flotante (desktop) que invite a instalar CertZen como PWA — con flujo nativo en Android/desktop y hoja de instrucciones en iOS Safari — respetando plataforma, un feature flag remoto y un cooldown de 7 días al descartarlo.

---

## Scope

**In:**

- **`src/features/pwa/`** (nueva feature):
  - `components/PwaInstallPrompt.jsx` — componente único y responsive: franja inferior de ancho completo en mobile/tablet (`<lg`), tarjeta flotante en la esquina inferior en desktop (`lg:` y superior). Contenido fiel a los mockups: ícono/mascota de la app, "Instala CertZen" + subtítulo, 3 bullets ("Acceso directo" / "Modo offline" / "Recordatorios"), botones "Instalar app" (primario) y "Ahora no" (secundario), botón cerrar (X).
  - `components/PwaIosInstructionsModal.jsx` — reutiliza el `Modal` centrado compartido (`src/components/ui/Modal.jsx`). Contenido fiel al mockup "Instrucciones iOS": mock de barra de dirección de Safari + 3 pasos numerados (Compartir → Agregar a pantalla de inicio → Agregar) + texto de cierre.
  - `hooks/usePwaInstall.js` — hook central: escucha `beforeinstallprompt` (Android/desktop Chrome/Edge), detecta iOS Safari vía `navigator.userAgent`, detecta si ya está instalada (`display-mode: standalone` / `navigator.standalone`), expone el estado y las acciones (`install()`, `dismiss()`).
- **Lógica de plataforma (3 casos explícitos):**
  1. Navegador dispara `beforeinstallprompt` → se guarda el evento diferido; "Instalar app" llama a `deferredPrompt.prompt()` (flujo nativo del navegador).
  2. iOS Safari (no dispara ese evento) → "Instalar app" abre `PwaIosInstructionsModal` con los 3 pasos.
  3. Ya instalada (`display-mode: standalone`/`navigator.standalone`) o navegador sin soporte de ninguna de las dos vías anteriores → el prompt nunca se monta.
- **Aparece en toda la app** (autenticada y anónima, sin restricción de rutas tipo `StickyAdBar`), con un delay corto (3-5s) tras cargar la página.
- **Cooldown de dismiss:** al pulsar "Ahora no" o cerrar (X), se guarda un timestamp en `localStorage`; no se vuelve a mostrar hasta pasados 7 días. Si el usuario instala la app exitosamente, no se vuelve a mostrar nunca más (se detecta vía el evento `appinstalled` y/o al pasar a `display-mode: standalone`).
- **Prioridad sobre `StickyAdBar`:** mientras `PwaInstallPrompt` esté visible, `StickyAdBar` se oculta (no se monta / retorna `null`) para no apilar dos franjas fijas en la parte inferior. Al cerrarse el prompt (dismiss o instalación), `StickyAdBar` vuelve a evaluarse normalmente.
- **Feature flag `pwaPromptEnabled`** (nuevo) en `useFeatureFlags`/`DEFAULT_FLAGS` + entrada en `FLAG_META` de `AdminFlagsPage.jsx`, mismo patrón que `adsEnabled` — permite apagar el banner sin deploy.
- Soporte responsive (mobile/tablet/desktop) y light/dark, fiel a los 6 mockups de `C:\Users\david.betancur_pragm\Desktop\Proyectos\pen\certzen\pwa`.

**Out of scope:**

- Cambios al manifest/Service Worker (`vite.config.js` `VitePWA(...)`) — ya está configurado y funcional, no se toca.
- Prompts de instalación específicos para navegadores sin soporte de ninguna de las 2 vías (ej. Firefox desktop, in-app browsers de redes sociales) — quedan sin banner, sin mensaje alternativo.
- Analítica/eventos nuevos de GA4 sobre instalación (impresiones, clics, instalaciones completadas) — puede evaluarse en spec futuro.
- Notificaciones push reales — el bullet "Recordatorios" es solo copy del mockup, no implica implementar Web Push en este spec.
- Cualquier lógica de "solo mostrar tras cierto uso" (contador de visitas/exámenes completados) — se descartó explícitamente, aparece desde la primera visita.

---

## Data model

No se crean colecciones nuevas en Firestore. Se agrega **un campo** al documento existente `featureFlags/global` y **una clave** de `localStorage`.

**Firestore — `featureFlags/global`** (documento ya existente, gestionado por `useFeatureFlags`/`DEFAULT_FLAGS`):

| Campo | Tipo | Descripción |
|---|---|---|
| `pwaPromptEnabled` | `boolean` | Si es `false`, `PwaInstallPrompt` nunca se monta, sin importar plataforma/dismiss. Default `true` en `DEFAULT_FLAGS` (mismo criterio que `adsEnabled`). |

No requiere cambios en `firestore.rules` (el doc `featureFlags/global` ya tiene lectura pública y escritura solo-admin, gestionada por specs previos).

**`localStorage` (por navegador/dispositivo):**

| Clave | Tipo | Descripción |
|---|---|---|
| `pwa-install-dismissed-at` | `string` (timestamp ISO o epoch ms) | Momento en que el usuario pulsó "Ahora no" o cerró (X) el prompt. Si `Date.now() - valor < 7 días`, el prompt no se muestra. Ausente = nunca lo ha descartado. |
| `pwa-install-completed` | `'1'` (flag simple) | Se escribe cuando se detecta el evento `appinstalled` (o se confirma `display-mode: standalone` tras el flujo de instalación). Si existe, el prompt nunca se vuelve a montar, sin importar el cooldown. |

**Estado en memoria (`usePwaInstall.js`, sin persistencia):**

| Estado | Tipo | Descripción |
|---|---|---|
| `deferredPrompt` | `BeforeInstallPromptEvent \| null` | Evento nativo capturado en `beforeinstallprompt`, guardado para invocar `.prompt()` al hacer click en "Instalar app". |
| `platform` | `'native' \| 'ios' \| 'unsupported'` | Determina qué acción dispara "Instalar app": `native` → `deferredPrompt.prompt()`; `ios` → abre `PwaIosInstructionsModal`; `unsupported` → el componente ni se renderiza. |
| `isInstalled` | `boolean` | `true` si `display-mode: standalone` o `navigator.standalone`, o si existe `pwa-install-completed` en `localStorage`. |

---

## Implementation plan

1. **`hooks/usePwaInstall.js`.** Al montar: detecta `isInstalled` (media query `(display-mode: standalone)` + `navigator.standalone` para iOS + `localStorage.getItem('pwa-install-completed')`). Si no está instalada: agrega listener `beforeinstallprompt` (guarda el evento en `deferredPrompt` vía `e.preventDefault()` + `setState`, establece `platform = 'native'`); si no llega ese evento y el user-agent matchea iOS Safari (`/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream`, excluyendo Chrome-en-iOS que tampoco soporta instalación), establece `platform = 'ios'`; si ninguno aplica tras un timeout corto, `platform = 'unsupported'`. Agrega listener `appinstalled` → `localStorage.setItem('pwa-install-completed', '1')` + `isInstalled = true`. Expone `{ platform, isInstalled, shouldShow, install(), dismiss() }` donde `shouldShow` combina `platform !== 'unsupported'`, `!isInstalled`, el flag `pwaPromptEnabled` (via `useFeatureFlags`) y el cooldown de `pwa-install-dismissed-at`. `install()`: si `platform === 'native'`, llama `deferredPrompt.prompt()` y espera `userChoice`; si `platform === 'ios'`, retorna una señal para que el componente abra el modal de instrucciones. `dismiss()`: escribe `pwa-install-dismissed-at` con el timestamp actual. Test manual: en Chrome desktop con DevTools → Application → Manifest, forzar el evento y confirmar que `platform` se resuelve a `'native'`; simular user-agent iOS y confirmar `platform === 'ios'`.

2. **`components/PwaInstallPrompt.jsx`.** Consume `usePwaInstall()`. Si `!shouldShow`, no renderiza nada. Delay de 3-5s antes de mostrarse (vía `setTimeout` interno, no bloquea el resto de la página). Layout responsive: franja inferior de ancho completo (`fixed bottom-0`) en `<lg`, tarjeta flotante con márgenes y esquinas redondeadas en las 4 esquinas en `lg:` y superior — mismo componente, clases condicionales (sin duplicar JSX). Botón "Instalar app": llama `install()`; si la plataforma es `'ios'`, abre `PwaIosInstructionsModal` en vez de esperar un prompt nativo. Botón "Ahora no" y X: llaman `dismiss()`. Fiel a los mockups Banner/Toast (ícono app, título, subtítulo, 3 bullets, botones), light/dark con tokens Glassmorphism. Test manual: en mobile (390px) y desktop (1440px), light/dark, confirmar que aparece tras el delay y que "Ahora no"/X lo ocultan.

3. **`components/PwaIosInstructionsModal.jsx`.** Modal (`Modal` compartido) con el contenido del mockup "Instrucciones iOS": mock de barra de Safari con "certzen.co" + ícono compartir, 3 pasos numerados (ícono + título + descripción), texto de cierre "CertZen aparecerá como una app más en tu pantalla de inicio". Se abre desde `PwaInstallPrompt` cuando `platform === 'ios'` y el usuario pulsa "Instalar app". Test manual: simular iOS, pulsar "Instalar app", confirmar que abre el modal con los 3 pasos legibles en 390px.

4. **Prioridad sobre `StickyAdBar`.** En `AppRouter.jsx`, condicionar el render de `<StickyAdBar />` a que `usePwaInstall().shouldShow` sea `false` (se puede exponer el hook a nivel de `AppRouter` o vía un pequeño contexto/estado compartido — decidir la forma exacta al implementar, sin cambiar el contrato del hook). Test manual: forzar ambas condiciones (usuario free, ruta con ads permitidos, prompt PWA visible) y confirmar que solo se ve el prompt PWA, nunca las dos franjas apiladas.

5. **Feature flag `pwaPromptEnabled`.** Agregar `pwaPromptEnabled: true` a `DEFAULT_FLAGS` en `useFeatureFlags.js`, y una entrada `{ key: 'pwaPromptEnabled', label: 'Banner de instalación PWA', desc: '...' }` en `FLAG_META` de `AdminFlagsPage.jsx`. Test manual: desde Admin → Feature Flags, desactivar el flag y confirmar que el prompt deja de aparecer (tras refrescar), sin tocar `localStorage`.

6. **Montaje global.** Renderizar `<PwaInstallPrompt />` una vez en `AppRouter.jsx`, junto a `<StickyAdBar />`, fuera del árbol de rutas para que persista entre navegaciones. Test manual: navegar entre varias rutas (públicas y autenticadas) y confirmar que el prompt no se remonta ni reinicia su delay en cada cambio de ruta.

7. **Verificación final.** `npm run build`, `npx eslint src` y `npm run i18n:update` (para que los strings nuevos queden compilados en el catálogo — lección aprendida de la spec de Flashcards) sin errores. Prueba manual completa: 390/768/1440px × light/dark, los 3 casos de plataforma (simulados via DevTools/user-agent), cooldown de 7 días (manipulando `localStorage` manualmente), flag apagado/encendido, y que `StickyAdBar` nunca se apila con el prompt.

---

## Acceptance criteria

- [ ] En un navegador que dispara `beforeinstallprompt` (Chrome/Edge Android o desktop) y no tiene la PWA instalada, el prompt aparece 3-5s después de cargar cualquier página, y el botón "Instalar app" invoca el flujo nativo del navegador (`deferredPrompt.prompt()`).
- [ ] En iOS Safari, el prompt aparece igual, pero "Instalar app" abre `PwaIosInstructionsModal` con los 3 pasos (Compartir → Agregar a pantalla de inicio → Agregar) en vez de un flujo nativo.
- [ ] Si la app ya está instalada (`display-mode: standalone` / `navigator.standalone`) o el navegador no soporta ninguna de las 2 vías, el prompt nunca se renderiza.
- [ ] El prompt aparece tanto en páginas públicas como en la app autenticada (dashboard, examen, flashcards, etc.), sin restricción de rutas.
- [ ] En `<lg` (mobile/tablet) se ve como franja inferior de ancho completo; en `lg:` y superior, como tarjeta flotante con márgenes — mismo componente, sin duplicar JSX.
- [ ] Pulsar "Ahora no" o cerrar (X) oculta el prompt y guarda `pwa-install-dismissed-at` en `localStorage`; no vuelve a aparecer hasta pasados 7 días (verificable manipulando el timestamp guardado).
- [ ] Al completar una instalación exitosa (evento `appinstalled`), se guarda `pwa-install-completed` en `localStorage` y el prompt no vuelve a aparecer nunca más, sin importar el cooldown.
- [ ] Mientras el prompt esté visible, `StickyAdBar` no se muestra — nunca hay dos franjas fijas apiladas en la parte inferior de la pantalla.
- [ ] Desde Admin → Feature Flags, desactivar `pwaPromptEnabled` oculta el prompt en toda la app (sin necesitar deploy).
- [ ] El layout responde fielmente a los 6 mockups (`banner`, `iOS instructions`, `toast`) en mobile (390px), tablet (768px) y desktop (1440px), light y dark.
- [ ] `npm run build` pasa sin errores.
- [ ] `npx eslint src` sin errores ni warnings.
- [ ] `npm run i18n:update` corrido y los catálogos compilados incluyen los strings nuevos (sin IDs hasheados visibles en producción).

---

## Decisions

- **Sí:** aparece desde la primera visita, con solo un delay corto (3-5s), sin condición de uso previo (exámenes completados, número de visitas) — decisión explícita del usuario, mantiene el spec simple sin trackear un contador nuevo.
- **Sí:** el prompt aparece en toda la app (autenticada y anónima), sin la restricción de rutas de `StickyAdBar` — instalar la PWA es una utilidad de producto, no está sujeta a la política de contenido editorial de AdSense que sí aplica a `StickyAdBar`.
- **Sí:** el prompt de instalación tiene prioridad sobre `StickyAdBar` — evita apilar dos franjas fijas en la parte inferior de la pantalla; se prefirió ocultar el ad bar temporalmente en vez de apilarlos verticalmente (que degradaría la experiencia y reduciría el espacio de contenido visible).
- **Sí:** cooldown de 7 días en `localStorage` tras "Ahora no"/cerrar — sobrevive a cerrar el navegador (a diferencia de `sessionStorage`, usado por `StickyAdBar`), evitando ser tan insistente como para reaparecer en cada sesión, pero sin desaparecer para siempre.
- **Sí:** 3 casos explícitos de plataforma (nativo vía `beforeinstallprompt`, iOS Safari vía instrucciones manuales, no soportado → oculto) — cubre Android/desktop Chrome/Edge e iOS Safari (la gran mayoría de instalaciones reales), sin intentar soportar cada navegador exótico.
- **Sí:** un solo componente `PwaInstallPrompt` responsive (banner mobile / toast desktop) en vez de dos componentes separados — mismo estado y lógica, evita duplicación, ya usado como patrón en la spec de Flashcards (`FlashcardArrowNav`/controles responsivos).
- **Sí:** `PwaIosInstructionsModal` reutiliza el `Modal` centrado compartido, no se construye un bottom-sheet nuevo — mismo criterio que se decidió en la spec de Flashcards (`FlashcardCardPicker`) para no duplicar patrones de UI solo por fidelidad visual a un mockup puntual.
- **Sí:** nuevo feature flag `pwaPromptEnabled` en el mismo sistema de `useFeatureFlags`/Admin ya existente — permite desactivar el banner remotamente sin deploy, igual que `adsEnabled`.
- **No:** no se modifica el manifest/Service Worker (`VitePWA` en `vite.config.js`) — ya está correctamente configurado y funcional; este spec es solo la capa de UI que invita a usar esa capacidad ya existente.
- **No:** no se implementan notificaciones push reales — el bullet "Recordatorios" del mockup es solo copy informativo sobre una capacidad futura de la PWA, no se implementa Web Push en este spec.
- **No:** no se agrega analítica GA4 de impresiones/clics/instalaciones en este spec — puede evaluarse como ampliación futura.

---

## Risks

| Riesgo | Mitigación |
|---|---|
| Detección de iOS vía `navigator.userAgent` es frágil (Apple no expone una API oficial de detección de plataforma para PWA; el user-agent puede cambiar entre versiones de iOS/Safari, y Chrome-en-iOS usa el motor de Safari pero no soporta instalación vía "Agregar a pantalla de inicio" de la misma forma). | Se excluye explícitamente Chrome-en-iOS del caso `'ios'` (via detección de `CriOS` en el user-agent) para no mostrar instrucciones que no aplican; se documenta como heurística best-effort, no 100% infalible — degradación aceptable: en el peor caso, un usuario en un navegador iOS no reconocido simplemente no ve el prompt (`platform = 'unsupported'`), no un flujo roto. |
| El evento `beforeinstallprompt` solo se dispara una vez por sesión de navegador y puede no dispararse si el usuario ya lo descartó antes a nivel de navegador (comportamiento propio de Chrome, fuera de nuestro control) — el prompt de CertZen podría aparecer sin que `deferredPrompt` esté disponible, dejando el botón "Instalar app" sin acción útil. | Si `platform === 'native'` pero `deferredPrompt` es `null` en el momento del click (evento no capturado a tiempo), el botón no hace nada visible — se documenta como hallazgo aceptado; el criterio de aceptación cubre el caso feliz (evento capturado), no la condición de carrera del navegador. |
| Ocultar `StickyAdBar` mientras el prompt PWA está visible reduce temporalmente los ingresos por publicidad para usuarios free en rutas con ads permitidos. | Aceptado explícitamente por decisión del usuario — el prompt de instalación es prioritario; el ad bar vuelve a aparecer en cuanto se descarta/instala. Impacto acotado por el cooldown de 7 días (no es una ocultación permanente). |
| QA manual de los 3 casos de plataforma (nativo/iOS/no soportado) no es trivial de reproducir de forma 100% fiel sin dispositivos reales (iPhone físico, Android físico) — DevTools solo simula parcialmente `beforeinstallprompt` y el user-agent. | Verificación documentada en el plan (pasos 1, 2, 7) usando las herramientas disponibles (DevTools Application/Manifest, user-agent override); se recomienda una pasada adicional en dispositivos reales antes de considerar el spec completamente verificado en producción. |
