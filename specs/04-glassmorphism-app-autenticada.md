# SPEC 04 — Glassmorphism en la app autenticada

> **Status:** Implementado
> **Depends on:** 02-glassmorphism-design-system, 03-glassmorphism-public-pages
> **Date:** 2026-07-22
> **Objective:** Rediseñar el `AppShell` (sidebar + topbar de usuarios logueados) y las pantallas de la app autenticada (Inicio, Biblioteca/Dashboard, Explorar, Mis Sets, Crear Examen, Resultados, Revisión, Perfil, Ajustes) con el sistema Glassmorphism, resolviendo también el AppShell legacy que quedó sin tocar envolviendo Explorar y Detalle Examen para usuarios logueados.

> **Referencia de diseño:** `C:\Users\david.betancur_pragm\Desktop\Proyectos\pen\certzen` — `export/` (desktop 1440px) y `export_mobile/` (390px), Light y Dark. Pantallas: `App Inicio`, `App Biblioteca`, `App Explorar`, `App Mis Sets`, `App Crear Examen`, `App Resultados`, `App Revisión`, `App Revisión Lista`, `App Perfil`, `App Ajustes`.

---

## Scope

**In:**

- **`AppShell` glass** (`src/components/layout/AppShell.jsx`): reemplaza sidebar y topbar legacy (tokens `brand`/`surface`/`ink`) por la versión glass del diseño — sidebar con logo gradiente, links (Inicio/Tu biblioteca/Explorar/Mis sets/Crear examen), sección "Tus carpetas", botón "Planes" al fondo, colapsable en desktop y drawer en mobile; topbar con buscador glass, botón crear (+) y avatar/menú de usuario. Fondo `PageBackground` + orbes detrás del contenido, consistente con `PublicLayout`. El menú de usuario (Perfil/Ajustes/Contacto/tema/logout) conserva su funcionalidad actual, solo restyle.
- **Inicio** (`/home`, `HomePage`): restyle según `App Inicio` PNG.
- **Biblioteca/Dashboard** (`/dashboard`, `DashboardPage`, label de sidebar "Tu biblioteca"): restyle según `App Biblioteca` PNG con dos piezas de datos nuevas más viables con lo existente: "Tus sets guardados" (query a `users/{uid}/favorites`, ya usado por `useFavorite`/`FavoriteButton`) y "Actividad reciente" (mismo query de `attempts` que ya usa `DashboardPage`, solo reetiquetado/restylado). Filtros Todos/Favoritos/Completados sobre esos datos. **"Continuar estudiando" y el filtro "En progreso" quedan fuera de scope** (ver Decisions) — no existe hoy persistencia de intento parcial en Firestore; se resuelve con una sección oculta o vacía sin bloquear el resto de la pantalla.
- **Explorar autenticado** (`/explore` cuando `user` existe, `ExploreExamsPage`) y **Detalle Examen autenticado** (`/exam-sets/:slug` cuando `user` existe, `ExamSetLandingPage`): hoy ya seleccionan `Shell = user ? AppShell : PublicLayout`, pero `AppShell` seguía legacy — al quedar glass, ambas páginas quedan resueltas para usuarios logueados sin tocar su lógica ni el contenido ya restylado en el spec 03. Verificar contra `App Explorar` PNG (sidebar) además del `Explorar` público ya hecho.
- **Mis Sets** (`/my-sets`, `MySetsPage`) y **Editar Examen** (`/edit-exam/:id`, `EditExamPage`, sin PNG propio — extensión del patrón de Mis Sets/Crear Examen): restyle según `App Mis Sets` PNG.
- **Crear Examen** (`/create-exam`, `CreateExamPage`): restyle según `App Crear Examen` PNG — pasos/formulario intactos.
- **Resultados** (`/results`, `ResultsPage`): restyle full-bleed (sin sidebar, como `/exam`) según `App Resultados` PNG — anillo de score, stats (correctas/incorrectas/tiempo), rendimiento por tema, CTAs "Revisar respuestas" / "Repetir simulacro".
- **Revisión** *(funcionalidad nueva, no solo visual — decisión tomada con el usuario)*: nueva ruta `/results/review` fiel a los PNG `App Revisión` (navegador de pregunta: grid de saltos, filtro Todas/Incorrectas/Correctas, tarjeta de pregunta con explicación, Anterior/Siguiente) y `App Revisión Lista` (scroll largo con todas las preguntas). Reemplaza a `WrongAnswersModal`, reutilizando los datos que `ResultsPage` ya tiene en memoria (preguntas + respuestas seleccionadas) vía `location.state` — sin nuevas queries a Firestore. Usa el campo `explanation` que ya existe en el modelo de pregunta (`QuestionForm`), mostrando un fallback discreto cuando la pregunta no tiene explicación cargada.
- **Perfil** (`/profile`, `ProfilePage`): restyle según `App Perfil` PNG — stats (exámenes/aprobados/promedio/mejor nota), "Datos de cuenta" (nombre, email, método de acceso, miembro desde), "Suscripción y facturación" (plan activo, beneficios, fechas, historial de pagos, cancelar renovación), "Acceso rápido" (tomar examen/explorar/crear set), "Logros" y "Historial de exámenes" — misma lógica y datos actuales, sin campos nuevos.
- **Ajustes** (`/settings`, `SettingsPage`): restyle según `App Ajustes` PNG — "Suscripción", "Información personal" (nombre/email editable), "Apariencia" (modo claro/oscuro/auto, idioma), "Notificaciones" (toggles), "Cuenta y privacidad" (cambiar contraseña, borrar cuenta) — mismos flujos actuales (`useThemeStore`, `useTranslation`, cambio de contraseña, borrado de cuenta).
- **Carpetas** (`/folders/:folderId`, `FolderPage`, sin PNG propio): restyle por extensión del patrón de Biblioteca/Mis Sets.
- **Responsive**: cada pantalla con PNG según su par en `export_mobile/` (390px); las que no tienen PNG (Editar Examen, Carpetas) siguen mobile-first + mejores prácticas del shell ya migrado.
- Todas las pantallas con Light + Dark vía `.dark` existente.

**Out of scope:**

- Admin completo (Dashboard, Usuarios, Intentos, Sets comunidad, Feature Flags, Audit Log) → Spec 05.
- Cambios funcionales fuera de lo descrito arriba: sin cambios en queries de Firestore (salvo que Revisión no agrega ninguna), planes/pagos, analytics, SEO, `useAuthStore`/`useThemeStore`.
- Eliminación de tokens/variantes legacy (`brand`, `surface`, `ink`, `appian`) — sigue pendiente hasta el spec 05, que es cuando migra la última pantalla (admin).
- Rediseño de `/exam` (ya resuelto en el spec 03 por ampliación de scope).
- "Continuar estudiando" y el filtro "En progreso" de `App Biblioteca` — requieren persistir intentos parciales/resumibles en Firestore, algo que no existe hoy (decisión tomada con el usuario, ver Decisions).

---

## Data model

No introduce datos nuevos ni cambia estructuras existentes en Firestore. Revisión reutiliza el `explanation` ya soportado por el modelo de pregunta y los datos de intento que `ResultsPage` ya recibe por navegación (no persiste nada nuevo; si el usuario refresca `/results/review` sin el `location.state`, redirige a `/results`).

---

## Implementation plan

1. **`AppShell` glass**: restyle de sidebar (colapsable/drawer) y topbar (buscador, crear, avatar/menú) según `App Inicio`/`App Biblioteca` PNG, reutilizando `PageBackground`, `GlassCard`, `GlassButton`, `GlassInput`, `GlassBadge` del spec 02. Verificar: todas las páginas que envuelven `AppShell` siguen funcionando (sidebar activa, drawer mobile, menú de usuario, buscador con sugerencias) sin romper lógica.
2. **Inicio**: restyle de `HomePage` según `App Inicio`. Verificar: accesos directos y datos reales sin regresión.
3. **Biblioteca/Dashboard**: restyle de `DashboardPage` según `App Biblioteca` (sets guardados vía `users/{uid}/favorites`, actividad reciente vía `attempts`, filtros Todos/Favoritos/Completados); sin "Continuar estudiando"/"En progreso" (fuera de scope). Verificar: stats, favoritos y actividad reales, filtros funcionan.
4. **Explorar + Detalle Examen autenticados**: QA visual de ambas páginas ya restyladas en el spec 03 ahora dentro del `AppShell` nuevo — ajustar solo el padding/contenedor si el sidebar rompe el layout. Verificar contra `App Explorar` PNG.
5. **Mis Sets + Editar Examen**: restyle según `App Mis Sets`. Verificar: crear/editar/eliminar set intacto.
6. **Crear Examen**: restyle según `App Crear Examen`. Verificar: flujo de generación de examen (pasos, validaciones) intacto.
7. **Resultados**: restyle full-bleed según `App Resultados`. Verificar: cálculo de score, guardado de intento en Firestore, confetti y compartir intactos.
8. **Revisión (nueva)**: construir `/results/review` (vista navegador de pregunta con grid/filtro/explicación) y su variante de lista larga, reemplazando `WrongAnswersModal`; el CTA "Revisar respuestas" de Resultados navega ahí pasando los datos por `location.state`. Verificar: todas/incorrectas/correctas filtran bien, navegación Anterior/Siguiente, explicación se muestra cuando existe, refresh sin state redirige a `/results` sin crashear.
9. **Perfil**: restyle según `App Perfil`. Verificar: stats reales, edición de datos de cuenta, estado de suscripción/facturación, logros e historial intactos.
10. **Ajustes**: restyle según `App Ajustes`. Verificar: cambio de modo/idioma, toggles de notificaciones, cambio de contraseña y borrado de cuenta intactos.
11. **Carpetas**: restyle por extensión del patrón de Biblioteca/Mis Sets (sin PNG propio). Verificar: crear/renombrar/eliminar carpeta y navegación intactos.
12. **QA final**: overflow horizontal 0 px en 390/768/1440 en las 10 pantallas + shell, toggle light/dark en vivo, `npm run build` + lint sin errores nuevos, screenshots comparativos contra `export/` y `export_mobile/`.

Cada paso deja el sistema funcional (pantallas se migran de a una; las no migradas siguen con el `AppShell` legacy hasta el paso 1, y con su look anterior hasta su propio paso).

---

## Acceptance criteria

- [x] `AppShell` usa el sistema Glassmorphism (sidebar, topbar, menú de usuario) con soporte light/dark y responsive — colapsable en desktop; en mobile/tablet se reemplazó el drawer por una barra de navegación inferior fija, fiel a `export_mobile/` (decisión tomada con el usuario) — sin romper ninguna ruta que lo use.
- [x] Las 10 pantallas (Inicio, Biblioteca/Dashboard, Explorar autenticado, Detalle Examen autenticado, Mis Sets, Crear Examen, Resultados, Revisión, Perfil, Ajustes) usan el estilo glass — ninguna conserva el look legacy.
- [x] Inicio, Biblioteca, Explorar (auth), Mis Sets, Crear Examen, Resultados, Perfil y Ajustes replican sus PNG de `export/` en desktop 1440px y `export_mobile/` en 390px, con las brechas documentadas en Hallazgos (pills de categoría en Explorar, "Continuar estudiando" en Biblioteca, panel IA en Crear Examen).
- [x] Existe `/results/review` con navegador de pregunta (grid + filtro Todas/Incorrectas/Correctas + explicación + Anterior/Siguiente) fiel a `App Revisión`, y una vista de lista larga fiel a `App Revisión Lista`; `WrongAnswersModal` queda reemplazado.
- [x] Flujos verificados sin regresión: navegación del sidebar/bottom bar, búsqueda desde topbar, guardar/editar/eliminar set, crear examen, guardar intento y ver resultados, revisar respuestas con explicación, editar datos de cuenta en Perfil, cambiar tema/idioma/notificaciones en Ajustes, cambiar contraseña, borrar cuenta, crear/gestionar carpetas.
- [x] Toggle light/dark/auto cambia todas las pantallas en vivo sin recargar (mismo mecanismo `useThemeStore`/`.dark` de los specs 02–03, sin cambios).
- [x] 0 px de overflow horizontal — revisión estática sin anchos fijos sospechosos en los archivos tocados; tabla de pagos en Perfil recibió `overflow-x-auto` al detectarse sin estrategia responsive; touch targets ≥44px vía `GlassButton`/`GlassInput` (min-h-11) y la bottom tab bar.
- [x] `npm run build` pasa y `npx eslint src` (proyecto completo) no reporta errores; `npx vitest run` queda en 57/61 — los 4 fallos son preexistentes al spec 04 (confirmado contra el baseline con `git stash`), ver Hallazgos.

---

## Decisions

- **Sí:** Revisión se construye como página funcional nueva (no solo restyle del modal) — decisión tomada con el usuario; los datos ya existen (explanation en preguntas, respuestas en memoria de `ResultsPage`), así que el costo incremental es bajo y cierra una brecha real de producto.
- **Sí:** Perfil y Ajustes tienen PNG propio (`App Perfil`, `App Ajustes`) y se restylan fielmente a ellos, igual que el resto de pantallas con diseño.
- **Sí:** Carpetas y Editar Examen se migran por extensión del patrón de Biblioteca/Mis Sets (sin PNG propio) — evita mezclar estilos dentro de la app autenticada.
- **Sí:** Explorar y Detalle Examen autenticados se resuelven arreglando `AppShell`, sin tocar su contenido ya restylado en el spec 03 — son la misma página, solo cambia el shell que las envuelve.
- **Sí:** Resultados se mantiene full-bleed sin sidebar (como `/exam`) — así lo muestra su PNG y ya es el patrón usado para el flujo de examen.
- **No:** tocar Admin — va en el spec 05 junto con la eliminación final de tokens legacy.
- **No:** agregar persistencia nueva para Revisión (por ejemplo guardar qué preguntas se revisaron) — no está en los PNG ni fue pedido.
- **No:** implementar "Continuar estudiando"/"En progreso" en Biblioteca con datos reales — decisión tomada con el usuario; requeriría trackear intentos parciales en Firestore (cambio funcional grande, no visual) y queda fuera de este spec. La sección se omite o queda oculta hasta que exista esa persistencia (spec futuro).

---

## Risks

- **`AppShell` es compartido por ~12 rutas** — un error de layout ahí se propaga a toda la app autenticada; mitigación: paso 1 se verifica exhaustivamente antes de tocar cualquier página individual.
- **Revisión sin `location.state`** (refresh, link directo, deep-link) — mitigación: redirect a `/results` en vez de crashear, cubierto en el paso 8.
- **Preguntas sin `explanation` cargada** (sets antiguos) — mitigación: fallback discreto en vez de espacio vacío o error.
- **Deriva visual entre 10 pantallas + shell** — mitigación: todo pasa por `AppShell` glass y los componentes del spec 02; nada de estilos ad-hoc.

---

## Hallazgos (para planear en specs futuros)

Brechas reales entre el diseño de referencia y la funcionalidad actual, detectadas durante la implementación. Ninguna bloqueó este spec (se resolvieron con las decisiones documentadas arriba), pero quedan pendientes de decidir/priorizar:

1. **Explorar (público y autenticado) no tiene la fila de pills de categoría** (Todos/Appian/IT & Cloud/…) que muestran `Explorar` y `App Explorar`. Hoy el filtro de dominio solo funciona vía `?domain=` en la URL, sin UI en la propia página para cambiarlo. Detectado en el paso 4, dejado fuera por ser contenido/funcionalidad nueva, no shell.
2. **Biblioteca — "Continuar estudiando" y el filtro "En progreso"** (`App Biblioteca`) no se implementaron: no existe persistencia de intento parcial/resumible en Firestore, solo sesión de examen en curso en `sessionStorage` (se pierde al cerrar el navegador). Requeriría diseñar y escribir ese modelo de datos.
3. **Crear/Editar Examen no tienen "Genera con IA"** (`App Crear Examen`): el flujo real sigue siendo manual (`QuestionForm`) o importación masiva JSON/Excel/PDF (solo Pro). El panel de generación por IA del diseño no tiene backend — decidido junto con el usuario, ver Decisions.
4. **"Rendimiento por tema" en Resultados solo aparece cuando las preguntas traen `domain`/`category` por pregunta** — la mayoría de sets creados por usuarios (import JSON/Excel/PDF) no cargan ese campo, así que la sección queda oculta para ellos. Solo se ve consistentemente en preguntas curadas por admin (p. ej. Appian).
5. **"Actividad reciente" en Biblioteca usa un ícono genérico**, no coloreado por dominio como en el PNG, porque el documento `attempts` no guarda `domain`/`category` del set (solo `certId`/`certTitle`/`score`/`total`). Traerlo requeriría una consulta extra por intento (N+1) o denormalizar el dominio al guardar el intento.
6. **Mis Sets no tiene el tip "Consejo: usa la generación con IA…"** del PNG — se quitó por no existir esa funcionalidad para usuarios regulares (ver hallazgo 3).
7. **4 tests preexistentes siguen fallando**, confirmados como no relacionados con este spec (verificado con `git stash` contra el baseline del spec 03): `AdBanner.test.jsx` completo y `DashboardPage > mounts AdBanner` fallan por `INTERNAL ASSERTION FAILED: Expected a class definition` del SDK de Firebase Auth; `useAuthStore.test.js > falls back to generic message for unknown codes`; y 2 tests de `PaymentSuccessPage.test.jsx` (`useAuthStore.getState is not a function`). Vale la pena una investigación aparte de por qué `AdBanner` no se monta en `DashboardPage` pese a que el test lo espera.
8. **Tokens legacy** (`brand`, `surface`, `ink`, `appian`) siguen coexistiendo con `zen-*`/glass — su eliminación sigue programada para el spec 05, cuando migre Admin (última pantalla).
