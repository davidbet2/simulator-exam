# SPEC 11 — Buzón de sugerencias (FAB + envío por correo)

> **Estado:** Aprobado
> **Dependencias:** SPEC 10 (patrón de feature flags en `featureFlags/global`, mismo `AdminFlagsPage.jsx`); reutiliza el patrón de `sendContactEmail` (Resend) en `functions/index.js`
> **Fecha:** 2026-07-29
> **Objetivo:** Agregar un botón flotante (FAB) visible solo en la app autenticada (excluyendo el examen en curso) que abre un formulario de sugerencia (texto libre + rating opcional de 5 estrellas), guarda la sugerencia en Firestore, la envía por correo al admin vía Resend, y respeta un rate limit de 5 minutos por usuario y un toggle en Admin.

---

## Alcance

**Dentro de alcance:**

- **`src/features/suggestions/components/SuggestionFab.jsx`** (nueva feature): botón flotante (FAB), posición fija (ej. esquina inferior, a definir en implementación evitando colisión con `StickyAdBar`/`PwaInstallPrompt`), ícono de bombilla/mensaje, abre un modal al hacer click. Responsive (mobile/tablet/desktop), light/dark, touch target ≥44x44px.
- **`src/features/suggestions/components/SuggestionModal.jsx`**: formulario con textarea de sugerencia (requerido, min/max longitud), selector de 5 estrellas (opcional), botón enviar, estados de loading/éxito/error, mensaje de confirmación tras enviar.
- **`src/features/suggestions/hooks/useSuggestionBox.js`**: combina `useFeatureFlags()` (flag `suggestionsBoxEnabled`) + `useAuthStore()` (requiere `user`) para exponer `shouldShow`. Maneja el cooldown de UX (deshabilita el botón de envío mostrando un mensaje si el usuario envió una sugerencia hace menos de 5 minutos, usando el `createdAt` devuelto por la última llamada exitosa) — la validación real y autoritativa del cooldown ocurre server-side en la Cloud Function.
- **Nuevo campo en `DEFAULT_FLAGS`** (`src/core/hooks/useFeatureFlags.js`): `suggestionsBoxEnabled` (boolean, default `false`) — apaga/prende el FAB completo, mismo patrón que `promoBannerEnabled`.
- **Nueva colección Firestore `suggestions/{suggestionId}`**: cada documento con `uid`, `email` (tomado del token de auth, no del formulario), `message`, `rating` (nullable), `createdAt` (server timestamp). Escritura únicamente vía la Cloud Function (no `setDoc` directo desde el cliente), para poder validar y aplicar el rate limit server-side de forma confiable.
- **`functions/index.js` — nueva función `sendSuggestionEmail`** (`onCall`, reutilizando el secreto `CONTACT_EMAIL` ya configurado y `RESEND_SECRET`): requiere `context.auth` (rechaza llamadas anónimas), valida `message` (longitud) y `rating` (entero 1–5 o `null`), consulta Firestore por la última sugerencia de ese `uid` y rechaza con `resource-exhausted` si fue hace menos de 5 minutos, escribe el documento en `suggestions/`, y envía el correo a `CONTACT_EMAIL` vía Resend (mismo formato HTML que `sendContactEmail`).
- **`firestore.rules`**: reglas para `suggestions/{id}` — sin `allow create/update/delete` desde el cliente (todo pasa por la Cloud Function con Admin SDK, que no está sujeta a `firestore.rules`); `allow read, list: if isAdmin()` para poder auditar manualmente vía Firebase Console.
- **Sección nueva en `AdminFlagsPage.jsx`**: toggle `suggestionsBoxEnabled` agregado a `FLAG_META`, mismo patrón que los demás flags booleanos.
- **Montaje condicionado**: `<SuggestionFab />` se monta desde `AppRouter.jsx` vía un slot (mismo patrón que `PromoBannerSlot`), visible únicamente cuando hay `user` autenticado (`useAuthStore`) **y** la ruta actual no empieza con `/exam` (para no distraer durante un examen en curso con timer). Sí visible en resultados, revisión, dashboard, flashcards, mis sets, admin.
- **i18n**: todos los strings nuevos (labels, placeholder, botones, mensajes de error/éxito) usan macros de `lingui` (`t`/`Trans`) igual que el resto de la app, y se agregan/traducen en los 8 catálogos de locale existentes (siguiendo el mismo esfuerzo de SPEC 09).

**Fuera de alcance:**

- **Soporte para usuarios anónimos** — el FAB solo se muestra y funciona con sesión iniciada.
- **FAB en páginas públicas** (`/`, `/pricing`, `/explore`, páginas de certificación individuales) — solo vive en la app autenticada.
- **FAB durante un examen activo** (`ExamPage`) — excluido explícitamente para no distraer durante el timer.
- **Panel de Admin para listar/gestionar sugerencias** — por ahora Firestore es solo respaldo consultable vía Firebase Console; una vista in-app queda para un spec futuro si se necesita triage.
- **Reacciones tipo emoji o encuesta NPS multi-pregunta** — se descartó a favor de texto libre + 5 estrellas opcional.
- **Analítica GA4 de aperturas/envíos del FAB** — puede evaluarse en spec futuro.
- **Edición o eliminación de una sugerencia ya enviada** — el formulario es de un solo envío, sin historial visible para el usuario que la mandó.

---

## Modelo de datos

**Firestore — nueva colección `suggestions/{suggestionId}`** (documento generado con ID automático, creado únicamente por la Cloud Function vía Admin SDK):

| Campo | Tipo | Descripción |
|---|---|---|
| `uid` | `string` | UID del usuario autenticado que envía la sugerencia (tomado de `context.auth.uid`, nunca del body). |
| `email` | `string` | Email del usuario (tomado de `context.auth.token.email`, no editable desde el formulario). |
| `message` | `string` | Texto de la sugerencia (min 10, max 1000 caracteres). |
| `rating` | `number \| null` | Entero 1–5 si el usuario seleccionó estrellas, `null` si lo dejó vacío. |
| `createdAt` | `Timestamp` | Server timestamp (`FieldValue.serverTimestamp()`), usado también para el cálculo del cooldown. |

**`DEFAULT_FLAGS`** (`src/core/hooks/useFeatureFlags.js`) — un campo nuevo, mismo patrón plano que los flags existentes:

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `suggestionsBoxEnabled` | `boolean` | `false` | Si es `false`, `SuggestionFab` nunca se monta. |

**Estado derivado en memoria (`useSuggestionBox.js`, sin persistencia propia):**

| Estado | Tipo | Descripción |
|---|---|---|
| `shouldShow` | `boolean` | Combina `flags.suggestionsBoxEnabled`, `user` autenticado, y que la ruta actual no empiece con `/exam`. |
| `cooldownUntil` | `number \| null` | Timestamp local (en memoria/`sessionStorage`) calculado a partir de la respuesta de la última llamada exitosa a `sendSuggestionEmail`; usado solo para deshabilitar el botón de envío en la UI antes de intentar (mejor UX), no como validación de seguridad. |

---

## Plan de implementación

1. **`firestore.rules`.** Agregar bloque `match /suggestions/{id}` con `allow read, list: if isAdmin();` y sin `allow create/update/delete` (todo pasa por Admin SDK en la Cloud Function, que ignora `firestore.rules`). Test manual: `firebase deploy --only firestore:rules` sin errores de sintaxis.

2. **`src/core/hooks/useFeatureFlags.js`.** Agregar `suggestionsBoxEnabled: false` a `DEFAULT_FLAGS`. Test manual: confirmar en consola que `flags.suggestionsBoxEnabled` existe y es `false` por default sin tocar Firestore.

3. **`functions/index.js` — `sendSuggestionEmail`.** Nueva función `onCall` (secrets: `RESEND_SECRET`, `CONTACT_EMAIL`). Rechaza si `context.auth` es `null` (`unauthenticated`). Valida `message` (10–1000 chars) y `rating` (entero 1–5 o `null`, `invalid-argument` si no). Consulta `suggestions` por `uid == context.auth.uid` ordenado por `createdAt desc` límite 1; si el último es de hace menos de 5 minutos, lanza `resource-exhausted`. Escribe el documento nuevo con `FieldValue.serverTimestamp()`. Envía correo a `CONTACT_EMAIL` vía Resend (mismo formato HTML que `sendContactEmail`, incluyendo `email` del usuario, `rating` si existe, y el `message`). Retorna `{ ok: true, createdAt }`. Test manual: invocar la función desde la consola de Firebase Functions con un `uid` de prueba, confirmar que crea el documento, envía el correo, y que una segunda llamada inmediata falla con `resource-exhausted`.

4. **Índice compuesto Firestore.** Agregar a `firestore.indexes.json` el índice compuesto `suggestions (uid ASC, createdAt DESC)` requerido por la query del paso 3. Test manual: `firebase deploy --only firestore:indexes`, confirmar que la query de la función no falla por índice faltante.

5. **`src/features/suggestions/hooks/useSuggestionBox.js`.** Nuevo hook: `shouldShow` (flag + `user` + ruta no empieza con `/exam`, vía `useLocation`), `submit({ message, rating })` que llama a la Cloud Function (`httpsCallable`), maneja loading/error, y guarda `cooldownUntil` en memoria tras un envío exitoso para deshabilitar el botón de envío en la UI. Test manual: togglear `suggestionsBoxEnabled` en Firestore y confirmar que `shouldShow` reacciona en vivo.

6. **`src/features/suggestions/components/SuggestionModal.jsx`.** Formulario controlado: textarea (contador de caracteres, validación 10–1000), 5 estrellas clicables (opcional), botón enviar (deshabilitado durante loading o cooldown activo), mensajes de error (traduciendo los códigos `unauthenticated`/`invalid-argument`/`resource-exhausted` a texto amigable) y de éxito. Todos los strings vía `t`/`Trans` de lingui. Responsive, light/dark. Test manual: enviar una sugerencia válida, confirmar mensaje de éxito y que el formulario se cierra o resetea; probar validaciones de longitud y el mensaje de cooldown en un segundo intento inmediato.

7. **`src/features/suggestions/components/SuggestionFab.jsx`.** Botón flotante que abre `SuggestionModal`. Si `!shouldShow`, retorna `null`. Posicionado para no colisionar con `StickyAdBar`/`PwaInstallPrompt` (ajustar `bottom`/`right` según qué otros componentes estén montados). Test manual: 390/768/1440px, confirmar que no se superpone con otros FABs/banners existentes.

8. **Montaje en `AppRouter.jsx`.** Componente `SuggestionFabSlot` (mismo patrón que `PromoBannerSlot`): usa `useLocation()` y `useAuthStore()`, renderiza `<SuggestionFab />` solo si hay `user` y `!pathname.startsWith('/exam')`. Test manual: navegar a `/results/...`, `/dashboard`, `/admin` y confirmar que aparece; navegar a `/exam/...` y a rutas públicas sin sesión y confirmar que no aparece.

9. **`src/features/admin/pages/AdminFlagsPage.jsx`.** Agregar `suggestionsBoxEnabled` a `FLAG_META` (mismo patrón que los demás toggles booleanos). Test manual: togglear desde Admin, guardar, confirmar que el FAB aparece/desaparece en otra pestaña con sesión activa.

10. **i18n.** Ejecutar `npm run i18n:extract` para capturar los strings nuevos, traducir los `msgstr` vacíos en los 8 catálogos (`es` se autogenera), ejecutar `npm run i18n:compile`. Test manual: cambiar el idioma de la app y confirmar que el modal se ve traducido.

11. **Verificación final.** `npm run build`, `npx eslint src` sin errores. Prueba manual completa: envío con y sin rating, cooldown de 5 minutos, flag apagado/encendido, FAB ausente en `/exam` y en rutas públicas/sin sesión, correo recibido en `CONTACT_EMAIL` con el formato correcto, documento visible en Firestore Console.

---

## Criterios de aceptación

- [ ] Con `suggestionsBoxEnabled: true` y sesión iniciada, el FAB aparece en `/results/...`, `/review/...`, `/dashboard`, `/home`, `/admin` y páginas de flashcards/mis sets.
- [ ] El FAB NO aparece en `/exam/...` (examen en curso), aunque el flag esté en `true` y haya sesión.
- [ ] El FAB NO aparece en rutas públicas (`/`, `/pricing`, `/explore`, páginas de certificación) ni sin sesión iniciada.
- [ ] Con `suggestionsBoxEnabled: false`, el FAB no aparece en ninguna ruta.
- [ ] Al hacer click en el FAB se abre el modal con textarea y selector de 5 estrellas (rating opcional).
- [ ] Enviar el formulario con un mensaje de menos de 10 caracteres muestra un error de validación y no llama a la Cloud Function.
- [ ] Enviar el formulario con un mensaje válido (10–1000 caracteres), con o sin rating, crea un documento en `suggestions/` con `uid`, `email`, `message`, `rating` y `createdAt` correctos.
- [ ] Cada envío exitoso dispara un correo a la dirección configurada en `CONTACT_EMAIL` con el `message`, `rating` (si existe) y `email` del usuario.
- [ ] Enviar una segunda sugerencia antes de que pasen 5 minutos desde la última es rechazado (`resource-exhausted`) y el usuario ve un mensaje explicando el cooldown.
- [ ] Pasados los 5 minutos, el usuario puede enviar una nueva sugerencia sin problema.
- [ ] Un usuario no autenticado no puede invocar `sendSuggestionEmail` exitosamente (rechazo `unauthenticated`).
- [ ] Un usuario con rol admin puede leer la colección `suggestions` desde Firebase Console/reglas (`isAdmin()`), un usuario no-admin no puede leer ni listar la colección directamente desde el cliente.
- [ ] Desde Admin → Feature Flags, se puede togglear `suggestionsBoxEnabled`, guardar, y ver el cambio reflejado en el FAB sin deploy.
- [ ] El modal y el FAB son responsive y legibles en mobile (390px), tablet (768px) y desktop (1440px), en modo claro y oscuro, sin superponerse con `StickyAdBar`/`PwaInstallPrompt`.
- [ ] Todos los strings del FAB/modal están traducidos en los 8 locales (sin `msgstr ""` nuevos vacíos en los catálogos tocados).
- [ ] `npm run build` pasa sin errores.
- [ ] `npx eslint src` sin errores ni warnings.

---

## Decisiones tomadas y descartadas

- **Sí:** FAB flotante persistente, no franja global ni página dedicada — decisión explícita del usuario para no interrumpir el flujo y estar disponible bajo demanda en cualquier momento dentro de la app autenticada.
- **Sí:** texto libre + rating opcional de 5 estrellas, sin categoría ni NPS — prioriza baja fricción y velocidad de respuesta sobre estructuración del dato.
- **Sí:** reutilizar el patrón exacto de `sendContactEmail` (Resend + `onCall` + `CONTACT_EMAIL`) para `sendSuggestionEmail` — cero infraestructura nueva, mismo secreto ya configurado, consistente con el único canal de email transaccional que ya existe en el proyecto.
- **Sí:** requiere sesión iniciada (no soporta anónimos) — permite tomar `email`/`uid` directamente del token de auth sin pedirlos a mano, y reduce superficie de spam sin necesidad de captcha adicional.
- **Sí:** guardado en Firestore (`suggestions/`) además del correo — evita depender únicamente del inbox como fuente de verdad; sirve de backlog consultable manualmente vía Firebase Console.
- **Sí:** la escritura en Firestore ocurre solo desde la Cloud Function (Admin SDK), no `setDoc` directo del cliente — es el único punto donde se puede validar y aplicar el rate limit de forma confiable; un `create` client-side con reglas de Firestore no podría consultar "¿cuándo fue la última sugerencia de este uid?" de forma atómica y segura.
- **Sí:** rate limit de 5 minutos, validado server-side en la Cloud Function (fuente de verdad) y reflejado optimistamente en el cliente vía `cooldownUntil` en memoria — balance entre feedback inmediato en la UI y seguridad real contra spam.
- **Sí:** toggle `suggestionsBoxEnabled` en Admin, mismo patrón que `promoBannerEnabled` — permite apagar el FAB sin deploy si hay abuso o el equipo no quiere feedback activo en cierto momento.
- **Sí:** excluir `ExamPage` (`/exam/...`) del montaje del FAB — no distraer durante un examen cronometrado, consistente con la razón de ser del feature (recoger sugerencias, no interrumpir el "producto principal").
- **Sí:** todos los strings nuevos pasan por lingui y se traducen a los 8 locales en esta misma spec — consistente con que el resto de la UI de la app usa i18n de forma pervasiva; dejarlo sin traducir generaría deuda inmediata (similar al gap que cerró SPEC 09).
- **No:** panel de Admin para listar/gestionar sugerencias in-app — Firebase Console + el correo ya cubren la necesidad inmediata; construir una vista dedicada es esfuerzo no pedido explícitamente y puede evaluarse como spec futuro si el volumen lo justifica.
- **No:** soporte para usuarios anónimos — fuera de alcance, decisión explícita del usuario.
- **No:** reacciones tipo emoji o encuesta NPS multi-pregunta — se descartó a favor de texto libre + estrellas por simplicidad.
- **No:** analítica GA4 de aperturas/envíos del FAB — puede evaluarse en spec futuro si se necesita medir adopción.

---

## Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| La query de cooldown (`uid == X` ordenado por `createdAt desc`) requiere un índice compuesto en Firestore; si no se despliega, la Cloud Function falla en producción con `FAILED_PRECONDITION`. | Paso explícito en el plan de implementación (`firestore.indexes.json` + `firebase deploy --only firestore:indexes`) antes de dar la función por terminada. |
| Un usuario podría intentar spamear cambiando de pestaña/dispositivo para evadir el `cooldownUntil` en memoria del cliente. | Aceptado: el cooldown real vive server-side en la Cloud Function (consulta a Firestore por `uid`), no en el cliente — evadir la UI no evade la validación autoritativa. |
| El correo a `CONTACT_EMAIL` se mezcla con los mensajes de `sendContactEmail` (soporte) en la misma bandeja, dificultando el triage si el volumen de sugerencias crece. | Aceptado explícitamente por el usuario (mismo secreto, sin separar bandejas); el asunto del correo (`[CertZen Sugerencia] ...`) permite filtrar por asunto en el cliente de correo. Separar en un secreto propio (`SUGGESTIONS_EMAIL`) es un cambio menor si se necesita después. |
| Sin panel de Admin in-app, revisar el backlog de `suggestions/` requiere entrar a Firebase Console manualmente — fricción operativa si el volumen crece. | Aceptado como parte del alcance reducido de esta spec; el correo sigue siendo la vía principal de notificación en tiempo real, Firestore es respaldo. |
