# SPEC 07 — Flashcards (modo de estudio adicional)

> **Status:** Approved
> **Depends on:** —
> **Date:** 2026-07-27
> **Objective:** Agregar un modo de estudio "Flashcards" independiente (sin integrarse con Leitner/SRS existente) que permita al usuario repasar las preguntas de un exam set volteando tarjetas pregunta/respuesta, fiel al diseño Glassmorphism de `export_flash`.

---

## Scope

**In:**

- Nueva feature `src/features/flashcards/`:
  - `pages/FlashcardsPage.jsx` — orquesta la sesión completa (carga, tarjeta actual, resumen final).
  - `components/FlashcardView.jsx` — tarjeta con flip 3D (Framer Motion, `rotateY`). Cara frontal: badge "PREGUNTA" + `question` + el material de la pregunta **sin revelar la respuesta correcta** (ver tabla abajo) + hint "Toca la tarjeta o presiona espacio para voltear". Cara trasera: badge "RESPUESTA" + el mismo material con la respuesta correcta **revelada/resaltada** (ver tabla) + `explanation` (si existe) + botones "No la sabía" / "La sabía".
  - `components/FlashcardControls.jsx` — "Mezclar", "Voltear tarjeta" y "Reiniciar", layout responsivo (fila en desktop, apilado en mobile, según mockup).
  - `components/FlashcardArrowNav.jsx` — botón circular flotante "Anterior"/"Siguiente" a cada lado de la tarjeta, visible solo en desktop (`lg:` — fiel a los mockups "Glassmorphism" 1440px, que muestran flechas circulares flanqueando la tarjeta en vez de una tira de indicadores).
  - `components/FlashcardCardPicker.jsx` — modal "Ir a una tarjeta" (reutiliza `src/components/ui/Modal.jsx`) con una grilla de botones numerados (uno por tarjeta), coloreados por estado (violeta = actual, verde = dominada, rojo = a repasar, gris = pendiente) + leyenda, fiel a los mockups "App Flashcards Selector". Click en un número navega y cierra el modal.
  - `components/FlashcardSummary.jsx` — pantalla de resumen al terminar el mazo.
  - `hooks/useFlashcards.js` — carga **todas** las preguntas del `examSet` (sin filtrar por `type`), maneja índice actual, navegación (anterior/siguiente/salto directo), orden (shuffle) y el registro de estado ("la sabía"/"no la sabía") por tarjeta.
- **Navegación entre tarjetas (corrección post-implementación, ajustada a los mockups "App Flashcards Selector" agregados al diseño):**
  - **Desktop (`lg:` y superior):** flechas circulares flotantes (`FlashcardArrowNav`) a los lados de la tarjeta, más un ícono de grilla en la fila del contador que abre `FlashcardCardPicker`.
  - **Mobile/tablet (`<lg`):** flechas pequeñas inline junto al texto "Tarjeta N de M" (sin flechas flotantes, que no caben en esos anchos), más el mismo ícono de grilla.
  - El usuario ya no depende solo del auto-avance al marcar — puede moverse libremente hacia atrás/adelante o saltar directo a cualquier tarjeta desde el picker. Volver a una tarjeta ya marcada muestra su estado (badge en la tarjeta + color en su casilla del picker) y permite volver a marcarla; la marca más reciente sobrescribe la anterior (nunca cuenta doble en el resumen).
  - **Decisión de implementación:** `FlashcardCardPicker` reutiliza el componente `Modal` compartido (centrado, ya usado en el resto de la app) en todos los breakpoints — el mockup mobile muestra un bottom-sheet (hoja deslizante desde abajo con manija), pero construir una variante de modal nueva solo para esta pantalla se consideró alcance innecesario; el modal centrado ya existente cumple la misma función (elegir tarjeta) sin duplicar componentes de UI.
- **Frente y reverso por tipo de pregunta** (corrección: el frente ahora sí muestra las opciones/términos/items, para que el usuario pueda "elegir mentalmente" antes de voltear y comprobar si acertó):

  | Tipo | Cara frontal (sin revelar) | Cara trasera (revelada) |
  |---|---|---|
  | `multiple` | Lista de opciones con su letra (A, B, C…), sin marcar cuál es correcta. | La misma lista de opciones, con la(s) correcta(s) resaltada(s) en verde con check; el resto en estilo neutro. |
  | `matching` | Lista de términos (`pairs[].term`) y, debajo, el banco de posibles definiciones (`matches`), sin emparejar. | Lista de pares "Término → Definición correcta", uno por línea. |
  | `ordering` | Lista de los items (`items`) en su orden original de almacenamiento (no es el orden correcto). | Lista numerada (1, 2, 3…) con los items en su `correctOrder`. |

  En los tres casos, la cara trasera termina con `explanation` si el documento la tiene.
- **Badge de estado en la tarjeta:** si la tarjeta actual ya fue marcada antes (navegando de vuelta a ella), `FlashcardView` muestra un badge pequeño junto al badge "PREGUNTA"/"RESPUESTA" — verde "✓ La sabías" si su estado es `known`, ámbar "↻ A repasar" si es `unknown`. No se muestra badge si la tarjeta aún no fue marcada.
- **Animaciones (Framer Motion, ya es dependencia del proyecto):**
  - Flip 3D suave (`rotateY`) al voltear la tarjeta pregunta↔respuesta.
  - Transición de entrada/salida (slide + fade) al avanzar a la siguiente tarjeta tras marcar "La sabía"/"No la sabía".
  - Transición al mezclar el mazo ("Mezclar") — la tarjeta actual sale y la nueva primera tarjeta entra con la misma animación de slide/fade.
  - Transición hacia `FlashcardSummary` al terminar el mazo (fade/scale de entrada).
  - Barra de progreso animada (ancho interpolado) al cambiar de tarjeta.
  - Cambio de altura de la tarjeta animado (`layout`) entre tarjetas de distinto tipo/longitud de reverso.
- Ruta `/flashcards/:slug` en `src/core/router/AppRouter.jsx` — **pública** (corrección post-implementación, ver abajo), igual que `/exam`.
- Botón "Estudiar con Flashcards" en `src/features/exam/pages/ExamSetLandingPage.jsx` (o donde esté el CTA de examen), visible si el set tiene ≥1 pregunta (de cualquier tipo).
- Soporte responsive completo (mobile/tablet/desktop) y light/dark, fiel a los 12 mockups de `export_flash` (8 de tarjeta pregunta/reverso + 4 de "Selector" agregados para la navegación).
- Atajo de teclado "espacio" para voltear en desktop (hint de texto solo visible en desktop, como en el mockup).
- **Demo pública sin login (agregado post-implementación):** las tarjetas "Flashcards" y "Repaso Rápido" del Home público (`WelcomePage.jsx`, antes marcadas `available: false` / "Próximamente") se habilitan:
  - "Flashcards" → navega a `/flashcards/demo`. `slug === 'demo'` en `useFlashcards.js` carga las mismas `DEMO_QUESTIONS` hardcodeadas que usa el demo de `/exam`, sin tocar Firestore.
  - "Repaso Rápido" → navega a `/exam?cert=demo&mode=study&count=10` (ya funcionaba de fondo, solo estaba oculta tras el flag `available`).
  - `DEMO_QUESTIONS` se mueve de `src/features/exam/hooks/useExam.js` a `src/core/constants/demoQuestions.js` para que ambas features puedan importarla sin violar la regla "features/A no puede usar features/B" de `src/CLAUDE.md`.
  - `FlashcardsPage.jsx` ya no depende de `ProtectedRoute`: hace su propio gate — `slug === 'demo'` es siempre pública; cualquier otro `slug` redirige a `/register` si no hay usuario autenticado (mismo criterio que ya aplicaba `ExamSetLandingPage.launchFlashcards` antes de navegar, ahora también cubre el acceso directo por URL).

**Out of scope:**

- Cualquier integración con Leitner/SRS/Zona Débil (`questionStats.js`) — módulo aparte, no se toca ni se lee.
- Persistencia de progreso entre sesiones (ninguna escritura nueva a Firestore).
- Racha de días (streak) — el badge del mockup se omite del layout.
- Bookmark/guardar tarjeta individual — se omite del layout.
- Pantalla de "lista de mazos" o ítem nuevo en el nav principal (`AppShell`) — el único punto de entrada es desde la página de un set específico.
- Analítica/eventos nuevos de GA4.
- Animaciones de física/gestos avanzados (swipe con `drag` de Framer Motion) — el swipe táctil no está pedido, la interacción es por botones/tap.

---

## Data model

No se crean datos nuevos en Firestore. Reutiliza `examSets/{setId}/questions` (colección ya existente) **sin filtrar por `type`** — entran `multiple`, `matching` y `ordering`.

Todo el estado de la sesión vive en memoria de React, dentro de `useFlashcards.js` (sin persistencia):

| Estado | Tipo | Descripción |
|---|---|---|
| `cards` | `Array<Question>` | Todas las preguntas del set, en el orden actual (original o mezclado). |
| `currentIndex` | `number` | Índice de la tarjeta visible (0-based). Se mueve con `previous()`, `next()` o `goToIndex(i)`. |
| `isFlipped` | `boolean` | Si la tarjeta actual muestra la cara de respuesta. Se resetea a `false` en cualquier navegación. |
| `statuses` | `Record<cardId, 'known' \| 'unknown'>` | Registro de la marca más reciente por tarjeta (clave = `card.id`, no el índice — sobrevive a la navegación libre; se limpia en `shuffle()`/`restart()`). |
| `knownCount` / `unknownCount` | `number` | Derivados de `statuses` (conteo de valores `'known'`/`'unknown'`) — nunca cuentan doble aunque una tarjeta se re-marque. |
| `isFinished` | `boolean` | `true` cuando `currentIndex` supera la última tarjeta (al marcar la última o pulsar "Siguiente" en ella) — dispara `FlashcardSummary`. |

`FlashcardView.jsx` deriva el contenido de AMBAS caras según `card.type` (frente sin marcar lo correcto, reverso marcándolo/revelándolo):
- `multiple` → frente: todas las entradas de `options` (letra + texto), sin indicar cuál es correcta. Reverso: las mismas entradas, resaltando las que están en `answer[]`.
- `matching` → frente: `pairs[].term` (lista de términos) + el banco `matches` (lista de definiciones), sin emparejar. Reverso: recorre `pairs` (`{term, correctMatch}`), resuelve el texto de cada `correctMatch` contra `matches` y muestra "término → definición correcta".
- `ordering` → frente: `items` en su orden de almacenamiento (no es el correcto). Reverso: recorre `correctOrder` y lo lista numerado.

No requiere cambios en `firestore.rules` (no hay escrituras nuevas).

---

## Implementation plan

1. **`hooks/useFlashcards.js`.** Recibe `slug`, reutiliza el mecanismo de carga de `examSets/{setId}/questions` que ya usa `useExam.js` para el modo `examSets`, **sin filtrar por `type`** — entran todas las preguntas del set. Expone `{ cards, currentIndex, current, isFlipped, statuses, currentStatus, flip(), next(), previous(), goToIndex(i), shuffle(), restart(), markKnown(), markUnknown(), knownCount, unknownCount, isFinished, isLoading, error }`. `next()`/`previous()`/`goToIndex(i)` mueven `currentIndex` (clamped en 0, `next()` puede exceder el último índice para disparar `isFinished`) y resetean `isFlipped` a `false`. `markKnown()`/`markUnknown()` escriben `statuses[current.id]` ('known'/'unknown', sobrescribiendo si ya existía) y llaman `next()` automáticamente. `knownCount`/`unknownCount` se derivan de `statuses`. `shuffle()`/`restart()` limpian `statuses`. Test manual: consumir el hook con un set mixto, marcar una tarjeta, navegar hacia adelante y volver con `previous()`/`goToIndex()`, confirmar que `currentStatus` refleja la marca guardada.

2. **`components/FlashcardView.jsx`.** Tarjeta con flip 3D (Framer Motion, `rotateY` + `backfaceVisibility: hidden` en ambas caras). Cara frontal: badge "PREGUNTA" (+ badge de estado si `status` está definido, ver Scope), `question` + material sin revelar (opciones/términos+banco/items, ver Data model) + hint (solo desktop) "Toca la tarjeta o presiona espacio para voltear". Cara trasera: badge "RESPUESTA" (+ badge de estado) + el mismo material con lo correcto resaltado/revelado (ver Data model) + `explanation` si existe + botones "No la sabía"/"La sabía". Listener de teclado (`keydown` en `document`, tecla `Espacio`) que llama `flip()` mientras el componente está montado. Responsive fiel a mockups mobile/desktop, light/dark con tokens Glassmorphism (`glass-light-*`/`glass-dark-*`). Scroll interno en el contenido de cada cara si excede la altura disponible. Test manual: montar con una tarjeta de cada tipo (mock) y con distintos valores de `status`, confirmar que el badge de estado aparece/no aparece correctamente, en 390px y 1440px, light y dark.

3. **`components/FlashcardControls.jsx`.** Botones "Mezclar" (`shuffle()`), "Voltear tarjeta" (`flip()`, centrado y destacado) y "Reiniciar" (`restart()`). Layout: fila en desktop (Mezclar / Voltear tarjeta / Reiniciar), apilado en mobile (botón "Voltear tarjeta" ancho arriba + fila de "Mezclar"/"Reiniciar" debajo), según mockup. Test manual: mezclar a mitad de sesión y confirmar que el orden y `statuses` se reinician; reiniciar y confirmar que el orden NO cambia pero `statuses` sí se limpia.

4. **`components/FlashcardArrowNav.jsx` + `components/FlashcardCardPicker.jsx`.** `FlashcardArrowNav`: botón circular (`previous()`/`next()`), oculto por defecto y visible desde `lg:` — flanquea la tarjeta en `FlashcardsPage.jsx`, deshabilitado ("Anterior") en `currentIndex === 0`. `FlashcardCardPicker`: modal (`Modal` compartido) con grilla de botones numerados por tarjeta, color según `statuses[card.id]` (violeta=actual, verde=`known`, rojo=`unknown`, gris=sin marcar) + leyenda; click llama `goToIndex(i)` y cierra el modal. En `FlashcardsPage.jsx`, un ícono de grilla en la fila del contador abre el picker; en `<lg` se agregan flechas pequeñas inline junto a "Tarjeta N de M" (las flotantes de `FlashcardArrowNav` quedan ocultas en esos anchos). Test manual: marcar varias tarjetas salteadas, abrir el picker y confirmar que sus casillas cambian de color; saltar con click; probar las flechas flotantes en desktop y las inline en mobile/tablet.

5. **`components/FlashcardSummary.jsx`.** Pantalla de resumen: "`knownCount` de `cards.length` dominadas", botón "Repasar de nuevo" (llama `restart()` y oculta el resumen) y botón "Salir" (navega de vuelta a `/exam-sets/:slug`). Animación de entrada (fade/scale) al mostrarse. Test manual: completar el mazo mixto completo, incluyendo re-marcar alguna tarjeta antes de terminar, y confirmar que el resumen cuenta cada tarjeta una sola vez según su última marca.

6. **`pages/FlashcardsPage.jsx`.** Layout de página (header con `PageBackground`/`GlassOrbs`, contador "Tarjeta N de M" + barra de progreso animada, sin badge de racha), integra `FlashcardView` + `FlashcardNavigator` + `FlashcardControls`, renderiza `FlashcardSummary` cuando `isFinished`. Botón "Salir" (X) en el header que navega a `/exam-sets/:slug`. Maneja estados de carga (`isLoading`) y error (`error`, o mazo vacío si el set no tiene preguntas). Test manual: recorrer sesión completa punta a punta con un set mixto, usando tanto el auto-avance como la navegación manual.

7. **Ruta + punto de entrada.** Agregar `/flashcards/:slug` en `AppRouter.jsx` (lazy + `ProtectedRoute requireUser`). Agregar botón "Estudiar con Flashcards" en `ExamSetLandingPage.jsx`, oculto si el set no tiene ninguna pregunta. Test manual: desde la página de un set, click en el botón, confirmar navegación a `/flashcards/:slug`.

8. **Verificación final.** `npm run build` y `npx eslint src` sin errores. Prueba manual completa en `npm run dev`: 390/768/1440px × light/dark, con un set que mezcle `multiple`, `matching` y `ordering`, cubriendo el flujo íntegro (voltear, verificar los 3 formatos de reverso, navegar con Anterior/Siguiente/indicadores, marcar y re-marcar tarjetas, mezclar, reiniciar, llegar al resumen, "Repasar de nuevo", "Salir").

---

## Acceptance criteria

- [ ] Desde `ExamSetLandingPage.jsx`, un set con al menos 1 pregunta (de cualquier tipo) muestra el botón "Estudiar con Flashcards" que navega a `/flashcards/:slug`.
- [ ] Un set sin ninguna pregunta NO muestra el botón (o lo muestra deshabilitado con mensaje) — sin mazo vacío accesible.
- [ ] La cara frontal de la tarjeta muestra `question`, badge "PREGUNTA", el hint de voltear (hint de teclado visible solo en desktop) y el material de la pregunta sin revelar la respuesta correcta:
  - [ ] `multiple` → todas las opciones (letra + texto), sin marcar cuál es correcta.
  - [ ] `matching` → lista de términos + banco de definiciones, sin emparejar.
  - [ ] `ordering` → lista de items en su orden de almacenamiento (no el correcto).
- [ ] Al voltear (click en la tarjeta o botón "Voltear tarjeta" en `FlashcardControls`, o barra espaciadora en desktop), la tarjeta gira con animación 3D y muestra badge "RESPUESTA" + el mismo material con lo correcto revelado según el tipo:
  - [ ] `multiple` → las mismas opciones del frente, con la(s) correcta(s) resaltada(s) en verde con check.
  - [ ] `matching` → lista de pares "Término → Definición correcta".
  - [ ] `ordering` → lista numerada con el orden correcto.
  - En los tres casos, seguido de `explanation` si el documento la tiene.
- [ ] Pulsar "La sabía" o "No la sabía" registra el estado de esa tarjeta, anima la transición y avanza automáticamente a la siguiente tarjeta (volviendo a mostrar la cara PREGUNTA).
- [ ] El usuario puede navegar libremente hacia atrás/adelante — flechas circulares flotantes en desktop (`lg:`), flechas inline junto al contador en mobile/tablet — y saltar directo a cualquier tarjeta desde el picker (`FlashcardCardPicker`, abierto con el ícono de grilla) — no depende únicamente del auto-avance.
- [ ] Al volver a una tarjeta ya marcada, se muestra un badge de estado en la tarjeta (verde "La sabías" / ámbar "A repasar") y su casilla en `FlashcardCardPicker` refleja el color correspondiente (verde=dominada, rojo=a repasar).
- [ ] Volver a marcar una tarjeta ya marcada (con la opción contraria) sobrescribe su estado — el resumen final nunca la cuenta dos veces.
- [ ] El contador "Tarjeta N de M" y la barra de progreso reflejan el índice actual y se animan al cambiar de tarjeta.
- [ ] "Mezclar" reordena aleatoriamente el mazo (mezclando los tres tipos entre sí), reinicia la sesión desde la tarjeta 1 y limpia todas las marcas.
- [ ] "Reiniciar" vuelve a la tarjeta 1 sin cambiar el orden actual y limpia todas las marcas.
- [ ] Al terminar la última tarjeta (marcándola o pulsando "Siguiente" en ella), aparece `FlashcardSummary` con "`knownCount` de `M` dominadas" (conteo derivado de las marcas únicas por tarjeta) y los botones "Repasar de nuevo" (reinicia el mazo) y "Salir" (vuelve a `/exam-sets/:slug`).
- [ ] Nada de esta feature escribe en Firestore ni lee/modifica `users/{uid}/questionStats` — verificado por inspección de código (no imports de `questionStats.js` en `src/features/flashcards/`).
- [ ] El layout responde fielmente a los 4 breakpoints/temas del mockup (`export_flash`) en mobile (390px), tablet (768px) y desktop (1440px), light y dark.
- [ ] `npm run build` pasa sin errores.
- [ ] `npx eslint src` sin errores ni warnings.

---

## Decisions

- **Sí:** modo de estudio completamente independiente de Leitner/SRS/`questionStats.js` — decisión explícita del usuario para no complicar ni acoplarse a la metodología existente ("eso es para el resto de fases").
- **Sí:** sin persistencia entre sesiones — cero escrituras nuevas a Firestore, todo el estado vive en memoria de React dentro de `useFlashcards.js`. Mantiene el spec pequeño y evita decisiones difíciles sobre qué pasa si cambian las preguntas del set entre sesiones.
- **Sí (revertido durante la sesión de definición):** el mazo incluye **todos los tipos de pregunta** (`multiple`, `matching`, `ordering`), no solo `multiple` como se había decidido inicialmente. El usuario pidió explícitamente ampliarlo; se resolvió el problema original (matching/ordering sin formato de "opción correcta") definiendo un reverso específico por tipo: pares emparejados para `matching`, orden correcto numerado para `ordering`, opciones correctas para `multiple`.
- **Sí:** autoevaluación simplificada a 2 botones ("No la sabía"/"La sabía") en vez de los 3 del mockup — decisión explícita del usuario para evitar arrastrar semántica de repetición espaciada a un modo que se pidió "más básico".
- **No:** racha de días (streak) — requiere lógica nueva de actividad diaria/timezone que merece su propio spec; se omite el badge del layout en vez de mostrarlo como placeholder sin función.
- **No:** bookmark por tarjeta — sin persistencia entre sesiones no tiene una función real que cumplir en este alcance; se omite del layout en vez de dejarlo decorativo/confuso.
- **Sí (revertido durante la implementación):** el frente de la tarjeta SÍ muestra las opciones/términos+banco/items (sin marcar cuál es correcta) — decisión explícita del usuario al ver la primera versión: quiere poder "elegir mentalmente" antes de voltear y comprobar si acertó al ver el reverso. Se aparta del mockup original (que solo mostraba la pregunta en el frente), documentado aquí como corrección post-implementación.
- **Sí:** para respuesta múltiple, matching y ordering, se lista el contenido correcto completo (opciones resaltadas, pares, orden) en vez de solo mostrar la explicación — más útil como material de estudio y para comparar contra lo que el usuario vio en el frente.
- **Sí:** único punto de entrada desde `ExamSetLandingPage.jsx`, sin nuevo ítem en el nav principal ni pantalla de selección de mazo — el mockup no incluye esas pantallas, y agregar un selector de sets sería expandir el alcance sin pedido explícito.
- **Sí:** se agregan animaciones de transición (flip 3D, slide/fade entre tarjetas, transición al mezclar y al mostrar el resumen, barra de progreso animada, cambio de altura animado) con Framer Motion — pedido explícito del usuario, y la librería ya es dependencia usada en toda la app.
- **No:** interacción por swipe/gestos táctiles (`drag` de Framer Motion) — no se pidió; la interacción es por tap/click y botones.
- **Sí (agregado post-implementación):** navegación libre entre tarjetas además del auto-avance al marcar — pedido explícito del usuario para poder revisar tarjetas ya vistas.
- **Sí (ajustado tras ver mockups "Selector"):** la navegación NO es una tira de indicadores siempre visible (primer intento) sino flechas circulares flotantes en desktop + flechas inline en mobile/tablet, con un modal "Ir a una tarjeta" (`FlashcardCardPicker`) para salto directo — el usuario pidió explícitamente seguir el diseño de las imágenes, que agregó 4 mockups nuevos ("App Flashcards Selector") mostrando exactamente este patrón.
- **Sí:** el registro "la sabía"/"no la sabía" se guarda por `card.id` (no por índice) en `statuses`, se muestra como badge en la tarjeta y como color en la casilla correspondiente del picker — consistente con el sistema de diseño Glassmorphism (mismos tonos verde/rojo que usa el resto de la app para correcto/incorrecto) y con la leyenda "Actual/Dominada/A repasar/Pendiente" del mockup.
- **No:** no se construye una variante de bottom-sheet para `FlashcardCardPicker` en mobile (el mockup mobile lo muestra así) — se reutiliza el `Modal` centrado ya existente en toda la app, evitando duplicar un patrón de UI solo para esta pantalla.
- **Sí:** re-marcar una tarjeta sobrescribe su estado anterior (la marca más reciente gana) — evita doble conteo en el resumen y refleja la intención más reciente del usuario.
- **Sí:** `shuffle()` y `restart()` siguen limpiando `statuses` por completo (comportamiento ya decidido antes) — ahora que hay navegación libre, mantener esto evita que las marcas queden "desalineadas" visualmente tras reordenar el mazo.
- **Sí (agregado post-implementación):** se habilitan las tarjetas "Flashcards" y "Repaso Rápido" del Home público, reutilizando `DEMO_QUESTIONS` (movida a `core/constants/` por la regla de aislamiento entre features) para una demo de Flashcards sin login — pedido explícito del usuario ("podemos usar los que tenemos en los 2 primeros", refiriéndose al mismo patrón demo que ya usan Modo Examen/Modo Estudio).
- **No:** no se agregan preguntas demo nuevas ni se cambia el copy de "Repaso Rápido" a pesar de que el demo solo tiene 5 preguntas (no 10) — decisión explícita del usuario, cambio mínimo aceptado tal cual.
- **Sí:** `/flashcards/:slug` pasa de ruta protegida a pública (como `/exam`), moviendo el gate de autenticación DENTRO de `FlashcardsPage.jsx` (redirige a `/register` si `slug !== 'demo'` y no hay usuario) — necesario para que `/flashcards/demo` sea accesible sin login; mantiene el mismo nivel de protección que antes para sets reales, solo que aplicado un nivel más abajo.

---

## Risks

| Riesgo | Mitigación |
|---|---|
| Al incluir `matching`/`ordering`, el reverso de la tarjeta puede volverse largo (ej. una pregunta `matching` con 6 pares, o `ordering` con 8 pasos) y no caber cómodamente en el layout de tarjeta del mockup, pensado originalmente para una respuesta corta tipo `multiple`. | Se implementa scroll interno en el contenido del reverso si excede la altura disponible de la tarjeta. Se verifica manualmente en los pasos 2/7 del plan con preguntas de `matching`/`ordering` reales del seed data, no solo mocks cortos. |
| El flip 3D (`rotateY` + `backfaceVisibility: hidden`) es una técnica nueva en el proyecto (ningún componente existente lo usa) — riesgo de inconsistencias de renderizado entre navegadores (Safari históricamente tiene bugs con `backface-visibility` en transforms anidados). | Verificación manual explícita en el paso 2 del plan cubriendo mobile y desktop; si se detectan artefactos visuales en un navegador específico durante la implementación, se documenta como hallazgo para un ajuste puntual (no bloquea el spec). |
| Sin persistencia, un usuario que recarga la página o pierde conexión a mitad de sesión pierde todo su progreso de esa sesión (mezclado, contadores). | Comportamiento aceptado explícitamente por decisión del usuario (spec sin persistencia) — no es un bug, es el alcance acordado. |
| Mazos mixtos (multiple + matching + ordering) mezclados aleatoriamente pueden generar transiciones de reverso muy distintas entre tarjeta y tarjeta (de una respuesta de una línea a una lista de 6 pares) — riesgo de que la animación de flip/altura de tarjeta se sienta brusca. | `FlashcardView.jsx` anima también el cambio de altura de la tarjeta (Framer Motion `layout` prop) entre tarjetas de distinto tipo, verificado manualmente en el paso 7. |
| QA manual no está automatizada — el proyecto no tiene test runner configurado (confirmado en `CLAUDE.md`). | Verificación por prueba manual documentada en el plan de implementación (pasos 2, 3, 4, 7), específicamente con un set mixto de los tres tipos. |
