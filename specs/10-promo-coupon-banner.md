# SPEC 10 — Banner promocional de cupón (WELCOME 50% OFF)

**Estado:** Implementado
**Dependencias:** Ninguna (usa `useFeatureFlags`/`AdminFlagsPage` ya existentes, no modifica el checkout de Dodo)
**Fecha:** 2026-07-28
**Objetivo:** Mostrar en `/` (WelcomePage) y `/home` (DashboardPage) un banner dismissible que anuncia un cupón de descuento, con contenido y audiencia (anónimos/free/Pro) editables desde Admin, dirigiendo al usuario a la página de Pricing.

---

## Alcance

**Dentro de alcance:**

- **`src/features/promo/components/PromoBanner.jsx`** (nueva feature): banner dismissible, mismo patrón visual de franja (top o bottom, a definir en implementación) que `StickyAdBar`/`PwaInstallPrompt`, con: título/texto, código de cupón destacado (ej. `WELCOME`), texto de botón CTA. Responsive (mobile/tablet/desktop), light/dark.
- **`src/features/promo/hooks/usePromoBanner.js`**: hook que combina `useFeatureFlags()` (flag `promoBannerEnabled` + contenido) con el estado de audiencia del usuario actual (anónimo / registrado free / Pro, vía `useAuthStore` + `useUserPlan`) y el dismiss en `sessionStorage`, y expone `shouldShow`.
- **Nuevos campos en `DEFAULT_FLAGS`** (`src/core/hooks/useFeatureFlags.js`), planos (mismo patrón que los flags existentes):
  - `promoBannerEnabled` (boolean) — apaga/prende el banner completo.
  - `promoBannerTitle` (string) — texto principal (ej. "¡Bienvenido! en tu primer mes de Pro").
  - `promoBannerCode` (string) — código del cupón mostrado en el badge tipo ticket (ej. `WELCOME`).
  - `promoBannerCtaText` (string) — texto del botón (ej. "Actualizar a Pro").
  - `promoBannerDiscountBadge` (string, opcional) — pill de descuento junto al código (ej. "50% OFF").
  - `promoBannerSubtitle` (string, opcional) — línea secundaria bajo el título (ej. "Usa el código al comprar el Plan Pro y ahorra ahora.").
  - `promoBannerUrgencyBadge` (string, opcional) — pill de urgencia junto al CTA (ej. "Solo 100 cupos").
  - `promoBannerShowAnonymous` / `promoBannerShowFree` / `promoBannerShowPro` (boolean, independientes) — controlan a qué audiencia se le muestra.
  - Diseño visual: franja con fondo degradado de marca (`bg-zen-brand-diag`, mismo indigo→violeta usado en el resto de la UI), badge de código estilo "ticket", pill de descuento en ámbar, pill de urgencia con ícono de fuego, botón CTA blanco con flecha, cierre en caja con borde — layout `justify-between` (contenido a la izquierda, acciones agrupadas a la derecha) para verse balanceado en cualquier ancho de pantalla.
- **Sección nueva en `AdminFlagsPage.jsx`**: además de los toggles existentes, un bloque con inputs de texto (título, código, texto CTA) y 3 checkboxes de audiencia, reutilizando el mismo `setDoc` a `featureFlags/global`.
- **Montaje**: `<PromoBanner />` visible únicamente en `/` (`WelcomePage`) y `/home` (`HomePage`, el home autenticado real — no `/dashboard`), montado desde `AppRouter.jsx` para respetar la regla de arquitectura "features/A no importa features/B".
- **CTA**: al hacer click, navega a la página de Pricing/Upgrade existente (donde el usuario continúa al checkout de Dodo y escribe el código manualmente).
- **Dismiss**: botón cerrar (X), persistido en `sessionStorage` — no reaparece hasta una nueva sesión de navegador, igual que `StickyAdBar`.
- **Reutilizable para futuras promos/anuncios**: como todo el contenido (texto, código, audiencia) es editable desde Admin sin tocar código, el mismo flag/banner sirve para futuras campañas simplemente cambiando los valores en Admin.

**Fuera de alcance:**

- **Creación/gestión del cupón `WELCOME` en Dodo Payments** — ya lo hizo el usuario manualmente en el dashboard de Dodo; esta spec no toca `functions/index.js` ni el flujo de checkout.
- **Enforcement real del límite de 100 redenciones** — no hay contador en Firestore ni validación server-side; "100 cupos" es solo copy editable en el título/texto, sin lógica de conteo.
- **Aplicar el código automáticamente en el checkout** (prefill/URL param hacia Dodo) — el usuario lo escribe manualmente en el formulario de Dodo.
- **Contenido multi-idioma** — el texto que el admin escribe es un único string (no pasa por catálogos i18n/lingui); se muestra igual sin importar el locale del usuario. Si se necesita traducción por idioma, queda para un spec futuro.
- **Otras rutas públicas** (páginas de certificaciones individuales, etc.) — el banner solo vive en `/` y `/home`.
- **Página de Admin dedicada** — se integra como sección dentro de `AdminFlagsPage.jsx` existente, no se crea una ruta/página nueva.
- **Analítica GA4 nueva** (impresiones/clics del banner) — puede evaluarse en spec futuro.

---

## Modelo de datos

No se crean colecciones nuevas en Firestore. Se agregan **10 campos planos** al documento existente `featureFlags/global` (mismo patrón que `pwaPromptEnabled`/`adsEnabled`) y **una clave** de `sessionStorage`.

**Firestore — `featureFlags/global`** (documento ya existente, gestionado por `useFeatureFlags`/`DEFAULT_FLAGS`):

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `promoBannerEnabled` | `boolean` | `false` | Si es `false`, `PromoBanner` nunca se monta, sin importar audiencia o ruta. |
| `promoBannerTitle` | `string` | `''` | Texto principal del banner (ej. "¡Bienvenido! en tu primer mes de Pro"). |
| `promoBannerCode` | `string` | `''` | Código del cupón mostrado en el badge tipo ticket (ej. `WELCOME`). |
| `promoBannerCtaText` | `string` | `'Actualizar a Pro'` | Texto del botón CTA. |
| `promoBannerDiscountBadge` | `string` | `''` | Pill de descuento junto al código (ej. "50% OFF"). Opcional — si está vacío, no se renderiza el pill. |
| `promoBannerSubtitle` | `string` | `''` | Línea secundaria bajo el título (ej. "Usa el código al comprar el Plan Pro y ahorra ahora."). Opcional. |
| `promoBannerUrgencyBadge` | `string` | `''` | Pill de urgencia junto al CTA (ej. "Solo 100 cupos"). Opcional, oculto en mobile por espacio. |
| `promoBannerShowAnonymous` | `boolean` | `true` | Muestra el banner a usuarios anónimos (no autenticados). |
| `promoBannerShowFree` | `boolean` | `true` | Muestra el banner a usuarios registrados en plan free. |
| `promoBannerShowPro` | `boolean` | `false` | Muestra el banner a usuarios en plan Pro. |

No requiere cambios en `firestore.rules` (el doc `featureFlags/global` ya tiene lectura pública / escritura solo-admin, gestionada por specs previos).

**`sessionStorage` (por pestaña/sesión de navegador):**

| Clave | Tipo | Descripción |
|---|---|---|
| `promo-banner-dismissed` | `'1'` (flag simple) | Se escribe al pulsar el botón cerrar (X). Si existe, el banner no se muestra el resto de la sesión actual. Se limpia automáticamente al cerrar el navegador/pestaña (comportamiento nativo de `sessionStorage`), igual que `StickyAdBar`. |

**Estado derivado en memoria (`usePromoBanner.js`, sin persistencia propia):**

| Estado | Tipo | Descripción |
|---|---|---|
| `audience` | `'anonymous' \| 'free' \| 'pro'` | Derivado directamente de `useAuthStore` (¿hay `user`?, ¿`isPro`?) — no se usa `useUserPlan` para evitar un query extra de Firestore innecesario para este propósito. |
| `shouldShow` | `boolean` | Combina `flags.promoBannerEnabled`, el flag de audiencia correspondiente (`promoBannerShowAnonymous/Free/Pro`), que `promoBannerTitle`/`promoBannerCode` no estén vacíos, y que no exista `promo-banner-dismissed` en `sessionStorage`. |

---

## Plan de implementación

1. **`src/core/hooks/useFeatureFlags.js`.** Agregar los 10 campos nuevos a `DEFAULT_FLAGS` con sus defaults. No requiere cambios en el hook en sí (el merge `{...DEFAULT_FLAGS, ...snap.data()}` ya soporta campos nuevos). Test manual: confirmar en consola que `flags.promoBannerEnabled` existe y es `false` por default sin tocar Firestore.

2. **`src/features/promo/hooks/usePromoBanner.js`.** Nuevo hook: lee `useFeatureFlags()` y `useAuthStore()` (`user`, `isPro`) para derivar `audience`. Calcula `shouldShow` combinando flag maestro, flag de audiencia correspondiente, que `title`/`code` no estén vacíos, y ausencia de `promo-banner-dismissed` en `sessionStorage`. Expone `{ shouldShow, title, code, ctaText, discountBadge, subtitle, urgencyBadge, dismiss() }`. `dismiss()` escribe `sessionStorage.setItem('promo-banner-dismissed', '1')`. Test manual: en consola del navegador, togglear `promoBannerEnabled`/audiencia en Firestore y confirmar que `shouldShow` reacciona en vivo (via `onSnapshot`).

3. **`src/features/promo/components/PromoBanner.jsx`.** Consume `usePromoBanner()`. Si `!shouldShow`, retorna `null`. Franja superior en flujo normal (no `fixed`) con fondo degradado `bg-zen-brand-diag`: badge tipo ticket con el código, pill de descuento (si hay), título + subtítulo (si hay), pill de urgencia (si hay, oculto en mobile), botón CTA blanco con flecha (navega a `/pricing` vía `GlassButton to`) y botón cerrar en caja con borde que llama `dismiss()`. Layout `justify-between` (contenido a la izquierda, acciones agrupadas a la derecha) para verse balanceado en cualquier ancho. Responsive (mobile/tablet/desktop). Test manual: 390/768/1440px, confirmar que aparece/desaparece correctamente y que el CTA navega a Pricing.

4. **Montaje condicionado a `/` y `/home`.** Debido a la regla de arquitectura "`features/A` no puede importar `features/B`" (`src/CLAUDE.md`), `<PromoBanner />` NO se importa directamente en `WelcomePage`/`HomePage` — se monta una única vez desde `src/core/router/AppRouter.jsx` vía un componente `PromoBannerSlot` (usa `useLocation()`, renderiza solo si `pathname === '/' || pathname === '/home'`), mismo patrón de composición cross-feature que `StickyAdBar`/`PwaInstallPrompt`. Nota: el "home autenticado" es la ruta `/home` (componente `HomePage`), no `/dashboard` (`DashboardPage`) — corrección respecto a la redacción original de este plan. Test manual: navegar a `/` y `/home` y confirmar que aparece en ambas; navegar a cualquier otra ruta (ej. `/exam`, `/dashboard`, `/pricing`) y confirmar que no aparece.

5. **`src/features/admin/pages/AdminFlagsPage.jsx`.** Agregar una sección nueva (debajo de la lista de `FLAG_META` existente) con: 6 inputs de texto controlados (título, código, texto CTA, badge de descuento, subtítulo, badge de urgencia — los últimos 3 opcionales) + 3 checkboxes de audiencia (anónimos/free/Pro) + el toggle maestro `promoBannerEnabled` (sumado a `FLAG_META` como un booleano más, ya que sigue el mismo patrón). Mismo botón "Guardar" / `setDoc` ya existente, extendiendo el objeto `draft` para incluir los campos nuevos. Test manual: desde Admin, editar todos los campos y audiencia, guardar, y confirmar en `/` y `/home` (en pestañas con distinta sesión: anónima, free, Pro) que el banner respeta el contenido y la audiencia configurada.

6. **Verificación final.** `npm run build`, `npx eslint src` sin errores. Prueba manual completa: los 3 casos de audiencia (anónimo, free, Pro) combinados individualmente y en conjunto, dismiss + confirmar que no reaparece en la misma sesión pero sí en una pestaña nueva, flag maestro apagado/encendido, y que `title`/`code` vacíos ocultan el banner aunque el flag esté en `true` (evita mostrar un banner en blanco si el admin olvida llenar el contenido).

---

## Criterios de aceptación

- [x] Con `promoBannerEnabled: true` y `promoBannerShowAnonymous: true`, un usuario no autenticado ve el banner en `/`.
- [x] Con `promoBannerEnabled: true` y `promoBannerShowFree: true`, un usuario registrado en plan free ve el banner en `/home`.
- [x] Con `promoBannerEnabled: true` y `promoBannerShowPro: false` (default), un usuario Pro NO ve el banner en `/home`.
- [x] Con `promoBannerShowPro: true`, un usuario Pro SÍ ve el banner en `/home`.
- [x] Con `promoBannerEnabled: false`, el banner no aparece en ninguna ruta ni para ninguna audiencia.
- [x] El banner no aparece en rutas distintas a `/` y `/home` (ej. `/exam/...`, `/results/...`).
- [x] El banner muestra el `title`, `code` y `ctaText` configurados en Admin, y se actualiza sin necesidad de deploy (solo refrescar/recibir el `onSnapshot`).
- [x] Si `promoBannerTitle` o `promoBannerCode` están vacíos, el banner no se renderiza aunque `promoBannerEnabled` esté en `true`.
- [x] Al hacer click en el botón CTA, el usuario es llevado a la página de Pricing/Upgrade existente.
- [x] Al pulsar el botón cerrar (X), el banner desaparece y no vuelve a mostrarse durante la misma sesión de navegador (misma pestaña/ventana sin cerrar).
- [x] Al abrir una pestaña nueva (nueva sesión de `sessionStorage`), el banner vuelve a evaluarse desde cero (reaparece si las condiciones se cumplen).
- [x] Desde Admin → Feature Flags, se puede editar título, código, texto CTA, badge de descuento, subtítulo, badge de urgencia y los 3 checkboxes de audiencia, guardar, y ver el cambio reflejado en `/` y `/home`.
- [x] Los campos opcionales (badge de descuento, subtítulo, badge de urgencia) no se renderizan cuando están vacíos, sin romper el layout.
- [x] El layout es responsive y legible en mobile (390px), tablet (768px) y desktop (1440px), en modo claro y oscuro.
- [x] `npm run build` pasa sin errores.
- [x] `npx eslint src` sin errores ni warnings.

---

## Decisiones tomadas y descartadas

- **Sí:** contenido (título, código, CTA) y audiencia editables desde Admin, sin tocar código — decisión explícita del usuario para reutilizar el mismo banner en futuras promos/anuncios sin necesitar un deploy nuevo cada vez.
- **Sí:** 3 checkboxes de audiencia independientes (anónimos/free/Pro), combinables libremente, en vez de un selector exclusivo — permite casos como "solo anónimos + free" (excluir Pro) sin forzar una única categoría.
- **Sí:** sección nueva dentro de `AdminFlagsPage.jsx` existente, no una página admin dedicada — mismo patrón ya usado para todos los flags, evita fragmentar el panel admin por una sola feature.
- **Sí:** dismiss con `sessionStorage` (no `localStorage`) — el banner debe poder "resetearse" fácilmente entre sesiones para reaparecer con frecuencia mientras la promo esté activa, distinto del caso de `PwaInstallPrompt` (cooldown largo de 7 días) porque aquí se prioriza visibilidad de la promo sobre no ser insistente.
- **Sí:** montaje vía `PromoBannerSlot` en `AppRouter.jsx` (allow-list de `/` y `/home` con `useLocation`), no importado directamente en `WelcomePage`/`HomePage` — respeta la regla "`features/A` no puede importar `features/B`" de `src/CLAUDE.md`; mismo patrón de composición cross-feature que `StickyAdBar`/`PwaInstallPrompt`. Ajuste sobre el plan original (que decía "montar en WelcomePage y DashboardPage" directamente), decidido junto al usuario durante la implementación al detectar el conflicto de arquitectura.
- **Sí:** el "home autenticado" es la ruta `/home` (`HomePage`), no `/dashboard` (`DashboardPage`) — corrección de un error en la redacción original de esta spec, confirmada con el usuario durante la implementación.
- **Sí:** `usePromoBanner` deriva audiencia solo de `useAuthStore` (`user`, `isPro`), sin `useUserPlan` — evita un query adicional de Firestore (conteo de exámenes del mes) que no aporta nada a esta feature, ya que `isPro` ya está disponible en el store de auth.
- **Sí:** fondo con gradiente de marca (`bg-zen-brand-diag`) en vez de superficie glass neutra — decisión de diseño tomada con el usuario tras dos iteraciones: la superficie glass (`bg-glass-light-3`) se veía plana porque el banner se monta fuera de `PageBackground` (sin los orbes/gradiente detrás que hacen funcionar el efecto glass en el resto de la app); el degradado de marca es autocontenido y no depende de ese contexto.
- **Sí:** se agregaron 3 campos opcionales (`promoBannerDiscountBadge`, `promoBannerSubtitle`, `promoBannerUrgencyBadge`) no contemplados en el diseño original de datos — pedido explícito del usuario con un mockup de referencia (pill de descuento en ámbar, subtítulo, pill de urgencia con ícono de fuego), para reflejar más fielmente el diseño visual deseado sin hardcodear esas piezas de copy en el componente.
- **No:** no se crea ni gestiona el cupón `WELCOME` en Dodo Payments — ya lo hizo el usuario manualmente en el dashboard de Dodo; el checkout sigue sin cambios, el usuario escribe el código a mano.
- **No:** no se implementa un contador/límite real de "primeros 100 cupos" en Firestore — es solo copy editable por el admin (ej. dentro del título), sin enforcement server-side. Si se necesita en el futuro, es un spec aparte (requeriría una Cloud Function con transacción atómica).
- **No:** no se aplica el código automáticamente en el checkout (prefill hacia Dodo) — fuera de alcance, el usuario lo escribe manualmente en el formulario de Dodo.
- **No:** no se traduce el contenido del banner vía catálogos i18n/lingui — es un único string ingresado por el admin, igual para todos los locales. Justificado porque el contenido cambia por campaña (no es UI fija de la app) y traducir cada promo manualmente añadiría fricción operativa no pedida.
- **No:** no se agrega analítica GA4 de impresiones/clics en este spec — puede evaluarse como ampliación futura.

---

## Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| El admin activa `promoBannerEnabled` pero olvida configurar audiencia (los 3 checkboxes en `false`) o deja `title`/`code` vacíos, dejando el banner "encendido" pero invisible para todos, sin aviso claro de por qué no aparece. | El criterio de aceptación cubre el caso de campos vacíos ocultando el banner; se documenta como comportamiento esperado (fail-safe: nunca se muestra un banner en blanco), no como bug. Puede mitigarse a futuro con un preview en el propio Admin (fuera de alcance de este spec). |
| El código de cupón mostrado en el banner no coincide con el configurado realmente en Dodo Payments (son dos sistemas desacoplados: el copy vive en `featureFlags/global`, el cupón real vive en Dodo) — un typo en Admin muestra un código que no existe o no aplica el descuento. | Aceptado explícitamente: esta spec no valida el código contra Dodo. Responsabilidad operativa del admin al configurar el texto; queda documentado como limitación conocida. |
| `sessionStorage` se limpia fácil (nueva pestaña, modo incógnito nuevo, distinto navegador), por lo que un usuario puede ver el banner reaparecer varias veces en poco tiempo si navega entre pestañas — puede sentirse repetitivo. | Decisión explícita del usuario (priorizar visibilidad de la promo); documentado en la sección de Decisiones. Si se vuelve un problema, ajustar a `localStorage` con cooldown corto es un cambio menor en `usePromoBanner.js`. |
| Al reutilizar este mismo banner/flag para futuras promos, si dos promos se solapan en el tiempo (ej. equipo olvida apagar `promoBannerEnabled` antes de lanzar la siguiente con contenido distinto), no hay historial ni versión de "promos pasadas" — solo existe el estado actual en `featureFlags/global`. | Aceptado: el modelo es de "una promo activa a la vez", consistente con el pedido del usuario (feature flag simple para prender/apagar). Múltiples promos simultáneas o programadas quedan fuera de alcance — spec futuro si se necesita. |
