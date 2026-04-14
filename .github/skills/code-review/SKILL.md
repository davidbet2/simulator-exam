---
name: code-review
description: Reviews code for security vulnerabilities (OWASP Top 10), quality, and architecture. Use when the user says "review", "audit", "check this code", or after writing significant code changes.
argument-hint: "[file or module to review, or leave empty for recent changes]"
allowed-tools: Read Grep Glob Bash(git diff *) Bash(git log *) Bash(git status)
---

# Skill: Code Review

## Trigger

Activar cuando el usuario diga: "revisa", "review", "audita", "analiza el código", "check this code"

---

## Proceso de Revisión

Ejecutar siempre en este orden. No omitir pasos.

### 1. Seguridad (OWASP Top 10)

Revisar explícitamente:

- [ ] **Injection** — SQL injection, command injection, XSS, LDAP injection
- [ ] **Autenticación rota** — Credenciales hardcodeadas, tokens expuestos, JWT sin validación
- [ ] **Exposición de datos** — PII en logs, secrets en código, datos sensibles sin cifrar
- [ ] **Control de acceso** — Autorización faltante, IDOR, escalada de privilegios
- [ ] **Configuración insegura** — Defaults inseguros, errores con stack trace expuesto
- [ ] **Dependencias vulnerables** — Verificar si hay versiones con CVEs conocidos
- [ ] **Logging/Monitoreo** — Acciones críticas sin log, logs sin datos suficientes

### 2. Calidad de Código

- [ ] **Complejidad ciclomática** — Funciones con más de 10 ramas son señal de alerta
- [ ] **Principio de responsabilidad única** — Cada función/clase hace una sola cosa
- [ ] **DRY** — Identificar duplicación que debería abstraerse
- [ ] **Nombres descriptivos** — Variables, funciones y clases comunican intención
- [ ] **Manejo de errores** — Errores silenciados, catch vacíos, panic sin recover
- [ ] **Magic values** — Números o strings sin constantes nombradas

### 3. Arquitectura

- [ ] **Separación de capas** — ¿El código de UI llama directamente a la DB?
- [ ] **Dirección de dependencias** — ¿La lógica de negocio depende de frameworks?
- [ ] **Acoplamiento** — ¿Los módulos están demasiado entrelazados?
- [ ] **Cohesión** — ¿Los módulos agrupan conceptos relacionados?

### 4. Testing

- [ ] **Cobertura de casos límite** — null, empty, overflow, concurrencia
- [ ] **Tests frágiles** — Tests que dependen del orden o del tiempo
- [ ] **Mocks excesivos** — Tests que mockean demasiado no prueban nada real

### 5. Documentación y Contratos

- [ ] **APIs públicas documentadas** — Parámetros, errores posibles, ejemplos
- [ ] **Contratos implícitos** — Precondiciones no documentadas en funciones
- [ ] **Comentarios desactualizados** — Comentarios que mienten sobre el código

---

## Formato de Salida

```markdown
## Code Review — [nombre del archivo/módulo]

### 🔴 Crítico (bloquea merge)
- **[TIPO]** `archivo:línea` — Descripción del problema
  ```
  código problemático
  ```
  **Solución:** código o descripción de la corrección

### 🟡 Advertencia (debe corregirse)
- **[TIPO]** `archivo:línea` — Descripción

### 🔵 Sugerencia (mejora opcional)
- **[TIPO]** — Descripción

### ✅ Bien hecho
- [Aspectos positivos del código]

### Resumen
- Bloqueantes: N | Advertencias: N | Sugerencias: N
- Veredicto: [APROBAR / APROBAR CON CAMBIOS / RECHAZAR]
```

---

## Post-Review

Después de completar el review:
1. Si se encontraron patrones recurrentes → sugerir agregar a `memory/patterns/`
2. Si hay decisiones arquitectónicas → sugerir crear ADR en `docs/decisions/`
3. Actualizar el log con el veredicto final

---

## ⚠️ Gotchas

- **No marcar todo como crítico** — Reservar 🔴 solo para vulnerabilidades reales o bugs con impacto demostrable.
- **No reescribir código funcional** — Code review analiza, no refactoriza.
- **Falsos positivos de seguridad** — Verificar el contexto real antes de marcar.
- **Ignorar el contexto del proyecto** — Leer instrucciones del proyecto primero.
- **Reviews parciales sin decirlo** — Siempre indicar el alcance del review.
