# SPEC 02 — Sistema de diseño Glassmorphism + piloto Home

> **Status:** Implementado
> **Depends on:** —
> **Date:** 2026-07-22
> **Objective:** Establecer el sistema de diseño Glassmorphism del rediseño CertZen (tokens Tailwind, tipografía Inter, tema light/dark reutilizando `useThemeStore`, componentes glass compartidos) y validarlo aplicando el rediseño completo y responsive al Home público.

> **Referencia de diseño:** `C:\Users\david.betancur_pragm\Desktop\Proyectos\pen\certzen` — PNGs Light/Dark de ~25 pantallas en `export/` + `certzen.html` (guía de estilos exactos, no responsive).

---

## Scope

**In:**

- Tokens nuevos en `tailwind.config.js`: paleta `primary` indigo/violeta (`#6366F1`/`#8B5CF6`), superficies glass dark/light, gradientes de fondo dark (`#0F0F2A→#1A0E3C→#0D1F3C`) y light (`#EEF2FF→#F5F3FF→#E0F2FE`), gradiente de marca (`#6366F1→#8B5CF6`), semánticos (`#34D399`/`#FBBF24`/`#F87171` con variantes alpha), sombras y radios del diseño (10–16px, pills 999px).
- Migración tipográfica global a **Inter** (reemplaza Nunito y Fredoka en `src/index.css` y `fontFamily` de Tailwind).
- Componentes compartidos glass en `src/components/glass/`: `GlassCard`, `GlassButton` (primario gradiente + secundario glass), `GlassInput`, `GlassBadge`, `GlassOrbs` (orbes decorativos 400–480px con `blur(35px)`, `#6366F140`/`#8B5CF640`), `PageBackground` (gradiente + orbes por tema).
- Soporte Light y Dark en todos los tokens/componentes usando la clase `.dark` existente (`useThemeStore` no se modifica). Glass dark: superficies `#ffffff08/#ffffff12/#ffffff1f`, borde `#ffffff14`. Glass light: superficies `#FFFFFF80/#FFFFFF99/#FFFFFFCC`, borde `#1E1B4B1A`, texto `#1E1B4B`.
- Rediseño completo del **Home público** (`/`, ruta actual `RootRoute`) con nav y footer públicos nuevos, fiel a `Home — Glassmorphism Light/Dark.png`, responsive mobile-first (breakpoints base/md/lg) infiriendo mobile (nav colapsada tipo hamburger, columnas apiladas, tipografía fluida con clamp, touch targets ≥44px).
- Los tokens legacy (`brand`, `surface`, `ink`, `appian`) se conservan para que las pantallas no rediseñadas sigan funcionando hasta los specs 03–05.

**Out of scope (specs futuros):**

- Rediseño del resto de páginas públicas (Explorar, Simuladores, Detalle Examen, Planes, Login, Registro, Contacto, legales) → Spec 03.
- Rediseño de la app autenticada (Inicio, Explorar, Biblioteca, Mis Sets, Crear Examen, Resultados, Revisión) → Spec 04.
- Rediseño del admin (Dashboard, Usuarios, Intentos, Sets comunidad, Feature Flags, Audit Log) → Spec 05.
- Ajustes funcionales/estructurales detectados en el diseño (se documentan en el spec de su área).
- Eliminación de tokens legacy (`brand/surface/ink/appian`) — se hará cuando la última pantalla migre.
- Cambios a `useThemeStore` o al toggle de tema del perfil.

---

## Data model

No introduce datos nuevos. Reutiliza `useThemeStore` (persistencia `certzen:theme` en localStorage) tal cual.

---

## Implementation plan

1. Añadir tokens Glassmorphism a `tailwind.config.js` (colores `primary`/glass/semánticos, `backgroundImage` de fondos y gradiente de marca, sombras, radios) sin eliminar los legacy. Verificar: build de Vite pasa y ninguna pantalla actual cambia.
2. Migrar tipografía a Inter en `src/index.css` (import Google Fonts con `display=swap`) y `fontFamily.sans/display` de Tailwind; eliminar imports de Nunito/Fredoka. Verificar: toda la app renderiza con Inter sin FOUT grave.
3. Crear `src/components/glass/` con `PageBackground`, `GlassOrbs`, `GlassCard`, `GlassButton`, `GlassInput`, `GlassBadge` — cada uno con variantes light/dark vía clases `dark:`. Verificar: render en el propio Home del paso 4.
4. Rediseñar el Home público: hero (badge, H1 con palabra en gradiente, subtítulo, CTAs, checklist, mascota, stats bar), sección features (3 cards), sección modos de práctica (4 cards con badges MÁS USADO/PARA APRENDER/PRÓXIMAMENTE), CTA final y footer de 4 columnas, usando los componentes glass. Verificar: comparación visual contra los PNG Light y Dark.
5. Nav pública nueva (logo gradiente + links + CTA) con versión mobile (hamburger) inferida. Verificar: navegable en <768px, 768–1024px y >1024px sin overflow horizontal.
6. QA de tema: alternar light/dark/auto desde el perfil y confirmar que Home cambia fondo, superficies y texto correctamente; contraste AA en textos sobre glass light.
7. QA responsive + Lighthouse rápido (el `backdrop-blur` y los orbes no deben degradar el scroll en mobile; usar `will-change`/reducir blur si hace falta).

---

## Acceptance criteria

- [x] `tailwind.config.js` expone los tokens Glassmorphism y el build pasa sin warnings nuevos.
- [x] Toda la app usa Inter; no queda ningún import ni referencia a Nunito/Fredoka.
- [x] Existen `PageBackground`, `GlassOrbs`, `GlassCard`, `GlassButton`, `GlassInput`, `GlassBadge` en `src/components/glass/` con soporte light/dark.
- [x] El Home público replica `Home — Glassmorphism Dark.png` y `Home — Glassmorphism Light.png` (estructura, colores, jerarquía) en desktop 1440px.
- [x] El Home es usable sin scroll horizontal en 375px, 768px y 1440px; nav mobile funcional; touch targets ≥44px.
- [x] El toggle de tema del perfil (light/dark/auto) cambia el Home completo sin recargar.
- [x] Las pantallas NO rediseñadas siguen renderizando igual que antes (salvo la fuente Inter, cambio global aceptado).
- [x] Sin regresiones de lint/build: `npm run build` y `npm run lint` (si existe) pasan.

---

## Decisions

- **Sí:** dividir el rediseño en 4 specs (02 base, 03 público, 04 app, 05 admin) — 25 pantallas en un spec sería inmanejable.
- **Sí:** reutilizar `useThemeStore` + `darkMode: 'class'` existentes; el diseño trae Light y Dark y el mecanismo ya está en producción.
- **Sí:** migrar tipografía global a Inter aunque afecte pantallas aún no rediseñadas — cambio global de bajo riesgo aceptado por el usuario; evita mantener dos fuentes.
- **Sí:** Home público como piloto (elección del usuario) — es la pantalla más completa y ejercita todos los componentes base.
- **Sí:** responsive mobile-first. Durante la implementación llegaron los diseños mobile reales (`export_mobile/`, 390px) y el Home se ajustó a ellos: nav en una fila sin hamburger, CTAs full-width apiladas, checklist vertical, footer de una columna. Los specs 03–05 deben usar `export_mobile/` como referencia mobile, ya no inferencia.
- **Sí (cambio pedido por el usuario durante la implementación):** usar la mascota robot del diseño (extraída de `certzen.html` en base64, optimizada a WebP en `src/assets/mascot/`) en vez de `ZenDolphin` en el Home. `ZenDolphin` sigue existiendo para otras pantallas.
- **Sí:** convivencia de tokens nuevos y legacy hasta que specs 03–05 completen la migración; evita big-bang en 25 pantallas.
- **No:** rebranding funcional ni cambios de navegación en este spec — los "ajustes menores" del diseño se evalúan por área en los specs 03–05.
- **No:** usar el HTML exportado (`certzen.html`) como código fuente — usa valores absolutos (`w-[1440px]`, posiciones fijas) no responsive; sirve solo como referencia de estilos exactos.

---

## Risks

- **Performance de `backdrop-filter` + orbes blur en mobile** — mitigación: limitar capas con blur, `transform: translateZ(0)`/reducir radio de blur, medir en QA (paso 7).
- **Contraste en glass Light** (texto sobre blanco 50–80 % alpha) — mitigación: texto `#1E1B4B` del diseño y verificación AA en paso 6.
- **Regresión visual en pantallas legacy** por tokens compartidos — mitigación: tokens nuevos son aditivos; solo la fuente cambia globalmente.
