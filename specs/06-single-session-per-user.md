# SPEC 06 — Sesión única por usuario (cerrar sesión anterior al detectar una nueva)

> **Status:** Implementado
haz > **Depends on:** —
> **Date:** 2026-07-27
> **Objective:** Impedir que un usuario tenga más de una sesión activa simultánea (por dispositivo/navegador) en la app autenticada, cerrando automáticamente la sesión anterior en tiempo real cuando se detecta un nuevo login.

---

## Scope

**In:**

- **`src/core/store/useAuthStore.js`**:
  - Generar un `sessionId` único (`crypto.randomUUID()`) en cada login exitoso: `login()` (email/password), `loginWithGoogle()` y `register()`.
  - Persistir ese `sessionId` en `localStorage` (clave `certzen-session-id`) de forma síncrona, y escribirlo en `users/{uid}.activeSessionId` en Firestore (mismo `setDoc`/`updateDoc` que ya escribe el perfil en cada flujo).
  - Extender el listener `onSnapshot(doc(db, 'users', uid))` ya existente (dentro de `init()`) para comparar `profile.activeSessionId` contra el valor actual de `localStorage.getItem('certzen-session-id')` en cada snapshot **no proveniente de caché** (`snap.metadata.fromCache === false`).
  - Si hay mismatch (ambos valores existen y son distintos): ejecutar `signOut(auth)` y setear un mensaje dedicado (nuevo campo de store, ver Decisions) indicando que la sesión se cerró por un nuevo inicio de sesión en otro dispositivo.
  - Si `activeSessionId` no existe en el doc (usuario pre-deploy) o `localStorage` no tiene `certzen-session-id` (sesión pre-deploy en este dispositivo): no se dispara ningún logout — se trata como "sin control aún" hasta el próximo login.
  - `logout()`: además de `signOut(auth)`, limpia `activeSessionId` en Firestore (`updateDoc` a `null`) y borra la clave de `localStorage`.
- **`src/features/auth/pages/LoginPage.jsx`**: mostrar el mensaje de "sesión cerrada en otro dispositivo" cuando exista, en un banner separado del `error` de credenciales (ver Decisions), y limpiarlo una vez mostrado/al intentar un nuevo login.
- Firestore: **sin cambios en `firestore.rules`** — la regla `update` de `users/{uid}` ya permite al owner escribir cualquier campo no privilegiado (`activeSessionId` no está en la lista de campos protegidos), y `create` no lo restringe.

**Out of scope:**

- Panel de Admin (login/sesión de administradores) — queda fuera, es un flujo de auth distinto (confirmado con el usuario).
- Multi-pestaña como sesiones independientes — pestañas del mismo navegador comparten `localStorage`, por diseño cuentan como una sola sesión.
- Revocación de tokens vía Cloud Function / Admin SDK (`revokeRefreshTokens`) — se descartó por tener hasta 1h de latencia frente al enfoque realtime elegido.
- Notificar al usuario de la sesión "ganadora" (el nuevo login) de que cerró una sesión anterior — no se pidió, solo se notifica a la sesión cerrada.
- Límite configurable de sesiones (>1) o lista de dispositivos activos — solo se pide máximo 1 sesión.

---

## Data model

Este spec no crea colecciones nuevas; añade **un campo** al documento existente `users/{uid}` y **una clave** de `localStorage`.

**Firestore — `users/{uid}`** (colección ya existente, gestionada en `fetchUserProfile`/`useAuthStore`):

| Campo | Tipo | Descripción |
|---|---|---|
| `activeSessionId` | `string \| null` | UUID (`crypto.randomUUID()`) generado en cada login exitoso. Identifica la sesión "vigente" del usuario. `null` tras logout manual. Ausente (`undefined`) en documentos de usuarios creados antes de este spec, hasta su próximo login. |

No requiere índice nuevo (no se consulta por este campo, solo se lee vía el doc listener ya existente por `uid`).

**`localStorage` (por navegador/dispositivo):**

| Clave | Tipo | Descripción |
|---|---|---|
| `certzen-session-id` | `string` | Copia local del `sessionId` generado en el último login realizado *desde este navegador*. Se compara contra `activeSessionId` de Firestore para decidir si esta sesión sigue siendo la vigente. Se borra en logout manual. |

**Store (`useAuthStore`) — nuevo campo de estado:**

| Campo | Tipo | Descripción |
|---|---|---|
| `sessionClosedMessage` | `string \| null` | Mensaje a mostrar en `LoginPage` cuando esta sesión fue cerrada por detectar un login más reciente en otro dispositivo. Independiente de `error` (que es para fallos de credenciales) para que `clearError()` en el mount de `LoginPage` no lo borre antes de mostrarse. |

---

## Implementation plan

1. **`useAuthStore.js` — helper de rotación de sesión.** Añadir una función interna `rotateSessionId(uid)` que genera `crypto.randomUUID()`, lo guarda síncronamente en `localStorage.setItem('certzen-session-id', id)` y lo devuelve. Test manual: llamarla en consola del navegador y confirmar que `localStorage` se actualiza.

2. **Escribir `activeSessionId` en los tres flujos de alta de sesión:**
   - `login()`: tras `signInWithEmailAndPassword`, llamar `rotateSessionId(uid)` y `updateDoc(doc(db,'users',uid), { activeSessionId: id })`.
   - `loginWithGoogle()`: mismo patrón, tanto en la rama de usuario nuevo (`setDoc` del perfil incluye `activeSessionId`) como en la rama de usuario existente (`updateDoc`).
   - `register()`: incluir `activeSessionId` directamente en el `setDoc` inicial del perfil.
   Test manual: hacer login desde un navegador, inspeccionar el doc en Firestore console y confirmar que `activeSessionId` coincide con `localStorage` del navegador.

3. **Detección en el listener de perfil (`init()`).** En el callback de `onSnapshot(doc(db,'users',uid), ...)`, antes de aplicar los demás campos del perfil: si `snap.metadata.fromCache` es `true`, ignorar el snapshot completo (comportamiento ya casi presente, solo se añade el guard). Si no es de caché, comparar `snap.data().activeSessionId` con `localStorage.getItem('certzen-session-id')`; si ambos existen y son distintos, llamar `signOut(auth)` y `set({ sessionClosedMessage: 'Tu sesión se cerró porque iniciaste sesión en otro dispositivo.' })`, y `return` sin aplicar el resto del snapshot. Test manual: loguear el mismo usuario en dos navegadores distintos (o uno normal + uno incógnito) y confirmar que el primero se desloguea en segundos.

4. **`logout()`.** Antes/junto a `signOut(auth)`, si hay `auth.currentUser`, hacer `updateDoc(doc(db,'users',uid), { activeSessionId: null })` y `localStorage.removeItem('certzen-session-id')`. Test manual: logout manual, confirmar en Firestore console que `activeSessionId` queda `null`.

5. **`LoginPage.jsx`.** Leer `sessionClosedMessage` del store y mostrarlo en un banner (mismo estilo visual que el banner de `error` ya existente, para consistencia). Limpiarlo (`set({ sessionClosedMessage: null })`) al desmontar el banner tras un nuevo intento de login exitoso o manualmente por el usuario — no debe limpiarse en el `useEffect` de mount que ya limpia `error`, para que sobreviva al redirect desde la ruta protegida. Test manual: reproducir el escenario del paso 3 y confirmar que el mensaje aparece en `/login` tras el redirect automático de `ProtectedRoute`.

6. **Verificación final.** `npm run build` y `npx eslint src` sin errores. Prueba manual end-to-end: login en Navegador A → login con el mismo usuario en Navegador B → Navegador A muestra el mensaje y queda en `/login` en menos de ~5 segundos (latencia normal de `onSnapshot`) → confirmar que Navegador B sigue autenticado sin interrupciones.

---

## Acceptance criteria

- [ ] Al hacer login (email/password, Google o registro), se genera un `sessionId` único que se guarda en `localStorage` (`certzen-session-id`) del navegador y en `users/{uid}.activeSessionId` en Firestore.
- [ ] Si un mismo usuario inicia sesión en un segundo navegador/dispositivo, la sesión del primero se cierra automáticamente (sin intervención del usuario) en cuestión de segundos.
- [ ] La sesión cerrada automáticamente es redirigida a `/login` (vía `ProtectedRoute` existente) y muestra el mensaje "Tu sesión se cerró porque iniciaste sesión en otro dispositivo." en un banner distinto al de errores de credenciales.
- [ ] Abrir múltiples pestañas del **mismo** navegador/dispositivo con la misma sesión **no** dispara ningún cierre de sesión entre ellas.
- [ ] Un corte de red temporal (snapshot servido desde caché, `fromCache: true`) **no** dispara un cierre de sesión falso.
- [ ] El logout manual ("Salir") limpia `activeSessionId` en Firestore (`null`) y borra `certzen-session-id` de `localStorage`.
- [ ] Usuarios con sesión activa antes de este despliegue (sin `activeSessionId` en su doc o sin `certzen-session-id` en `localStorage`) **no** son deslogueados por el despliegue en sí — el control empieza a aplicar desde su próximo login.
- [ ] El panel de Admin (`/admin/*`, login de administradores) no se ve afectado por este cambio.
- [ ] `npm run build` pasa sin errores.
- [ ] `npx eslint src` sin errores ni warnings.

---

## Decisions

- **Sí:** sessionId en Firestore (`users/{uid}.activeSessionId`) + listener `onSnapshot` en tiempo real, reutilizando el listener de perfil que ya existe en `useAuthStore.init()`. Evita depender de revocación de tokens (Admin SDK), que tiene hasta 1h de latencia y requeriría una Cloud Function nueva.
- **Sí:** granularidad por dispositivo/navegador, no por pestaña — la comparación se hace contra `localStorage`, que es compartido por todas las pestañas del mismo origen. Pestañas múltiples del mismo navegador no se consideran "múltiples sesiones".
- **Sí:** el control solo aplica al login normal de usuarios (`useAuthStore`) — el panel de Admin queda explícitamente fuera de este spec (flujo de auth y store distintos).
- **Sí:** se ignoran snapshots `fromCache: true` — evita falsos positivos por reconexión de red inestable.
- **Sí:** `sessionClosedMessage` es un campo de estado separado de `error`, no reutiliza el banner de errores de credenciales. Razón: `LoginPage` ya limpia `error` incondicionalmente en su `useEffect` de mount (para no arrastrar errores de un intento previo), lo que borraría el mensaje de "sesión cerrada" antes de que el usuario lo vea tras el redirect automático de `ProtectedRoute`.
- **Sí:** usuarios/dispositivos sin `activeSessionId`/`certzen-session-id` (pre-deploy) no se desloguean al desplegar — el campo se crea recién en su próximo login, sin ruptura para sesiones ya abiertas.
- **No:** no se modifica `firestore.rules` — la regla `update` de `users/{uid}` ya permite al owner escribir campos no privilegiados, y `activeSessionId` no entra en la lista de campos protegidos (`plan`, `isPro`, `role`, `verifiedAuthor`, `reputationScore`, `banned`).
- **No:** no se implementa revocación de tokens vía Cloud Function — descartado por latencia frente al enfoque elegido (ver primera decisión).
- **No:** no se notifica a la sesión "ganadora" de que cerró una sesión anterior — solo se informa a la sesión cerrada.
- **No:** no se construye un límite configurable de sesiones concurrentes ni una vista de "dispositivos activos" — fuera de alcance, no se pidió.

---

## Risks

| Riesgo | Mitigación |
|---|---|
| Condición de carrera: dos logins casi simultáneos del mismo usuario en dos navegadores distintos podrían generar una secuencia de escrituras en Firestore que deje ambos deslogueados o ninguno, dependiendo del orden de llegada de los `updateDoc`. | Comportamiento aceptado: "último login gana" es la semántica esperada por el spec (sesión única). En el caso extremo de una carrera de milisegundos, el peor resultado posible es que ambas sesiones terminen viendo el `sessionId` del último escritor y ambas se mantengan sincronizadas — no hay estado inconsistente persistente, solo se resuelve al valor final escrito. |
| Escrituras adicionales a Firestore en cada login/logout (`activeSessionId`) incrementan ligeramente el volumen de escritura, y el listener de perfil ahora se dispara también en logins desde otros dispositivos (antes solo por cambios de plan/perfil). | Volumen marginal — mismo documento que ya se escribe en cada login/registro; no se crean documentos ni colecciones nuevas. Sin impacto de costo relevante a la escala actual del proyecto. |
| `localStorage` puede estar deshabilitado (modo incógnito estricto, extensiones de privacidad) o limpiarse manualmente por el usuario, dejando `certzen-session-id` ausente mientras `activeSessionId` sí existe en Firestore. | Con la regla "si `localStorage` no tiene el valor, no se dispara logout" (ver Data model/Decisions), este caso se trata igual que una sesión pre-deploy: no se fuerza cierre, pero tampoco protege esa sesión de que otra la reemplace más adelante sin previo aviso local. Aceptado como límite conocido del enfoque basado en `localStorage` — no se implementa un mecanismo alterno para navegadores sin storage persistente. |
| QA manual multi-dispositivo/multi-navegador no está automatizada — este proyecto no tiene test runner configurado (confirmado en `CLAUDE.md`). | Verificación por prueba manual documentada en el plan de implementación (paso 6): dos navegadores reales, medir tiempo de cierre y confirmar ausencia de falsos positivos en pestañas del mismo navegador. |
