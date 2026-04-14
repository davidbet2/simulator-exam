---
inclusion: always
---

# Identidad del Proyecto

| Campo | Valor |
|---|---|
| **Nombre** | `AppianSimulator-Exam` |
| **Tipo** | `spa` |
| **Versión** | `0.0.0` |
| **Stack** | `Node.js · React, Tailwind CSS` |

**Resumen:** Proyecto spa — Node.js · React, Tailwind CSS

---

## Arquitectura

```
src/
├── api/        → Contratos externos (HTTP, gRPC, eventos)
├── core/       → Lógica de negocio, libre de frameworks
└── ...         → [Módulos específicos del proyecto]
```

---

## Principios de Comportamiento

**Antes de implementar:** Enuncia suposiciones explícitamente. Si hay múltiples interpretaciones, preséntalas — no elijas en silencio.

**Código mínimo:** Sin features extra, sin abstracciones para uso único, sin "flexibilidad" no pedida, sin manejo de errores para escenarios imposibles.

**Cambios quirúrgicos:** No "mejorar" código adyacente. No refactorizar lo que no está roto. Cada línea cambiada debe rastrearse directamente a la solicitud del usuario.

**Criterios verificables:** Transforma tareas en metas verificables. Para tareas multi-paso, enuncia un plan breve con verificaciones antes de ejecutar.

---

## Convenciones

### Git
- **Branches:** `type/short-description` — tipos: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- **Commits:** `type(scope): mensaje en imperativo` — ej: `feat(api): add user endpoint`

### Seguridad (siempre activo)
- Nunca commitear secrets, tokens, ni credenciales
- Validar input en los límites del sistema
- Revisar OWASP Top 10 en cada code review

---

## Skills Disponibles (invoca con `/` en chat)

| Skill | Cuándo usarlo |
|---|---|
| `/code-review` | "revisa este código", "audit" |
| `/debug` | "por qué falla", "hay un bug" |
| `/architecture` | "diseña [componente]", "cómo estructurar" |
| `/documentation` | "documenta [componente]" |
| `/refactor` | "refactoriza [componente]" |
| `/release` | "prepara release", "versiona" |
| `/security-audit` | auditoría OWASP completa, antes de releases |
| `/code-reviewer` | revisión de código con checklist completo |
| `/debugger` | debug sistemático root cause → fix → verify |
| `/performance` | código lento, memory leaks, N+1 queries |
