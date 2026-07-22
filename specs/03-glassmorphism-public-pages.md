# SPEC 03 — Glassmorphism en páginas públicas

> **Status:** Implementado
> **Depends on:** 02-glassmorphism-design-system
> **Date:** 2026-07-22
> **Objective:** Aplicar el sistema de diseño Glassmorphism a todas las páginas públicas (Login, Registro, auth secundarias, Explorar, Detalle Examen, Planes, Simuladores/About, Contacto, legales y Mantenimiento) mediante un `PublicLayout` compartido, usando `export/` y `export_mobile/` como referencia.

> **Referencia de diseño:** `C:\Users\david.betancur_pragm\Desktop\Proyectos\pen\certzen` — `export/` (desktop 1440px) y `export_mobile/` (390px), Light y Dark.

---

## Scope

**In:**

- **`PublicLayout`** (`src/components/layout/PublicLayout.jsx`): nav glass (logo gradiente + Ingresar + Registro gratis, versión logueada con Pro/Dashboard/Perfil) + `PageBackground` + `Footer variant="glass"`. Se extrae del Home actual y el Home se refactoriza para usarlo.
- **Login** (`/login`) y **Registro** (`/register`): card glass centrada con logo arriba y tagline "Domina tu certificación", inputs `GlassInput` con icono, CTA gradiente, botón Google glass, links violeta — fiel a los PNG. El captcha existente se restyla como el widget "Verificación de seguridad" del diseño.
- **Auth secundarias sin PNG** (`/forgot-password`, `/verify-email`, `/auth/action`) y **MaintenancePage**: mismo patrón de card glass centrada, por extensión.
- **Explorar** (`/explore`): header + buscador glass, contador de resultados, grid de cards de sets (icono, badge "CertZen Oficial", rating, nº preguntas/intentos, bookmark) y CTA final — misma lógica de búsqueda/datos actual.
- **Detalle Examen** (`/exam-sets/:slug`): restyle según su PNG, sin tocar lógica.
- **Planes** (`/pricing`): cards Free y Pro (borde indigo + badge "RECOMENDADO"), estados "Tu plan actual"/"Actualizar a Pro" — lógica de planes intacta.
- **Simuladores** (`/about`): la página se convierte en la landing del diseño "Simuladores" (hero, Cómo funciona 01–04, 6 features, CTA). El link "Sobre CertZen" del footer pasa a "Simuladores".
- **Contacto, Privacidad, Términos**: restyle según sus PNG (contenido legal intacto).
- **Examen (`/exam`)** *(ampliación aprobada durante la implementación)*: adaptación glass por extensión (fondo, cards de pregunta, controles, timer) — no existe PNG de esta pantalla; el demo es accesible desde el Home público y el salto visual era brusco. El pulido fino con la app llegará en el Spec 04.
- **Responsive**: cada página según su par en `export_mobile/` (390px).
- Todas las páginas con Light + Dark vía la clase `.dark` existente.

**Out of scope:**

- App autenticada (Inicio, Biblioteca, Mis Sets, Crear Examen, Resultados, Revisión, Dashboard, Perfil, Settings) → Spec 04.
- Admin completo → Spec 05.
- Funcionalidad nueva: sin cambios en queries, auth, planes/pagos, captcha, analytics o SEO (solo capa visual y el contenido de `/about`).
- Resultados (`/results`) → Spec 04. (`/exam` entró al scope por ampliación aprobada — ver arriba.)
- Eliminación de tokens/variante legacy del Footer — sigue pendiente hasta el spec 05.

---

## Data model

No introduce datos nuevos ni cambia estructuras existentes. Todas las páginas siguen leyendo de las mismas fuentes (Firestore para sets/ratings, `useUserPlan` para planes, `useAuthStore`/`useThemeStore` para sesión y tema). El contenido de la landing Simuladores es estático (constantes en el componente, con i18n Lingui como el resto).

---

## Implementation plan

1. **`PublicLayout`**: extraer nav glass + `PageBackground` + `Footer variant="glass"` del Home a `src/components/layout/PublicLayout.jsx` y refactorizar `WelcomePage` para usarlo. Verificar: Home idéntico al del spec 02 (sin regresión visual).
2. **Login + Registro**: restyle con card glass centrada según sus PNG desktop/mobile; captcha restylado como widget "Verificación de seguridad". Verificar: login/registro reales funcionan (email y Google) en light/dark.
3. **Auth secundarias + Mantenimiento**: aplicar el patrón card glass a `/forgot-password`, `/verify-email`, `/auth/action` y `MaintenancePage`. Verificar: flujo de recuperación de contraseña completo sin errores visuales.
4. **Explorar**: restyle de buscador, contador, grid de cards y CTA según PNG. Verificar: búsqueda, ratings y navegación a detalle funcionan igual; comparación visual contra PNG.
5. **Detalle Examen**: restyle según PNG. Verificar: carga por slug, botones de inicio de examen intactos.
6. **Planes**: restyle cards Free/Pro con estados según sesión/plan. Verificar: flujo "Actualizar a Pro" intacto (hasta el checkout).
7. **Simuladores (`/about`)**: reemplazar el contenido por la landing del diseño y renombrar el link del footer. Verificar: SEO/canonical de la ruta se mantiene.
8. **Contacto + Privacidad + Términos**: restyle conservando el contenido. Verificar: formulario de contacto envía igual que antes.
9. **QA final**: overflow horizontal 0 px en 390/768/1440 en las 12 páginas, toggle light/dark en vivo, `npm run build` + lint sin errores nuevos, screenshots comparativos contra `export/` y `export_mobile/`.

Cada paso deja el sistema funcional (páginas se migran de a una; las no migradas conservan el look legacy mientras tanto).

---

## Acceptance criteria

- [x] Existe `src/components/layout/PublicLayout.jsx` y el Home lo usa sin cambios visuales respecto al spec 02.
- [x] Las 12 páginas públicas (Login, Registro, ForgotPassword, VerifyEmail, AuthAction, Mantenimiento, Explorar, Detalle Examen, Planes, Simuladores/About, Contacto, Privacidad, Términos) usan el estilo glass — ninguna página pública conserva el look legacy. (Además, `/exam` se adaptó por la ampliación de scope aprobada.)
- [x] Login, Registro, Explorar, Detalle, Planes, Simuladores, Contacto y legales replican sus PNG de `export/` en desktop 1440px y los de `export_mobile/` en 390px (estructura, colores, jerarquía).
- [x] Flujos verificados sin regresión: login con email y Google, registro, recuperar contraseña, búsqueda en Explorar, navegación a detalle y arranque de examen, "Actualizar a Pro" hasta checkout, envío del formulario de contacto.
- [x] El link del footer "Sobre CertZen" ahora dice "Simuladores" y apunta a `/about`.
- [x] Toggle light/dark/auto cambia todas las páginas en vivo sin recargar.
- [x] 0 px de overflow horizontal en 390, 768 y 1440 px en las 12 páginas; touch targets ≥44px.
- [x] `npm run build` pasa y el lint no suma errores sobre la línea base actual (109).

---

## Decisions

- **Sí:** `/about` se convierte en la landing "Simuladores" del diseño en vez de crear una ruta nueva — reutiliza la ruta, su SEO y evita una página huérfana sin diseño.
- **Sí:** las páginas sin PNG (forgot-password, verify-email, auth-action, mantenimiento) se incluyen por extensión del patrón de Login — evita mezcla de estilos en el flujo de auth.
- **Sí:** `PublicLayout` compartido para nav/fondo/footer — elimina la duplicación que dejó el spec 02 en el Home.
- **Sí:** restyle sin funcionalidad nueva — todo lo que muestran los PNG (captcha, ratings, bookmark, planes) ya existe en el código; solo cambia la capa visual y el contenido de `/about`.
- **Sí:** referencia mobile = `export_mobile/` (390px), siguiendo la decisión registrada en el spec 02.
- **No:** rediseñar `/exam` y `/results` aunque sean públicas — comparten componentes con la app autenticada y van en el spec 04.
- **No:** tocar el `Footer` legacy ni eliminar tokens viejos — la limpieza va al final (spec 05).

---

## Risks

- **Regresión en flujos de auth** (login/registro son críticos) — mitigación: cambios solo de clases/markup visual, verificación manual de cada flujo en el paso correspondiente.
- **Deriva visual entre 12 páginas** — mitigación: todo pasa por `PublicLayout` y los componentes glass del spec 02; nada de estilos ad-hoc.
- **Contenido legal** (Privacidad/Términos) es largo y denso — riesgo de legibilidad sobre glass; mitigación: card de contenido con superficie `elevated` y contraste AA verificado.
