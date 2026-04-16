---
applyTo: "**"
---

# Research-First Gate — Always Active

> Este instruction file aplica a **todos los archivos** y a **todas las peticiones**.
> Su propósito: asegurar que toda implementación esté precedida por investigación basada en evidencia.

---

## Regla Principal

Antes de escribir **cualquier línea de código de aplicación** para una **nueva** funcionalidad, librería, patrón o tecnología:

1. Verificar si existe `memory/research/` con un reporte reciente (< 30 días) sobre ese tema.
2. Si **no existe** → ejecutar el skill `research` antes de cualquier implementación.
3. Si **existe** → leerlo y usarlo como base para el diseño y la implementación.

**Excepción:** Correcciones de bugs, typos, refactors menores y cambios de texto no requieren investigación previa.

---

## Cómo Detectar que se Necesita Research

| Señal en la petición | Acción requerida |
|---------------------|-----------------|
| Menciona una librería que no está en `package.json` | Research obligatorio |
| Pide implementar un patrón nuevo (ej: "infinite scroll", "optimistic UI") | Research obligatorio |
| Dice "busca/investiga/qué recomienda" | Research obligatorio |
| Pide un feature de UX/motion no existente | Research recomendado |
| Bug fix / typo / texto | No requiere research |
| Cambio de color / estilo puntual | No requiere research |

---

## Protocolo de Activación del Agente Researcher

Cuando se detecta que el research es necesario:

```
1. Anuncia: "Antes de implementar, voy a investigar las mejores prácticas."
2. Invoca el agente `researcher` con el tema específico.
3. El agente produce memory/research/YYYY-MM-DD-<topic>.md
4. Presenta el resumen ejecutivo al usuario.
5. Pregunta: "¿Procedemos con la implementación usando este enfoque?"
6. Solo después de confirmación → ejecutar plan-execute.
```

---

## Regla de Nomenclatura para Archivos de Research

```
memory/research/YYYY-MM-DD-<topic-en-kebab-case>.md

Ejemplos:
  memory/research/2026-04-15-infinite-scroll-react.md
  memory/research/2026-04-15-firebase-real-time-listeners.md
  memory/research/2026-04-15-framer-motion-layout-animations.md
  memory/research/2026-04-15-tailwind-v4-migration.md
```

---

## Lo que el Research SIEMPRE Debe Cubrir

Para ser válido, un reporte de research debe responder:

- [ ] ¿Cuál es la recomendación oficial actual para este stack?
- [ ] ¿Existen pitfalls o breaking changes conocidos?
- [ ] ¿Hay implicaciones de seguridad?
- [ ] ¿Cuál es el impacto en bundle size?
- [ ] ¿Es compatible con React 19 + Vite 5?
- [ ] ¿Hay alternativas más simples que logran lo mismo?

---

## Después del Research → Plan → Skill Generado

Cuando el research produce una decisión reutilizable (un patrón nuevo que el equipo adoptará), debe traducirse en:

1. **`memory/patterns/<topic>.md`** — Patrón documentado para reutilización
2. **`.github/skills/<topic>/SKILL.md`** — Skill reutilizable si el patrón se repetirá
3. **`docs/decisions/YYYY-MM-DD-<topic>.md`** — ADR si es decisión arquitectónica

---

## Anti-Patrones Prohibidos

- ❌ Instalar una librería sin research previo
- ❌ Usar un patrón "porque lo vi en un tutorial" sin verificar con fuentes primarias
- ❌ Asumir que una API funciona igual en React 19 que en versiones anteriores
- ❌ Ignorar el reporte de research existente y re-investigar desde cero
