# Research — Community Features + Authenticated UX (Quizlet-style)

**Fecha**: 2026-04-16
**Topic**: Social engagement, content discovery, trust signals y home autenticado tipo Quizlet
**Stack**: React 19 + Firebase (Auth + Firestore) + Zustand + Tailwind + React Router v7
**Status**: 📋 Research → pendiente aprobación para plan-execute

---

## 1. Contexto y problema

### Estado actual
- Después de login, el usuario sigue viendo la **WelcomePage** marketing (raíz `/`)
- `/dashboard` existe pero es minimalista: solo stats + últimos intentos
- `/explore` es un listado plano, sin señales de calidad (no hay rating, favoritos, autor, hotness)
- No hay manera de:
  - Saber si un set subido por la comunidad es confiable
  - Ver qué ha creado un autor específico
  - Guardar un set para después
  - Recibir recomendaciones personalizadas

### Objetivo del usuario
1. **Social trust**: ratings, favoritos, autor visible, reputación de creador — para que el contenido de calidad suba
2. **UX autenticado tipo Quizlet**: home con "Seguir estudiando", "Recientes", "Carpetas", "Personaliza tu contenido", sidebar de navegación, búsqueda global
3. **Redirect automático**: usuario logueado NO ve marketing page; aterriza directamente en su home de estudio

---

## 2. Patrones de referencia (evidencia)

### 2.1 Quizlet — Home autenticado
Basado en screenshots públicos del producto (adjunto del usuario + docs de Quizlet en Wayback Machine):

**Layout**:
- **Sidebar persistente** (izquierda): Inicio · Biblioteca · Grupos · Notificaciones · Carpetas · "Comenzar aquí"
- **Top bar**: búsqueda global centrada + avatar + botón "Crear" (+)
- **Hero carousel**: "Seguir estudiando" — cards grandes de lo último accedido, con barra de progreso
- **Grid de secciones**:
  - **Recientes** — fichas visitadas últimamente (iconos + meta)
  - **Personaliza tu contenido** — widgets de preferencias/temas
  - **Carpetas** — agrupador personal
- **Color scheme**: dark mode cómodo para estudio largo

**Por qué funciona**:
- El usuario aterriza en CONTEXTO de estudio (no marketing)
- Continuidad: "Seguir estudiando" reduce fricción de retomar
- Descubrimiento pasivo: "Recientes" + personalización
- Búsqueda global siempre visible

### 2.2 Señales de calidad / trust (StackOverflow, Brainly, Reddit)
Para que el usuario distinga contenido confiable en una plataforma colaborativa:

| Señal | Cómo se calcula | Por qué funciona |
|-------|----------------|------------------|
| **Rating promedio** (⭐ 1-5) | `sum(stars) / count` | Fácil de entender, universal |
| **Nº de intentos** | Counter en doc | Proxy de popularidad |
| **Tasa de aprobación** | `passed / attempts` | Señal de dificultad calibrada |
| **"Oficial"** badge | Flag admin | Contenido curado por plataforma |
| **Autor verificado** | Flag por reputación | Autoridad basada en track record |
| **Reputación del autor** | Σ (ratings de sus sets × peso) | Upvotes + views — estilo SO |
| **Favoritos totales** | Counter | Bookmarks = endorsement fuerte |
| **Reportes (flags)** | Counter + estado | Auto-ocultar si > N reports |
| **Fecha última actualización** | Timestamp | Contenido fresco > stale |

**Anti-patrones a evitar**:
- ❌ Votos negativos anónimos (tóxico, Brainly lo eliminó)
- ❌ Rating sin mínimo de muestra (un set con 1⭐/1 voto aparece peor que 4⭐/100 votos — usar **Wilson score** o bayesian average)
- ❌ Permitir al autor votar su propio contenido
- ❌ No prevenir rating duplicado (un rating por user × set)

### 2.3 Favoritos / Bookmarks (Quizlet, Duolingo, Notion)
- Toggle simple (icono estrella/corazón)
- Accesible desde listado, landing y dentro del examen
- Agrupable en **carpetas** (Quizlet pattern) o **colecciones** (Pinterest pattern)
- **Siempre privados por default** (sharing opt-in)

### 2.4 Perfil de autor (LinkedIn Learning, Udemy)
Ruta pública `/u/:username` o `/authors/:uid`:
- Bio corta + avatar + fecha "member since"
- Stats: nº sets publicados, avg rating, total intentos
- Grid de sus sets publicados
- Badges (ej. "Top contributor IT", "Verified author")
- Follow/seguir (fase 2, requiere feed)

---

## 3. Modelo de datos propuesto (Firestore)

### Nuevas colecciones

#### `users/{uid}` — **ampliar doc existente**
Campos nuevos (merge):
```
displayName        // ya existe
photoURL           // ya existe
username           // NUEVO — @handle único para URLs /u/:username
bio                // NUEVO — 280 chars
reputationScore    // NUEVO — counter denormalizado (calculado por CF o en agregados)
setsPublishedCount // NUEVO — counter
verifiedAuthor     // NUEVO — flag admin
createdAt          // ya existe
```

**Índice único en `username`** (unique constraint vía security rule + doc lookup).

#### `examSets/{slug}` — **añadir campos**
Ya tiene: `ownerUid, ownerEmail, official, published, featured, attempts, questionCount, ...`
Añadir:
```
ratingSum          // Σ de stars
ratingCount        // count de ratings
ratingAvg          // derivada (ratingSum / ratingCount) — rellenar en write
wilsonScore        // para ranking justo con pocas muestras
favoritesCount     // Σ favoritos (counter)
flagsCount         // counter de reportes abiertos
hidden             // si flagsCount >= threshold → admin decide
```

#### `examSets/{slug}/ratings/{uid}` — **NUEVO**
Un rating por usuario por set. Doc con id = uid (previene duplicados de forma natural):
```
{
  uid, stars (1-5), comment?, createdAt, updatedAt
}
```
Write triggers counter update (client-side batch o Cloud Function).

#### `users/{uid}/favorites/{setSlug}` — **NUEVO** (subcolección)
Un doc por favorito del usuario. Dualmente denormalizar `examSets/{slug}.favoritesCount`.
```
{
  setSlug, setTitle, setDomain, addedAt,
  folderId?   // si lo organiza en carpeta
}
```

#### `users/{uid}/folders/{folderId}` — **NUEVO**
Carpetas personales estilo Quizlet:
```
{
  name, color?, icon?, order, createdAt, updatedAt,
  setSlugs: [slug1, slug2]   // denormalizado, max 100 items
}
```

#### `examSets/{slug}/flags/{flagId}` — **NUEVO** (ya hay `flags` en admin)
Reporte de contenido inapropiado, resuelto por admin (ya existe tracking en AdminFlagsPage).

---

## 4. UX autenticado — propuesta

### 4.1 Routing
```
/                    →  Si user → redirect a /home
                        Si guest → WelcomePage (marketing)
/home                →  NUEVO — dashboard tipo Quizlet (protected)
/dashboard           →  Mantener como /home/stats o redirect a /home
/library             →  NUEVO — mi biblioteca (favoritos + folders + mis sets)
/library/folders/:id →  detalle de carpeta
/explore             →  mantener pero con filtros de rating/popularidad
/u/:username         →  NUEVO — perfil público de autor
/exam-sets/:slug     →  mantener + añadir rating stars + favorito + autor link
```

### 4.2 `/home` — estructura
```
┌─── Sidebar ────────┐  ┌─── Top bar ──────────────────────────────┐
│ Inicio            │  │ [⌕ Buscar…]              [+ Crear] [👤]  │
│ Biblioteca        │  ├──────────────────────────────────────────┤
│ Carpetas          │  │                                           │
│ Explorar          │  │  Seguir estudiando                        │
│ Favoritos         │  │  ┌─ carousel de cards grandes ─┐          │
│ ───               │  │  │  [Último set + % progreso]  │          │
│ Tus carpetas      │  │  └─────────────────────────────┘          │
│ • AWS             │  │                                           │
│ • Scrum           │  │  Recientes                                │
│ + Nueva carpeta   │  │  [grid 2×N de cards compactas]            │
│ ───               │  │                                           │
│ Comenzar aquí     │  │  Favoritos (top 6)                        │
│ • Nuevo examen    │  │  [grid]                                   │
│ • Explorar        │  │                                           │
└───────────────────┘  │  Recomendado por tu actividad             │
                       │  [grid — basado en dominios recientes]    │
                       └───────────────────────────────────────────┘
```

### 4.3 Componentes nuevos
- `AppShell` — layout con sidebar + topbar (persistente para rutas `/home`, `/library`, `/explore`, `/exam-sets/*`)
- `Sidebar` — colapsable en mobile, fija en desktop ≥1024px
- `GlobalSearchBar` — busca en `examSets` (título/tags) con debounce + keyboard shortcut `⌘K`
- `ContinueStudyingCarousel` — lee últimos intentos no-aprobados del usuario
- `RecentsGrid` — lee `users/{uid}/recentlyViewed` (escribir al entrar a un set)
- `RecommendationsGrid` — sets del mismo `domain` más populares que el user NO ha intentado
- `RatingStars` — interactivo (5 estrellas) + readonly
- `FavoriteButton` — toggle optimistic
- `AuthorChip` — avatar + username + link a `/u/:username`

### 4.4 Tema visual
Quizlet usa dark mode por default. Nuestra app está en light. Propuesta:
- **Mantener light como default del marketing**
- **Dark auto para `/home`, `/library`, `/exam`** (zonas de estudio largo)
- Respetar `prefers-color-scheme` y toggle manual en profile

> ⚠️ Dark mode toggle = alcance grande. **Fase 2**. En fase 1 mantenemos light en todo y copiamos solo el LAYOUT de Quizlet.

---

## 5. Security rules necesarias

```
match /examSets/{setId} {
  // Ya existe: public read si published, write si owner/admin
  
  match /ratings/{uid} {
    allow read: if true;  // ratings públicos
    allow create, update: if request.auth.uid == uid
                          && request.auth.uid != get(/databases/$(database)/documents/examSets/$(setId)).data.ownerUid
                          && request.resource.data.stars is number
                          && request.resource.data.stars >= 1
                          && request.resource.data.stars <= 5;
    allow delete: if request.auth.uid == uid || isAdmin();
  }
}

match /users/{uid}/favorites/{slug} {
  allow read, write: if request.auth.uid == uid;  // privados
}

match /users/{uid}/folders/{folderId} {
  allow read, write: if request.auth.uid == uid;
}

match /users/{uid} {
  allow read: if true;  // perfil público (bio, displayName, avatar, stats)
  allow update: if request.auth.uid == uid
                && !('reputationScore' in request.resource.data.diff(resource.data).affectedKeys())
                && !('verifiedAuthor' in request.resource.data.diff(resource.data).affectedKeys())
                && !('role' in request.resource.data.diff(resource.data).affectedKeys());
}
```

---

## 6. Riesgos / consideraciones

| Riesgo | Mitigación |
|--------|-----------|
| **Counters de rating/favs inconsistentes** | Usar `FieldValue.increment()` + batch write. En fase 2 migrar a Cloud Functions trigger para atomicidad real. |
| **Abuso de ratings (brigading)** | Rate limit por IP en fase 2. Fase 1: un vote por user via doc-id=uid previene duplicados. |
| **Reputation farming** | No mostrar reputation público hasta fase 2. Calcular server-side. |
| **Privacy del perfil** | Opt-in a "perfil público" en profile settings. Default: privado, solo displayName aparece en sets. |
| **SEO conflict** | `/u/:username` públicos ayudan al SEO (más páginas indexables con contenido único). `/home` y `/library` son NOINDEX. |
| **Complejidad del refactor** | Ejecutar en fases atómicas. NO tocar WelcomePage hasta que `/home` esté listo. |

---

## 7. Plan de ejecución propuesto (3 fases)

### Fase 1 — Foundation social (esta sesión si aprueban)
1. Extender `examSets` doc con campos de rating/favs (zero-cost, solo schema)
2. Security rules + subcolecciones `ratings`, `favorites`, `folders`
3. Hook `useRating(slug)` — get + set con optimistic update
4. Hook `useFavorite(slug)` — toggle con optimistic
5. Componentes `RatingStars`, `FavoriteButton`
6. Integrar en `ExamSetLandingPage` y cards de `/explore`
7. Ordenar explore por `ratingAvg desc, favoritesCount desc, attempts desc` (cliente, 18 sets)
8. `AuthorChip` en cards (solo displayName clickable por ahora → `/u/:uid` placeholder)

### Fase 2 — UX autenticado Quizlet-like
1. `AppShell` + `Sidebar` + `TopBar`
2. Ruta `/home` con "Seguir estudiando" + "Recientes" + "Favoritos" + "Recomendado"
3. Redirect `/` → `/home` si autenticado
4. `/library` con mis sets + favoritos + carpetas
5. Búsqueda global (`⌘K`)
6. Hook `useRecentlyViewed()` + escritura al visitar set

### Fase 3 — Perfiles + descubrimiento avanzado
1. `/u/:username` página pública de autor
2. Reputation score calculado en Cloud Function (o cron de admin inicialmente)
3. Badge "Verified author"
4. Follow/followers (opcional)
5. Feed de actividad de autores seguidos

---

## 8. Fuentes / referencias

- **Quizlet UX**: screenshots públicos del producto + Wayback Machine snapshots de quizlet.com/latest
- **StackOverflow reputation model**: Meta SO "How does reputation work?" (públicamente documentado)
- **Wilson score lower bound for ranking**: Reddit engineering blog 2009, Evan Miller's "How Not To Sort By Average Rating" (2009)
- **Favoritos pattern**: Pinterest, Notion, Duolingo — todos usan subcolección per-user
- **Firestore counters best practice**: [firebase.google.com/docs/firestore/solutions/counters](https://firebase.google.com/docs/firestore/solutions/counters)
- **React Router v6 nested layouts**: react-router.com/en/main/start/tutorial

---

## 9. Decisión requerida

**Opciones**:

- **A. Ejecutar Fase 1 completa ahora** (social foundation: ratings + favs + author chip en explore/landing). ~4-6 commits atómicos. Sin tocar navegación aún.
- **B. Ejecutar Fase 1 + Fase 2 parcial**: foundation + solo redirect `/` → `/home` + AppShell básico (sidebar + topbar), dejando búsqueda global y recomendaciones para después.
- **C. Ir directo a Fase 2 (Quizlet-like UX)** primero, luego social en Fase 3.

**Recomendación**: **B** — resuelve lo que el usuario pidió (social + home autenticado visible) en esta iteración, sin meter reputation/perfiles públicos que requieren Cloud Functions y más diseño.

---

**→ Esperando confirmación del usuario para proceder con opción A / B / C.**
