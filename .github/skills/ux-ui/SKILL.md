---
name: ux-ui
description: UX/UI design specialist for React/Tailwind projects. Reviews and implements UI components following DESIGN.md principles, latest trends (glassmorphism, aurora gradients, spring micro-interactions). Use when asked to "diseña", "rediseña", "mejorar UX", "animar", "micro-interactions", "revisar diseño", or "aplicar DESIGN.md".
argument-hint: "[component, page, or feature to design/redesign]"
allowed-tools: Read Write Grep Glob Bash(git diff *) Bash(git status)
---

# Skill: UX/UI Design

## Trigger

Activar cuando el usuario diga:
- "diseña", "rediseña", "mejora el diseño"
- "micro-interacciones", "animaciones", "motion"
- "aplica DESIGN.md", "revisa UI"
- "se ve feo/aburrido", "necesita más fuerza visual"
- "landing page", "hero section", "componente visual"

---

## Proceso de Diseño UI

Ejecutar siempre en este orden. No omitir pasos.

### 1. Lee DESIGN.md primero

Antes de tocar cualquier código, leer `DESIGN.md` del proyecto root.
Si no existe, crear uno usando el formato de `awesome-design-md`.

```
SIEMPRE verificar:
- Paleta de colores activa (brand primary, surface tokens)
- Tipografía: familia display vs body, tamaños hero vs body
- Motion principles: spring physics vs ease, durations
- Component patterns: bordes, radios, sombras
```

### 2. Auditoría Visual

Revisar el componente/página actual contra estos criterios:

- [ ] **Jerarquía visual** — ¿El ojo va naturalmente al CTA principal?
- [ ] **Contraste de texto** — WCAG AA mínimo 4.5:1 para body, 3:1 para large
- [ ] **Densidad** — ¿Hay suficiente whitespace? ¿O demasiado espaciado?
- [ ] **Consistencia tipográfica** — ¿Se usan los tamaños del design system?
- [ ] **Color semántico** — ¿Los colores comunican el estado correcto? (success/danger/warning)
- [ ] **Estado hover/focus/active** — ¿Todos los elementos interactivos tienen feedback?
- [ ] **Responsive** — ¿Funciona en 320px, 768px y 1440px?

### 3. Impact Score

Dar score 1–10 en cada dimensión antes de rediseñar:

| Dimensión          | Peso | Score | Comentario |
|--------------------|------|-------|------------|
| Jerarquía visual   | 20%  | ?/10  |            |
| Energía / Vitalidad| 20%  | ?/10  |            |
| Micro-interacciones| 15%  | ?/10  |            |
| Tipografía         | 15%  | ?/10  |            |
| Color / Contraste  | 15%  | ?/10  |            |
| Responsive         | 15%  | ?/10  |            |

**Score <7 en cualquier dimensión = redesign necesario**

### 4. Implementación

Aplicar cambios con estas prioridades:

1. **Tokens primero** — Usar siempre `tailwind.config.js` tokens, nunca hex inline
2. **Framer Motion** — Para todo lo que se mueva (ya instalado en el proyecto)
3. **Composición de gradientes** — `bg-gradient-to-br from-[color]/15 to-transparent`
4. **Glass morphism** — Usar las clases `.glass` y `.glass-bright` del CSS global
5. **Hover state siempre** — Mínimo `hover:border-[x]` + `hover:shadow-card-hover`

---

## Patrones de Diseño — Referencia Rápida

### Hero Section (Landing)
```jsx
// Full-viewport hero con aurora background
<section className="relative min-h-screen flex items-center overflow-hidden">
  {/* Aurora blobs (fixed, no scroll) */}
  <div className="pointer-events-none fixed inset-0">
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full 
                    bg-brand-600/15 blur-[120px] animate-float" />
    <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full 
                    bg-cyan-500/10 blur-[100px] animate-float" 
         style={{ animationDelay: '-5s' }} />
    <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] rounded-full 
                    bg-fuchsia-600/8 blur-[80px] animate-float"
         style={{ animationDelay: '-10s' }} />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 
                 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-400 
                 mb-8 tracking-wide uppercase"
    >
      ✦ Plataforma de Certificaciones
    </motion.span>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl sm:text-7xl md:text-8xl font-display font-bold 
                 leading-[0.92] tracking-tight text-slate-100 mb-6"
    >
      Aprueba con{' '}
      <span className="text-gradient-aurora">confianza.</span>
    </motion.h1>
    {/* subheading, CTAs, stats below */}
  </div>
</section>
```

### Feature Cards (3-col)
```jsx
// Spring hover lift card
<motion.div
  whileHover={{ y: -6, scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className="rounded-2xl border border-surface-border bg-surface-card p-6
             hover:border-brand-500/40 hover:shadow-card-hover
             transition-colors duration-300"
>
  {/* Icon with gradient bg */}
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10
                  flex items-center justify-center mb-4">
    <Icon className="text-brand-400" size={18} />
  </div>
  <h3 className="font-display font-semibold text-slate-100 text-lg mb-2">Title</h3>
  <p className="text-slate-400 text-sm leading-relaxed">Description</p>
</motion.div>
```

### Staggered List (enter from below)
```jsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};
// Usage: motion.div variants={container} / motion.div variants={item}
```

### Scroll-Triggered Section
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
>
```

### Aurora Gradient Text
```css
/* In tailwind config backgroundImage or index.css */
.text-gradient-aurora {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 40%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Checklist de Entrega

Antes de dar por aprobado cualquier diseño:

- [ ] Verificar contraste con herramienta (WCAG AA)
- [ ] Probar hover states en todos los elementos interactivos
- [ ] Verificar que no hay `inline style` con hex — todo debe ser tokens
- [ ] Probar responsive en 375px y 1440px mínimo
- [ ] Asegurar que `prefers-reduced-motion` no rompe el layout
- [ ] Confirmar que Lighthouse A11Y score ≥90 (aria-labels, contraste, focus)
- [ ] Verificar que no hay animaciones con `transform` que causen layout shift

---

## Tendencias Activas (2025)

Incorporar según contexto del proyecto:

| Trend              | Aplicación en CertZen                                       |
|--------------------|-------------------------------------------------------------|
| Aurora gradients   | Hero backgrounds, section dividers                         |
| Glassmorphism      | Navigation, modals, overlays — con moderación              |
| Spring physics     | Todas las interacciones hover/tap                          |
| Stagger reveals    | Listas de features, grids de certificaciones               |
| Gradient text      | Palabras clave en headings                                 |
| Dot/grid patterns  | Secciones de fondo para dar textura sin distracción        |
| Kinetic typography | Texto que entra con animación al hacer scroll              |
| Neon glow CTAs     | Solo en el botón CTA principal — no en toda la UI          |
| Dark depth layers  | Usar 3–4 surface levels para crear profundidad             |

---

## Antipatrones a Evitar

- ❌ Gradientes full-bleed en todo el fondo (cansa la vista)
- ❌ Animaciones en texto de párrafo (dificulta la lectura)
- ❌ Más de 2 colores accent en el mismo fold
- ❌ Cards planas sin ningún estado hover
- ❌ `text-white` directamente — usar `text-slate-100` para evitar dureza
- ❌ Bordes radius < 8px en cards (se ve outdated)
- ❌ Botones sin `active:scale-[0.97]` — todo CTA necesita press feedback
- ❌ Glow effects en elementos secundarios (solo en CTAs y logos)
