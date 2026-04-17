# Research — Estrategia de Testing & Hardening de Seguridad

> **Fecha:** 2026-04-17
> **Tema:** Cobertura completa de pruebas (unit, integration, E2E, carga, seguridad) para Simulator-Exam.
> **Stack:** React 19 · Vite 5 · Firebase (Auth + Firestore + Functions) · Zustand · Dodo Payments
> **Validez:** 30 días

---

## 1. Resumen Ejecutivo

El proyecto tiene infraestructura de testing **instalada pero infrautilizada**:

| Herramienta | Versión | Estado | Tests reales |
|---|---|---|---|
| **Vitest** | 4.1.4 | ✅ configurado (jsdom + globals + v8 cov) | 1 archivo (14 tests) |
| **@testing-library/react** | 16.3.2 | ✅ instalado | 0 tests |
| **@playwright/test** | 1.59.1 | ⚠️ instalado SIN config ni tests | 0 |
| **firebase-functions-test** | 3.1.0 | ✅ instalado en `/functions` | 0 |
| **@firebase/rules-unit-testing** | ❌ NO instalado | crítico para Firestore rules | 0 |
| **k6 / artillery** | ❌ NO instalado | crítico para webhook stress | 0 |

**Brecha crítica:** Cobertura efectiva ≈ 2% del código. Cero pruebas E2E, cero pruebas de reglas de Firestore, cero pruebas de carga, cero pruebas de Cloud Functions.

---

## 2. Herramientas Disponibles (MCPs y Externas)

### MCPs activos en este entorno
- **`chrome-devtools`** ✅ — Automación de navegador en vivo (similar a Playwright pero ad-hoc). Útil para smoke tests inmediatos en producción.
- **`context7`** ✅ — Docs actualizadas (Playwright, Firebase, etc.).
- **`sequential-thinking`** ✅ — Para análisis estructurado de flujos críticos.
- **`memory-files`** ✅ — Persistir hallazgos.

### MCPs registrados en `.mcp.json` pero no expuestos en sesión
- `semgrep` (SAST), `tavily` (web search), `engram` (KG semántico), `claudemem`, `caveman`.

### Sin MCP de Playwright
El usuario mencionó "MCP de Playwright" — **no está registrado**. Alternativas:
1. Usar `@playwright/test` directamente (ya instalado) → recomendado para suites repetibles.
2. Usar `chrome-devtools` MCP para verificación manual one-shot.

---

## 3. Hallazgos por Capa

### 3.1 Cobertura Unit (Vitest)
**Solo existe:** `src/features/exam/hooks/__tests__/useExam.pureLogic.test.js` (14 tests, todos pasan).

**Sin cubrir (alta prioridad):**
- `src/core/store/useAuthStore.js` — listener `onSnapshot`, `refreshProfile`, `init/logout` lifecycle.
- `src/features/profile/pages/ProfilePage.jsx` — `handleCancelRenewal`, `handleReactivateRenewal`, render condicional según `subscriptionStatus`.
- `src/features/plans/pages/PaymentSuccessPage.jsx` — gate de exploit (verifica que `synced:false` muestre "no encontramos pago").
- `src/features/exam/hooks/useExam.js` — branches con Firestore (no solo lógica pura).
- `src/core/router/ProtectedRoute.jsx` — redirección por plan/role.

### 3.2 Cobertura Cloud Functions
**Cero tests.** `firebase-functions-test` ya está instalado en `/functions/package.json`.

**Funciones críticas sin pruebas:**
- `dodoWebhook` — verificación de firma, idempotencia (colección `dodo_events`), actualización de `users/{uid}.plan`.
- `syncDodoSubscription` — fallback de búsqueda + actualización sin duplicar.
- `cancelDodoSubscription`, `reactivateDodoSubscription`, `getDodoPayments` — verificación de ownership (que `auth.uid === doc.uid`).
- `createDodoCheckout` — validación de input.

### 3.3 Reglas de Firestore
Auditoría manual de `firestore.rules` (218 líneas):

✅ **Bien resuelto:**
- `users/{uid}` writes solo por owner; campos protegidos (`plan`, `role`, `subscriptionStatus`, `subscriptionRenewsAt`) bloqueados al cliente → solo Cloud Functions / admin.
- `examSets/{id}` lista pública solo si `published == true`.
- `dodo_events/{id}` admin-write only (idempotencia).
- Función `isAdmin()` lee `users/{uid}.role == 'admin'`.

⚠️ **Sin verificar empíricamente:**
- ¿Un usuario puede escribir `plan: 'pro'` directamente en su doc? (Las reglas dicen que no, pero no hay test que lo demuestre.)
- ¿Un usuario puede leer `examSets/{id}` con `published=false` por ID directo (no listado)?
- ¿Resultados de exámenes (`results/{uid}/...`) son owner-only?
- ¿Se puede enumerar emails de otros usuarios?

**Recomendación:** Añadir `@firebase/rules-unit-testing` + suite con emulador.

### 3.4 E2E
**Cero.** Playwright instalado pero sin `playwright.config.js` ni `e2e/`.

**Flujos críticos a cubrir:**
1. Login → Welcome → seleccionar examen → completar → Resultados.
2. Login → /pricing → checkout Dodo (mock) → /payment-success (gate de exploit).
3. /payment-success directo SIN compra → debe mostrar "no encontramos pago" (regression test del exploit fix).
4. Profile → cancelar renovación → reactivar.
5. Admin login → CRUD de preguntas → publicar examen.

**Patrón Playwright recomendado** (de docs oficiales context7):
```js
// playwright/auth.setup.js
import { test as setup } from '@playwright/test';
setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  // login con cuenta de test
  await page.context().storageState({ path: 'playwright/.auth/user.json', indexedDB: true });
});
```
**Importante:** Firebase Auth guarda el token en **IndexedDB**, por lo que `storageState({ indexedDB: true })` es **obligatorio** (feature reciente de Playwright 1.51+).

### 3.5 Carga & Estrés
**Endpoints HTTP críticos** (Cloud Functions v2 onRequest):
- `dodoWebhook` — Dodo puede enviar bursts en migraciones masivas. Validar idempotencia bajo carga concurrente.
- `syncDodoSubscription` — callable, ratelimited por usuario pero con cold-start.

**Herramienta recomendada:** **k6** (open source, JS scripts, se integra con CI). Alternativa: `artillery` (más simple para callables HTTPS).

### 3.6 Seguridad — Hallazgos Pendientes
- ✅ No hay secrets hardcodeados en `src/` (regex grep limpio).
- ⚠️ **DODO_WEBHOOK_KEY corrupto en producción** (logs muestran `Base64Coder: incorrect characters`). El webhook NO está validando firmas → potencial inyección de eventos.
- ⚠️ Secretos expuestos en sesiones previas que aún no rotamos: `DODO_API_KEY`, Cloudflare token (`cfut_TMx...`), `RESEND_API_KEY`.
- ⚠️ No hay rate limiting en endpoints HTTP propios (Firebase Functions v2 lo soporta vía `concurrency` y cuotas de App Check, pero no está activado).
- ⚠️ No hay App Check → cualquiera puede invocar callables desde Postman con un token de Auth válido.

---

## 4. Recomendación de Implementación (orden)

| Orden | Capa | Razón |
|---|---|---|
| 1 | **Rotación de secretos + DODO_WEBHOOK_KEY** | Cero código nuevo, máximo impacto en seguridad. |
| 2 | **Firestore Rules emulator tests** | Garantiza que el escudo principal funciona. |
| 3 | **Cloud Functions unit tests** (Dodo + ownership) | El backend toca dinero. Cero margen de error. |
| 4 | **Vitest suite ProfilePage + PaymentSuccess + useAuthStore** | Cubre el exploit gate y la reactividad. |
| 5 | **Playwright E2E** del flujo de pago + gate exploit | Único modo de validar el flow completo. |
| 6 | **k6 stress test** del webhook | Garantiza idempotencia bajo concurrencia. |
| 7 | **App Check + rate limiting** | Hardening de superficie callable. |

---

## 5. Decisiones de Diseño Propuestas

| # | Decisión | Justificación |
|---|---|---|
| D1 | Vitest para unit + integration; Playwright para E2E; firebase-functions-test para CF; rules-unit-testing para reglas | Cada herramienta es la oficial en su capa, ya instaladas (excepto rules-unit-testing). |
| D2 | k6 sobre artillery para webhook stress | k6 tiene mejor soporte de checks/thresholds y export a Grafana. |
| D3 | NO Playwright MCP (no registrado) — usar `@playwright/test` directo | El paquete ya está instalado; un MCP añadiría latencia sin valor. |
| D4 | Test de "exploit gate" /payment-success como **non-regression P0** | Es el único flow que protege fraude directo. |
| D5 | Mocking de Firebase via `vi.mock('firebase/firestore')` para unit tests; emulador SOLO para rules + CF integration | Evita arrancar emulador en cada test unit (ahorro 5-10s por suite). |

---

## 6. Pitfalls Conocidos

- ⛔ **`storageState` sin `indexedDB:true`** → Firebase Auth se desautentica entre tests (Playwright < 1.51 no lo soportaba).
- ⛔ **Tests en producción** — JAMÁS apuntar Playwright contra Firebase de prod. Usar emuladores o proyecto `staging`.
- ⛔ **Tests de webhook Dodo en local** — Dodo no firma con la misma key que prod. Mockear el verificador de firma en CF tests.
- ⛔ **Vitest + React 19** — `@testing-library/react@16.x` ES compatible con React 19 (verificado), pero algunos hooks experimentales (`use()`) requieren `act()` explícito.
- ⛔ **Cloud Functions v2 cold start** — un load test que arranca con 0 instancias dará latencias falsas en los primeros requests; warm-up obligatorio.

---

## 7. Compatibilidad con React 19 + Vite 5

- ✅ Vitest 4.x → React 19 OK
- ✅ @testing-library/react 16.3 → React 19 OK
- ✅ @playwright/test 1.59 → soporta `storageState({ indexedDB: true })` (1.51+)
- ✅ firebase-functions-test 3.x → Functions v2 OK

---

## 8. Bundle Size
N/A — todas las dependencias son `devDependencies` (no impactan bundle de producción).

---

## 9. Fuentes

- Playwright auth + storage state: https://github.com/microsoft/playwright/blob/main/docs/src/auth.md
- Playwright IndexedDB persistence: https://github.com/microsoft/playwright/blob/main/docs/src/release-notes-js.md (1.51 release notes)
- Firebase Rules unit testing: https://firebase.google.com/docs/rules/unit-tests
- firebase-functions-test: https://firebase.google.com/docs/functions/unit-testing
- k6 + Cloud Functions: https://k6.io/docs/testing-guides/api-load-testing/
- Auditoría OWASP A01 (Broken Access Control) — base del checklist de Firestore rules.

---

## 10. Próximos Artefactos

- `memory/plans/2026-04-17-critical-fixes-plan.md` — el plan ejecutable.
