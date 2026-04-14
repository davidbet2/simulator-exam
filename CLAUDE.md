# CLAUDE.md — Central Memory Hub

> Este archivo es el núcleo de contexto del proyecto. Claude lo lee automáticamente al inicio de cada sesión. Mantenerlo conciso y actualizado es crítico para maximizar la calidad de las respuestas y optimizar el uso de tokens.

---

## Identidad del Proyecto

| Campo         | Valor                          |
|---------------|--------------------------------|
| **Nombre**    | `AppianSimulator-Exam`               |
| **Tipo**      | `spa`                           |
| **Versión**   | `0.0.0`                        |
| **Stack**     | `React 19 · Vite · Firebase (Auth + Firestore) · Zustand · Tailwind CSS · React Router v7` |
| **Deploy**    | `Firebase Hosting`              |
| **Última actualización** | `2026-04-13`         |

**Resumen en una línea:** Simulador de exámenes de certificación Appian (Developer/Analyst) con banco de preguntas en Firestore, autenticación Firebase y panel de administración.

---

## Arquitectura en Alto Nivel

```
Usuario ──► React SPA (Vite) ──► Firebase Auth  (autenticación)
                │
                └──────────────► Firestore       (banco de preguntas, resultados)
                │
                └──────────────► Firebase Hosting (deploy static)

src/
├── core/
│   ├── constants/    → CERTIFICATIONS config (tipos de examen)
│   ├── firebase/     → Inicialización Auth + Firestore
│   ├── router/       → AppRouter, ProtectedRoute
│   └── store/        → useAuthStore (Zustand)
├── features/
│   ├── exam/         → ExamPage, QuestionCard, TimerBox, useExam
│   ├── results/      → ResultsPage (score, resumen de respuestas)
│   ├── welcome/      → WelcomePage (selección de certificación)
│   └── admin/        → AdminDashboard, importación de preguntas
└── App.jsx           → Routing raíz
```

> Detalles completos: [docs/architecture.md](docs/architecture.md)

---

## Principios de Comportamiento (Karpathy + Boris Cherny)

<important if="siempre activo">

**Antes de implementar:** Enuncia suposiciones explícitamente. Si hay múltiples interpretaciones, preséntalas — no elijas en silencio.

**Código mínimo:** Sin features extra, sin abstracciones para uso único, sin "flexibilidad" no pedida, sin manejo de errores para escenarios imposibles.

**Cambios quirúrgicos:** No "mejorar" código adyacente. No refactorizar lo que no está roto. Cada línea cambiada debe rastrearse directamente a la solicitud del usuario.

**Criterios verificables:** Transforma tareas en metas verificables. Para tareas multi-paso, enuncia un plan breve con verificaciones antes de ejecutar.

**Plan mode primero:** Para tareas complejas, siempre usar plan mode y obtener aprobación antes de ejecutar.

**Compactar al 50%:** Ejecutar `/compact` manualmente cuando el contexto alcance 50% de uso para evitar degradación de calidad.

</important>

---

## Skills Disponibles

Invoca estas habilidades mencionando su trigger natural en conversación:

| Skill               | Trigger                                | Descripción                                  |
|---------------------|----------------------------------------|----------------------------------------------|
| `code-review`       | "revisa este código" / "audit"         | Análisis de seguridad, calidad y arquitectura |
| `refactor`          | "refactoriza [componente]"             | Refactoring estructurado con plan             |
| `release`           | "prepara release" / "versiona"         | Flujo completo de versionado y changelog      |
| `debug`             | "debug [problema]" / "investiga"       | Depuración sistemática con hipótesis          |
| `documentation`     | "documenta [componente]"               | Generación de docs técnicos                   |
| `architecture`      | "diseña [componente]" / "arquitectura" | Decisiones de diseño con ADR (corre en subagente Explore) |
| `pr-review`         | `/pr-review`                           | Revisión de PR con diff en vivo via gh CLI    |
| `health-check`      | `/health-check`                        | Diagnóstico completo del setup Claude Code    |
| `gsd`               | `/gsd-*` commands                      | Spec-driven development: plan→execute→verify  |
| `ensure-tools`      | "¿tienes X instalado?" / "instala Y"    | Verifica e instala herramientas faltantes     |

## Subagentes Personalizados

Disponibles directamente o vía @-mention:

| Agente              | Descripción                                   | Memoria   |
|---------------------|-----------------------------------------------|-----------|
| `code-reviewer`     | Revisión de código con checklist OWASP+calidad | project   |
| `debugger`          | Debug sistemático: root cause → fix → verify  | —         |
| `security-auditor`  | Auditoría OWASP Top 10 completa               | project   |
| `performance-analyst` | Profiling, N+1, O(n²), memory leaks         | —         |

---

## Arquitectura de Memoria

Este proyecto usa una estrategia de memoria en capas para maximizar contexto relevante y minimizar tokens:

```
Layer 1 — Siempre cargado:     CLAUDE.md (este archivo, ~2KB target)
Layer 2 — Contexto modular:    src/*/CLAUDE.md  (cargado por módulo)
Layer 3 — Memoria persistente: memory/patterns/ + memory/decisions/
Layer 4 — Memoria de runtime:  MCP Claudemem + Engram (cross-session)
Layer 5 — Contexto vivo:       memory/sessions/ (log de esta sesión)
```

**Regla de oro:** Si algo se repite más de 3 veces en conversaciones, muévelo a `memory/patterns/`.

---

## Integraciones MCP

| MCP            | Propósito                                          | Cuándo usar                              |
|----------------|----------------------------------------------------|------------------------------------------|
| **Caveman**    | Debug logging primitivo — loggea cada tool call    | Debugging de cadenas de herramientas     |
| **Claudemem**  | Memoria persistente cross-session                  | Recordar decisiones entre conversaciones |
| **Engram**     | Grafo de conocimiento semántico                    | Buscar patrones y decisiones pasadas     |
| **Autoskills** | Auto-detección y ejecución de skills relevantes    | Workflows repetitivos automatizados      |
| **Tavily**     | Búsqueda web con IA para investigación profunda    | Buscar libs, CVEs, docs actualizadas     |
| **Context7**   | Docs de frameworks siempre actualizadas (90+ fuentes) | Consultar APIs y guías oficiales      |
| **Semgrep**    | Escaneo de vulnerabilidades de seguridad           | Code review de seguridad, CI/CD          |
| **Preflight**  | Detecta prompts vagos antes de desperdiciar tokens | Inicio de sesión, validación de tareas   |

> Config: [.claude/settings.json](.claude/settings.json)

---

## Convenciones del Proyecto

### Git
- **Branches:** `type/short-description` — tipos: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- **Commits:** `type(scope): mensaje en imperativo` — ej: `feat(api): add user endpoint`
- **PRs:** Siempre referenciar issue. Usar template si existe.

### Código
- Componentes en `features/<feature>/components/` — no poner lógica de negocio en JSX
- Hooks personalizados en `features/<feature>/hooks/` — prefijo `use`
- Estado global solo en `src/core/store/` via Zustand
- Constantes de dominio en `src/core/constants/` — nunca magic strings
- Firebase únicamente instanciado en `src/core/firebase/firebase.js`
- Variables de entorno con prefijo `VITE_` en `.env` (nunca commitear)

### Testing
- Sin test runner configurado actualmente — añadir Vitest si se requiere

### Seguridad (siempre activo)
- Nunca commitear secrets, tokens, ni credenciales
- Validar input en los límites del sistema (no en capas internas)
- Revisar OWASP Top 10 en cada code review

---

## Decisiones Arquitectónicas Clave

> Ver historial completo en [docs/decisions/](docs/decisions/)

| # | Decisión | Razón | Fecha |
|---|----------|-------|-------|
| 1 | Firebase como backend | Sin servidor propio — BaaS simplifica auth + DB | 2025 |
| 2 | Zustand sobre Redux | Estado mínimo (solo auth), no necesita Redux | 2025 |
| 3 | Feature-based structure | Escalabilidad por certificación/feature | 2025 |

---

## Estado Actual del Proyecto

```
[x] Discovery / Diseño
[x] Setup inicial
[x] MVP  ← Senior Developer disponible
[ ] Producción completa (todas las certificaciones)
[ ] Mantenimiento
```

**Estado:** MVP live en Firebase Hosting. Senior Developer activo. Los demás exámenes (analyst-senior, analyst-associate, developer-associate) están como skeletons (`available: false`).

**Próximos pasos:**
1. Agregar banco de preguntas para `developer-associate`
2. Agregar banco de preguntas para `analyst-*`
3. Mejorar ResultsPage con historial de intentos en Firestore

---

## Restricciones Importantes

- ⛔ No ejecutar comandos destructivos sin confirmación explícita
- ⛔ No modificar archivos de `memory/` directamente — usar hooks
- ⚠️ Los hooks de seguridad en `.claude/hooks/` son **no-negociables**
- ℹ️ Siempre consultar `docs/decisions/` antes de cambiar arquitectura

---

## Referencias Rápidas

| Recurso                | Path                              |
|------------------------|-----------------------------------|
| Arquitectura           | `docs/architecture.md`            |
| Decisiones (ADRs)      | `docs/decisions/`                 |
| Runbooks               | `docs/runbooks/`                  |
| Skills                 | `.claude/skills/`                 |
| Hooks                  | `.claude/hooks/`                  |
| Memoria persistente    | `memory/`                         |
| Prompts reutilizables  | `tools/prompts/`                  |
| Glosario del dominio   | `docs/context/domain-glossary.md` |
