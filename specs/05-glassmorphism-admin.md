# SPEC 05 — Glassmorphism en Admin + limpieza final de tokens legacy

> **Status:** Implementado
> **Depends on:** 02-glassmorphism-design-system, 03-glassmorphism-public-pages, 04-glassmorphism-app-autenticada
> **Date:** 2026-07-24
> **Objective:** Rediseñar el panel de Admin (`AdminShell` + 6 pantallas + login) con el sistema Glassmorphism, y eliminar los tokens legacy (`brand-*`, `surface-*`, `ink-*` y variantes `danger/success/warning` legacy) del resto del repo — cierre del rediseño Glassmorphism iniciado en el spec 02.

> **Referencia de diseño:** `C:\Users\david.betancur_pragm\Desktop\Proyectos\pen\certzen` — `export/` (desktop 1440px) y `export_mobile/` (390px), Light y Dark. Pantallas: `Admin Dashboard`, `Admin Usuarios`, `Admin Sets comunidad`, `Admin Intentos`, `Admin Feature Flags`, `Admin Audit Log`.

---

## Scope

**In:**

- **`AdminShell` glass** (`src/features/admin/components/AdminShell.jsx`): topbar (logo + badge "Admin", email, botón "Salir"), sidebar fijo desktop (sin colapsar, a diferencia de `AppShell`) y bottom tab bar en mobile/tablet — mismo patrón que `AppShell` (spec 04) pero simplificado según el diseño de Admin (sin buscador, sin folders, sin botón crear).
- **Dashboard, Usuarios, Sets comunidad, Intentos, Feature flags, Audit log**: las 6 páginas restyladas fieles a sus PNG — misma data/hooks (`useAdmin`, `useAudit`, `useFeatureFlags`), solo capa visual.
- **Admin Login** (sin PNG propio): restylado por extensión del patrón `AuthShell`/`GlassField` (spec 03), mismo flujo de Turnstile + lockout progresivo.
- Los modales de detalle de Usuarios y Sets comunidad (sin PNG propio) se restylaron como paneles glass elevados vía el componente `Modal` migrado.
- **Limpieza completa de tokens legacy** en primitivos compartidos (`Button`, `Input`, `Card`, `Badge`, `Modal`, `ShareButton`) y en features restantes (`Footer`, `ads/*`, `social/*`, `PaymentSuccessPage`, `DomainPath`, `SaveToFolderButton`, `TimerBox`, `QuestionCard`, `PrivacyPage`, `App.jsx`, `AppRouter.jsx`, `ProtectedRoute.jsx`, `ExamSetLandingPage.jsx`).
- `Footer` perdió su prop `variant` — el estilo glass es ahora el único (nadie usaba el legacy).

**Out of scope:**

- Cambios funcionales: sin cambios en queries de Firestore, en `admins/{email}`, en `useAdmin`/`useAudit`/`useGenerateExplanation`, ni en el flujo de login/lockout.
- Nuevas features de Admin.
- `QuestionForm.jsx` (ver Hallazgos) — queda en tokens legacy, sin referencia visual en el diseño.

---

## Data model

No introduce datos nuevos ni cambia estructuras existentes en Firestore. Todo el spec es restyle visual + limpieza de tokens CSS/Tailwind.

---

## Acceptance criteria

- [x] `AdminShell` usa el sistema Glassmorphism (topbar, sidebar desktop, bottom tab bar mobile) con soporte light/dark — todas las rutas `/admin/*` renderizan sin roturas.
- [x] Las 7 pantallas (Dashboard, Usuarios, Sets comunidad, Intentos, Feature flags, Audit log, Login) replican sus PNG de `export/`/`export_mobile/` (Dashboard–Audit log); Login sigue el patrón `AuthShell` por extensión.
- [x] Flujos preservados intactos (misma lógica, solo restyle): navegación del sidebar/bottom bar, buscar/paginar usuarios, promover/degradar plan, banear/desbanear, filtrar/paginar sets, publicar/despublicar/destacar/eliminar set, filtrar intentos por usuario, guardar/descartar feature flags, filtrar/expandir audit log, login admin con lockout.
- [x] Toggle light/dark vía `.dark` (mismo mecanismo `useThemeStore` de specs 02–04, sin cambios) — todas las pantallas migradas usan clases `dark:`.
- [x] `npm run build` pasa sin errores.
- [x] `npx eslint src` sin errores ni warnings.
- [x] Grep de `\b(brand|surface|ink)-` sobre `src/` → solo `QuestionForm.jsx` (documentado abajo) y los overrides de `html.dark` en `index.css` que lo sostienen.

---

## Decisions

- **Sí:** limpieza completa de tokens legacy en todo el repo (no solo Admin) — decisión tomada con el usuario, cierra la deuda de diseño acumulada desde spec 02.
- **Sí:** Admin Login se restyló por extensión del patrón `AuthShell`/`GlassField` — mismo criterio usado en specs 03/04 para pantallas de auth sin diseño.
- **Sí:** los modales de detalle de Usuarios y Sets comunidad se restylaron como paneles glass elevados vía el componente `Modal` compartido (ya migrado a glass) — evita duplicar lógica de modal.
- **Sí:** sidebar de Admin sin botón de colapsar — el PNG no lo muestra; Admin tiene menos ítems de nav que la app autenticada.
- **Sí:** `Footer` perdió su prop `variant` (quedaba un solo consumidor de cada estilo) — se simplificó a un único estilo glass en vez de mantener una rama muerta.
- **No:** `QuestionForm.jsx` se dejó en tokens legacy (ver Hallazgos) — migrarlo a ciegas sin referencia visual del diseño era alto riesgo para un formulario grande con 3 tipos de pregunta.
- **No:** cambios funcionales en Admin — todo lo que muestran los PNG ya existía en el código; solo cambió la capa visual.

---

## Risks

- **Radio de impacto de la limpieza de tokens en primitivos compartidos** (`Button`, `Modal`, `Input`, `Card`, `Badge`, `ShareButton`) — mitigado verificando `npm run build` + `npx eslint src` sin errores tras cada migración, y revisando cada consumidor por Grep antes de tocar el primitivo.
- **`AdminShell` es compartido por las 6 pantallas de Admin** — mitigado construyéndolo primero y verificándolo antes de tocar páginas individuales (mismo enfoque que spec 04 con `AppShell`).
- **QA visual manual pendiente** — este spec no tuvo acceso a un navegador para comparar pixel-a-pixel contra los PNG; la fidelidad se verificó por inspección de código contra las capturas de diseño. Se recomienda una pasada visual manual en 390/768/1440, light/dark, antes de mergear a producción.

---

## Hallazgos (para planear en specs futuros)

1. **`QuestionForm.jsx` sigue en tokens legacy** (`brand-300/400/500/600`, `ink-faint/soft`, `surface-border/card/raised`) — no tiene contraparte en el diseño Glassmorphism de referencia (no aparece en los PNG de Admin), y es un formulario grande con 3 tipos de pregunta (multiple/ordering/matching) + generación por IA. Migrarlo sin diseño de referencia es alto riesgo de romper un flujo crítico de creación de contenido. Los tokens `brand`/`surface`/`ink` de `tailwind.config.js` y sus overrides de `html.dark` en `src/index.css` se mantienen exclusivamente por este archivo — documentado con un comentario en `tailwind.config.js`. Queda pendiente un spec futuro que traiga un diseño Glassmorphism para el editor de preguntas y complete la limpieza total.
2. **QA visual no verificada en navegador real** — el spec se implementó y verificó por build/lint/inspección de código contra los PNG de referencia, sin sesión de navegador disponible en esta ejecución. Antes de mergear se recomienda correr `npm run dev` y comparar las 7 pantallas en 390/768/1440px, light y dark, contra `export/` y `export_mobile/`.
3. **`npx vitest run` no se usa actualmente en el panel de Admin** — no hay tests para las páginas de Admin (confirmado en `CLAUDE.md`: "Sin test runner configurado actualmente" para este panel específicamente); la verificación de flujos fue por inspección de que la lógica (hooks, handlers, queries) no cambió línea por línea respecto al código pre-spec, solo el markup/clases.
4. **Bug preexistente detectado, no corregido** (fuera de scope): `QuestionCard.jsx` tiene clases con doble modificador de opacidad inválido en Tailwind (`bg-zen-success/100/10`, `bg-zen-danger/100/15`, etc.) — probablemente de una migración anterior. No es un token legacy y no estaba en el scope de este spec; se documenta para un fix futuro.
