# SPEC 14 — Restaurar verificación de email en registro por contraseña

> **Status:** Approved
> **Depends on:** 01-admin-authz-email-fix (mismo módulo de auth, sin dependencia funcional)
> **Date:** 2026-08-18
> **Objective:** Reconectar el flujo de verificación de email para cuentas creadas con email/contraseña (registro envía el correo, `ProtectedRoute` bloquea a no verificados, reenvío funcional) sin afectar el login con Google, que ya está verificado por OAuth.

---

## Scope

**In:**

- `register()` en `useAuthStore.js` llama a `sendEmailVerification(result.user, ACTION_CODE_SETTINGS)` con `continueUrl` apuntando a `/auth/action`.
- `resendVerification()` deja de ser no-op: llama `sendEmailVerification(auth.currentUser, ACTION_CODE_SETTINGS)`.
- `resetPassword()` recupera `ACTION_CODE_SETTINGS` (mismo `continueUrl` base `/auth/action`) en su llamada a `sendPasswordResetEmail`.
- `ProtectedRoute.jsx` (rama `requireUser`) vuelve a chequear `providerData` por `providerId === 'password'` + `!user.emailVerified` y redirige a `/verify-email`.
- Todos los usuarios existentes no verificados quedan bloqueados en su próximo login protegido (sin grandfathering).

**Out of scope (for future specs):**

- Cambios a `VerifyEmailPage.jsx`, `AuthActionPage.jsx` o el badge en `ProfilePage.jsx` — ya funcionan, no se tocan.
- Cambios a `loginWithGoogle()` — no aplica verificación.
- Verificar/whitelistear el dominio en Firebase Console — el usuario confirmó que ya está hecho, no es un paso de este spec.
- Rate limiting o cooldown server-side en el botón "Reenviar correo" (ya existe un `setTimeout` de UI de 5s en `VerifyEmailPage`, pero no hay rate-limit propio server-side) — se registra como riesgo, no como alcance.

---

## Data model

No introduce estructuras de datos nuevas. `user.emailVerified` es un campo nativo del token de Firebase Auth ya consumido por `ProfilePage.jsx` y `VerifyEmailPage.jsx`.

---

## Implementation plan

1. En `useAuthStore.js`, definir `ACTION_CODE_SETTINGS = { url: window.location.origin + '/auth/action', handleCodeInApp: false }` (no hardcodear `certzen.app`, evita romper en preview/staging). Importar `sendEmailVerification` de `firebase/auth`. Test manual: leer el diff, confirmar que no queda ningún hardcode de dominio.
2. En `register()`, tras el `setDoc` del perfil y antes/junto a `rotateSession`, añadir `await sendEmailVerification(result.user, ACTION_CODE_SETTINGS)`. Quitar el comentario obsoleto "Email verification intentionally skipped". Test manual: registrar cuenta nueva, confirmar llegada del correo con link a `/auth/action?mode=verifyEmail&oobCode=...`.
3. Implementar `resendVerification()`: `if (auth.currentUser) await sendEmailVerification(auth.currentUser, ACTION_CODE_SETTINGS)`. Test manual: botón "Reenviar correo" en `/verify-email` envía un segundo correo válido.
4. Restaurar `ACTION_CODE_SETTINGS` en `resetPassword()`: `sendPasswordResetEmail(auth, email, ACTION_CODE_SETTINGS)`. Test manual: flujo "olvidé mi contraseña" sigue funcionando y el link resultante apunta a `/auth/action?mode=resetPassword`.
5. En `ProtectedRoute.jsx`, restaurar el gate: `const isPasswordAccount = user.providerData?.some(p => p.providerId === 'password'); if (isPasswordAccount && !user.emailVerified) return <Navigate to="/verify-email" replace />;`. Test manual: cuenta password sin verificar intenta entrar a `/exam` → redirige a `/verify-email`; cuenta Google entra sin bloqueo; cuenta password ya verificada entra sin bloqueo.
6. Verificación end-to-end: (a) registro nuevo → bloqueado hasta verificar → clic en link del correo → `AuthActionPage` aplica el código → acceso concedido; (b) usuario existente no verificado intenta login → bloqueado en `/verify-email` → reenvía → verifica → accede; (c) login con Google sigue sin fricción.
7. Correr `npm run lint` (o el check equivalente del proyecto) para confirmar que no hay errores de sintaxis/lint tras los cambios.

---

## Acceptance criteria

- [ ] `register()` envía un correo de verificación (`sendEmailVerification`) inmediatamente tras crear la cuenta password/email.
- [ ] El link del correo apunta a `/auth/action?mode=verifyEmail&oobCode=...` y `AuthActionPage` lo procesa correctamente (ya cubierto por código existente, se valida sin tocarlo).
- [ ] El botón "Reenviar correo" en `/verify-email` envía un nuevo correo de verificación válido (`resendVerification` deja de ser no-op).
- [ ] Un usuario con cuenta password y `emailVerified === false` es redirigido a `/verify-email` al intentar acceder a cualquier ruta con `requireUser=true`.
- [ ] Un usuario con cuenta password y `emailVerified === true` accede sin fricción a rutas protegidas.
- [ ] Un usuario autenticado vía Google (`providerId === 'google.com'`) accede sin fricción a rutas protegidas, sin importar `emailVerified`.
- [ ] `resetPassword()` vuelve a incluir `ACTION_CODE_SETTINGS` y el flujo de "olvidé mi contraseña" sigue funcionando end-to-end.
- [ ] `npm run lint` (o el check equivalente del proyecto) pasa sin errores tras los cambios.

---

## Decisions

- **Sí:** usar `window.location.origin` en vez de hardcodear `https://certzen.app` en `ACTION_CODE_SETTINGS`. Motivo: el hardcode original rompe en cualquier entorno que no sea producción (localhost, preview de Firebase Hosting); `window.location.origin` es correcto en todos.
- **Sí:** apuntar `continueUrl` a `/auth/action` en vez de `/verify-email` (diseño original pre-revert). Motivo: `AuthActionPage` ya es el handler unificado para `verifyEmail`/`resetPassword`/`recoverEmail`, evita duplicar lógica de aplicación de código en dos páginas distintas.
- **Sí:** bloquear a todos los usuarios existentes no verificados sin grandfathering. Motivo: decisión explícita del usuario — prioriza seguridad/consistencia sobre fricción a corto plazo; `resendVerification` les da salida inmediata.
- **No:** agregar rate-limiting server-side al reenvío de verificación en este spec. Motivo: Firebase Auth ya aplica su propio rate-limit interno a `sendEmailVerification`; agregar uno propio es expansión de alcance no pedida por el bug reportado.
- **No:** tocar `VerifyEmailPage.jsx` / `AuthActionPage.jsx` / badge de `ProfilePage.jsx`. Motivo: ya funcionan correctamente, el bug está exclusivamente en la desconexión del store y el gate de rutas.

---

## Risks

| Riesgo | Mitigación |
|---|---|
| Usuarios existentes no verificados quedan bloqueados de golpe al desplegar este fix, generando tickets de soporte o fricción súbita | `resendVerification` les da salida inmediata desde `/verify-email`; es una decisión explícita del usuario (sin grandfathering) |
| `sendEmailVerification` falla silenciosamente si `certzen.app` no está realmente whitelisteado (a pesar de la confirmación del usuario) | Verificación manual del paso 2 del plan (confirmar llegada real del correo) antes de dar el spec por cerrado |
| Reenvíos repetidos de verificación podrían ser usados para spamear una bandeja de entrada ajena (email enumeration / abuse) | Firebase Auth aplica rate-limiting interno a `sendEmailVerification`; no requiere mitigación adicional en este spec |

---

## Addendum — verificación de dominio DNS (2026-08-18)

Durante la verificación manual del paso 6 se descubrió que, pese a la confirmación inicial del usuario, la verificación de dominio de Firebase para la plantilla de correo (`Authentication → Templates → Verificación de dirección de correo electrónico`, `Customize action URL` → `certzen.app`) nunca se completó ("No se pudo verificar el dominio"). `sendEmailVerification`/`sendOobCode` respondían 200 pero el correo nunca llegaba.

Diagnóstico: de los 4 registros DNS que Firebase requiere para verificar `certzen.app`, 3 ya existían (`firebase1._domainkey`, `firebase2._domainkey`, TXT `firebase=simulatorexam-dec4b`). Solo faltaba que el TXT SPF existente (usado por Cloudflare Email Routing) incluyera también el mecanismo de Firebase.

Acción tomada (fuera del código, directamente en Cloudflare DNS, con confirmación explícita del usuario): se editó el registro TXT SPF de `certzen.app` de

```
v=spf1 include:_spf.mx.cloudflare.net ~all
```

a

```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.firebasemail.com ~all
```

Esto no rompe el envío existente vía Cloudflare Email Routing (se conserva su `include`) y agrega el permiso que Firebase requiere. Firebase indica que la verificación de dominio puede tardar hasta 48 horas en completarse. Este cambio es de infraestructura (DNS), no de código — no se tocó ningún archivo del repositorio para esto — y se deja documentado aquí porque bloqueaba directamente el criterio de aceptación "el link del correo... y `AuthActionPage` lo procesa correctamente".

**Pendiente de confirmar** (no bloqueante para mergear el código, que ya está completo y probado): una vez pase la ventana de verificación de Firebase, repetir el registro/reenvío de correo con una cuenta de prueba y confirmar que el correo llega.

---

## Addendum 2 — migración a Resend para verificación/reset (2026-08-19)

El editor de plantillas de Firebase Console quedó bloqueado del lado de Firebase ("no se pueden actualizar las plantillas de correo electrónico de este proyecto"), incluso para cambios triviales — sin ETA de resolución. Esto hacía imposible aplicar una plantilla de marca (diseño provisto por el usuario, estilo oscuro consistente con `sendWelcomeEmail`) a los correos de verificación/reset mientras se dependiera del sistema de envío propio de Firebase Auth.

**Cambio de arquitectura:** en vez de `sendEmailVerification`/`sendPasswordResetEmail` del SDK cliente de Firebase Auth, se añadieron dos Cloud Functions callables en `functions/index.js`:

- `sendVerificationEmail` — requiere `request.auth`, genera el link real de Firebase (`getAuth().generateEmailVerificationLink`) y lo envía por Resend con HTML de marca.
- `sendPasswordResetEmailCustom` — recibe `{ email }`, genera el link (`generatePasswordResetLink`), protege contra enumeración de cuentas (silencia `auth/user-not-found`), y envía por Resend.

Ambas reutilizan `RESEND_API_KEY` (ya configurado) y el mismo `ACTION_URL` (`https://certzen.app/auth/action`), así que `AuthActionPage.jsx` sigue procesando el `oobCode` exactamente igual — el único cambio es el transporte del correo, no el mecanismo de verificación de Firebase Auth en sí.

`useAuthStore.js` (`register()`, `resendVerification()`, `resetPassword()`) ahora llama a estas Cloud Functions vía `httpsCallable` en vez del SDK cliente de `firebase/auth`. Se eliminaron `ACTION_CODE_SETTINGS`, `sendEmailVerification` y `sendPasswordResetEmail` del cliente por quedar sin uso.

**Nota de deploy:** el CLI de Firebase falló con `Cannot determine backend specification. Timeout after 10000` en Node 24 (el sistema tiene Node 24, `functions/package.json` declara `engines.node: "22"`). Se resolvió con la variable de entorno `FUNCTIONS_DISCOVERY_TIMEOUT=60` en el comando de deploy — no requirió downgrade de Node ni cambios de configuración.

---

## What is **not** in this spec

- Cambios a `VerifyEmailPage.jsx`, `AuthActionPage.jsx` o el badge de `ProfilePage.jsx`.
- Cambios a `loginWithGoogle()`.
- Whitelisteo del dominio en Firebase Console.
- Rate limiting server-side propio para reenvíos.

Cada uno de estos, si se aborda, va en su propio spec.
