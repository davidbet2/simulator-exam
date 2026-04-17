# Plan de Correcciones Críticas + Cobertura de Pruebas

> **Fecha:** 2026-04-17
> **Basado en:** `memory/research/2026-04-17-testing-strategy.md`
> **Estado:** PROPUESTO — requiere aprobación del usuario antes de ejecutar.

---

## Severidad

- **P0 — CRÍTICO** (24h): Riesgo activo de fraude o exfiltración. Sin código nuevo o muy poco.
- **P1 — ALTO** (esta semana): Garantizar que escudos existentes funcionan.
- **P2 — MEDIO** (próximas 2 semanas): Cobertura unit + E2E del happy path y exploits conocidos.
- **P3 — BAJO** (backlog): Carga, hardening adicional, App Check.

---

## P0 — CRÍTICO (Hacer YA, sin escribir código nuevo)

### P0.1 Rotar `DODO_WEBHOOK_KEY`
**Por qué:** Logs de producción muestran `Base64Coder: incorrect characters for decoding`. El webhook NO está validando firmas. **Cualquiera con la URL puede inyectar eventos de pago falsos**.

**Acción:**
```bash
firebase functions:secrets:set DODO_WEBHOOK_KEY   # pegar valor exacto del dashboard Dodo
firebase deploy --only functions:dodoWebhook
# Verificar en logs: no más errores de Base64Coder
```
**Riesgo si no se hace:** un atacante con la URL del webhook puede marcar a cualquier `userId` como `pro` enviando un evento fabricado.

### P0.2 Rotar secretos expuestos en sesiones previas
- `DODO_API_KEY` → regenerar en Dodo dashboard, actualizar via `firebase functions:secrets:set`.
- Cloudflare token `cfut_***REDACTED***` → revocar en Cloudflare dashboard.
- `RESEND_API_KEY` → regenerar en Resend dashboard.

**Riesgo:** estos tokens están en historial de chat/logs. Asumir comprometidos.

### P0.3 Fix manual `kathe9029@gmail.com`
- Opción A: usuario visita `/payment-success` → `syncDodoSubscription` corrige el plan.
- Opción B: editar manualmente `users/{uid}.plan = 'pro'` en Firestore Console.

---

## P1 — ALTO (Esta semana)

### P1.1 Tests de Reglas de Firestore (emulador)
**Instalar:**
```bash
npm i -D @firebase/rules-unit-testing firebase-tools
```

**Crear:** `tests/rules/firestore.rules.test.js`

**Cubrir como mínimo:**
- ✗ Usuario NO puede escribir `plan: 'pro'` en su propio doc.
- ✗ Usuario NO puede escribir `role: 'admin'` en su propio doc.
- ✗ Usuario NO puede leer `users/{otroUid}`.
- ✗ Usuario NO puede leer `examSets/{id}` con `published: false` (ni listar ni get directo si la regla lo bloquea).
- ✗ Usuario NO puede escribir en `dodo_events/{id}`.
- ✓ Admin SÍ puede leer/escribir `users/{cualquierUid}`.
- ✓ Owner SÍ puede leer su propio `results/{uid}/...`.
- ✗ NO se puede enumerar emails de otros usuarios.

**Comando:** `firebase emulators:exec --only firestore "vitest run tests/rules"`

### P1.2 Tests de Cloud Functions críticas
**Crear:** `functions/__tests__/dodo.test.js`

**Cubrir:**
- `dodoWebhook`:
  - Rechaza request con firma inválida.
  - No procesa el mismo `event_id` dos veces (idempotencia con `dodo_events`).
  - Actualiza `users/{uid}.plan` y `subscriptionStatus` correctamente.
- `cancelDodoSubscription`:
  - Rechaza si `auth.uid !== users/{uid}.uid` (test de exploit ownership).
  - Rechaza sin auth.
- `reactivateDodoSubscription`:
  - Mismas verificaciones de ownership.
- `getDodoPayments`:
  - Solo retorna pagos del propio usuario.
  - Rechaza sin auth.
- `syncDodoSubscription`:
  - Sin pagos activos → retorna `{ synced: false }` (gate exploit).
  - Con pago activo → retorna `{ synced: true }` y actualiza el doc.

**Comando:** `cd functions && npm test`

### P1.3 Verificación non-regression del exploit /payment-success
**Crear:** `src/features/plans/pages/__tests__/PaymentSuccessPage.test.jsx`

**Cubrir:**
- Mock `syncDodoSubscription` → `{ synced: false }` ⇒ debe renderizar "No encontramos un pago activo".
- Mock `{ synced: true }` ⇒ debe renderizar éxito.
- Usuario ya `isPro` ⇒ no llama a `syncDodoSubscription`, muestra éxito directo.
- Error de red ⇒ muestra estado `error`.

---

## P2 — MEDIO (Próximas 2 semanas)

### P2.1 Tests unitarios de `useAuthStore`
**Crear:** `src/core/store/__tests__/useAuthStore.test.js`

**Cubrir:**
- `init()` monta `onSnapshot` y actualiza estado al recibir cambios de Firestore.
- `logout()` limpia el listener (no leak).
- `refreshProfile()` lee el doc fresco.
- Cambio de `plan` en Firestore se refleja en el store sin recargar.

### P2.2 Tests unitarios de `ProfilePage`
**Crear:** `src/features/profile/pages/__tests__/ProfilePage.test.jsx`

**Cubrir:**
- Renderiza estado `active` correctamente (badge verde, fechas).
- Renderiza estado `cancelled` con panel de reactivación.
- Renderiza warning para `past_due`.
- `handleCancelRenewal` requiere 2 clicks (confirmación).
- `handleReactivateRenewal` muestra spinner + success state.
- Tabla de pagos colapsable funciona.

### P2.3 Setup Playwright + E2E flow crítico
**Crear:**
- `playwright.config.js` con proyecto `setup` + `chromium`.
- `e2e/auth.setup.js` con login + `storageState({ indexedDB: true })`.
- `e2e/payment-flow.spec.js`:
  - Login → /pricing → click plan → checkout (mockeado).
  - **Test de exploit:** ir directo a `/payment-success` SIN compra → debe mostrar "no encontramos pago".
- `e2e/exam-flow.spec.js`:
  - Login → seleccionar Senior Developer → completar 5 preguntas → ver resultados.

**Importante:** apuntar a Firebase emulador o proyecto `staging`. **Nunca a producción.**

### P2.4 Test de `useExam.js` con Firestore (no solo lógica pura)
**Extender:** `src/features/exam/hooks/__tests__/useExam.test.js`

Mockear `getDocs` y verificar:
- Carga preguntas desde `examSets/{certId}/questions`.
- Maneja error de red.
- No carga preguntas si el usuario no tiene plan habilitado.

---

## P3 — BAJO (Backlog)

### P3.1 Load testing con k6
**Instalar k6** (Windows: `winget install k6`).

**Crear:** `load-tests/dodoWebhook.js`
- 50 RPS sostenidos durante 2 min al webhook con payloads válidos firmados.
- Verificar: latencia p95 < 1s, idempotencia 100% (sin doble-charge en Firestore), 0 errores 5xx.

**Crear:** `load-tests/syncSubscription.js`
- Callable, 10 usuarios concurrentes durante 1 min.

### P3.2 App Check
- Habilitar App Check en Firebase Console (reCAPTCHA v3 para web).
- Forzar verificación en callables Dodo.
- Ahorra 90%+ de tráfico bot.

### P3.3 Rate limiting en endpoints HTTP
- Configurar `concurrency` en `dodoWebhook` (limita a 10 req simultáneos por instancia).
- Considerar Cloud Armor si el tráfico crece.

### P3.4 CI/CD — correr suite en cada PR
**Crear:** `.github/workflows/test.yml`
- Job 1: `npm run test:run` (Vitest)
- Job 2: `firebase emulators:exec "vitest run tests/rules"`
- Job 3: `cd functions && npm test`
- Job 4: `npx playwright test` (contra emuladores)

---

## Resumen de Esfuerzo Estimado

| Bloque | Archivos nuevos | Comando único |
|---|---|---|
| P0 | 0 | rotar secrets en consolas |
| P1.1 | 1 (rules.test) + setup | `npm i -D @firebase/rules-unit-testing` |
| P1.2 | 1 (functions/__tests__/dodo.test.js) | usar `firebase-functions-test` ya instalado |
| P1.3 | 1 (PaymentSuccessPage.test.jsx) | usa Vitest existente |
| P2.1–2.4 | 4 archivos | usa Vitest + Playwright instalados |
| P3 | 3+ archivos + workflow CI | añade k6 |

**Total nuevos archivos de test:** ~10–15.

---

## Decisiones Pendientes para el Usuario

Antes de ejecutar este plan, necesito confirmar:

1. **¿Procedemos por bloques (P0 → P1 → P2 → P3) con commits atómicos por archivo?** o ¿prefieres un PR único por nivel de severidad?
2. **¿Tienes proyecto Firebase de `staging`** para correr E2E sin tocar prod? Si no, configuro emuladores locales.
3. **¿Apruebas instalar `@firebase/rules-unit-testing` y `k6`** como nuevas devDependencies?
4. **¿Confirmas que vas a rotar manualmente los secrets de P0?** (Necesito que lo hagas tú; yo no tengo acceso a las consolas externas.)

---

## Próximo Paso Inmediato (al obtener aprobación)

Empezar por **P1.1 (Reglas de Firestore)**. Es el escudo más importante y se puede ejecutar 100% local con emulador. Sin él, ninguna garantía de seguridad es real.
