# SPEC 01 — Corregir authz de admin en `generateExplanation` (email vs UID)

> **Status:** Implementado
> **Depends on:** —
> **Date:** 2026-07-19
> **Objective:** Alinear el guard de admin del Cloud Function `generateExplanation` para que identifique al admin por email (convención de todo el proyecto) en vez de por UID, restaurando el acceso al endpoint de explicaciones con IA.

---

## Scope

**In:**

- Corregir `functions/index.js:778` para que `generateExplanation` verifique el admin por email (`admins/{request.auth.token.email}`) en vez de por UID (`admins/{request.auth.uid}`).
- Verificar que el token de auth incluya el claim `email` en el contexto de `onCall` (Firebase Functions v2) y que la verificación sea case-consistente con el resto del proyecto (Firestore no normaliza mayúsculas/minúsculas en IDs de documento).
- Prueba manual/documentada de que un admin real (doc en `admins/{email}`) puede llamar `generateExplanation` tras el fix.

**Out of scope (for future specs):**

- Cualquier otro hallazgo de la auditoría (agregados spoofables en `examSets`, App Check, `isAdmin` no refrescado, etc.) — cada uno será su propio spec/fix.
- Refactor general de `functions/index.js` o de otros Cloud Functions.
- Tests automatizados nuevos para Cloud Functions (el proyecto ya tiene `functions/__tests__/dodo.security.test.js`; añadir un test equivalente para `generateExplanation` se evaluará como parte del plan, no como expansión de alcance).

---

## Data model

Este fix no introduce estructuras de datos nuevas. Reutiliza la colección `admins/{email}` ya existente (misma convención que `firestore.rules`, `useAuthStore.js`, `useAdmin.js` y los scripts de seed).

---

## Implementation plan

1. En `functions/index.js:778`, cambiar `db.collection('admins').doc(request.auth.uid).get()` por `db.collection('admins').doc(request.auth.token.email).get()`. Manual test: leer el diff, confirmar que coincide con el patrón usado en `firestore.rules` (`admins/$(request.auth.token.email)`).
2. Añadir un guard explícito para el caso `request.auth.token.email` ausente/undefined (usuarios autenticados sin email, ej. algunos proveedores), devolviendo `HttpsError('permission-denied', 'Admin access required')` en vez de dejar que `.doc(undefined)` lance un error críptico de Firestore. Manual test: revisar que el mensaje de error sea consistente con el resto del guard.
3. Actualizar/añadir el comentario sobre la línea (`functions/index.js:762-764`) para dejar constancia de que el esquema de `admins` es por email, no por UID — evita que el bug se reintroduzca. Manual test: releer el bloque completo del guard.
4. Ejecutar `npm --prefix functions run build` (o el equivalente de lint/syntax check que tenga `functions/`) para confirmar que no hay errores de sintaxis.
5. Verificación funcional contra el emulador o proyecto real: llamar `generateExplanation` autenticado como un usuario cuyo email SÍ está en `admins/{email}`, confirmar respuesta 200 con explicación generada; llamar con un usuario autenticado que NO es admin, confirmar `permission-denied`.

---

## Acceptance criteria

- [x] `functions/index.js` verifica admin en `generateExplanation` usando `request.auth.token.email` contra la colección `admins`, no `request.auth.uid`.
- [x] Si `request.auth.token.email` es `undefined`/vacío, la función responde `permission-denied` sin lanzar una excepción no controlada de Firestore.
- [x] Un usuario cuyo email existe como documento en `admins/{email}` puede invocar `generateExplanation` y recibe una explicación generada (200).
- [x] Un usuario autenticado cuyo email NO existe en `admins/{email}` recibe `permission-denied` al invocar `generateExplanation`.
- [x] `npm --prefix functions run build` (o el check de sintaxis/lint equivalente) pasa sin errores tras el cambio.
- [x] El comentario junto al guard documenta explícitamente que `admins` está keyed por email.

---

## Decisions

- **Sí:** usar `request.auth.token.email` como clave de lookup en `admins`. Es la convención ya establecida en `firestore.rules`, `useAuthStore.js`, `useAdmin.js` (grant/revoke) y los scripts de seed (`seed.mjs`, `setup-new-project.mjs`) — el Cloud Function era el único outlier.
- **No:** migrar la colección `admins` a keyed-by-UID en su lugar. Cambiar el esquema afectaría rules, el store de auth y los scripts de seed simultáneamente — mucho más riesgo para el mismo resultado, y UID no es más seguro que email aquí ya que ambos vienen del token verificado por Firebase.
- **Sí:** guard explícito para `email` ausente, devolviendo `permission-denied` en vez de dejar que Firestore falle con un doc-id inválido. Evita un error opaco en producción.
- **No:** añadir test automatizado de Cloud Functions en este spec. Se registra como mejora futura (posiblemente Fase 0 de la auditoría) pero no bloquea este fix puntual — mantiene el spec pequeño y rápido de mergear.

---

## Risks

| Riesgo | Mitigación |
|---|---|
| Discrepancia de mayúsculas/minúsculas entre `request.auth.token.email` y el ID del documento en `admins/{email}` (Firestore es case-sensitive en IDs) | Ya es el comportamiento actual en rules/store — no se introduce riesgo nuevo, pero se deja documentado en el comentario del guard (paso 3 del plan) para que futuros admins se den de alta con el mismo casing que su email de login. |
| Algún proveedor de auth entrega token sin claim `email` | Cubierto por el guard explícito del paso 2 del plan — responde `permission-denied` en vez de error no controlado. |

---

## What is **not** in this spec

- Cualquier otro hallazgo de la auditoría (agregados spoofables en `examSets`, App Check no forzado, `isAdmin` no refrescado en snapshot, key legacy hardcodeada, CI/CD, capa de datos, etc.) — cada uno tendrá su propio `/spec`.
- Refactor de `functions/index.js` más allá de la línea del guard afectada.
- Tests automatizados nuevos para Cloud Functions.

Cada uno de estos, si se aborda, va en su propio spec.
