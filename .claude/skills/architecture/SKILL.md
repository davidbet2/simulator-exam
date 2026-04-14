---
name: architecture
description: Architectural decision-making and design with ADR creation. Use when designing new components, making structural decisions, or when the user asks "how to structure", "design this", "architect".
paths:
  - "docs/architecture.md"
  - "docs/decisions/**"
  - "src/**"
context: fork
agent: Explore
allowed-tools: Read Grep Glob
---

# Skill: Architecture

## Trigger

Activar cuando el usuario diga: "diseña", "arquitectura de", "cómo estructurar", "propón una solución", "design [component]", "architect"

---

## Framework de Decisiones Arquitectónicas

### Antes de Diseñar: Preguntas Críticas

Nunca proponer una arquitectura sin responder primero:

1. **¿Cuál es el problema real?** — No el síntoma, el problema subyacente
2. **¿Cuáles son los requisitos no funcionales clave?**
   - Escala: ¿Cuántos usuarios/requests/datos?
   - Latencia: ¿Cuánto tiempo de respuesta es aceptable?
   - Disponibilidad: ¿Cuánto downtime es tolerable?
   - Consistencia: ¿CAP theorem — qué se sacrifica?
3. **¿Qué restricciones existen?** — Tecnología, equipo, tiempo, presupuesto
4. **¿Qué alternativas existen?** — Siempre presentar al menos 2-3 opciones

---

## Proceso de Diseño

### Fase 1: Entender el Dominio

1. Identificar las entidades principales del dominio
2. Mapear las operaciones críticas (casos de uso core)
3. Identificar invariantes del negocio (reglas que nunca se pueden violar)

### Fase 2: Identificar Atributos de Calidad

Priorizar explícitamente:

| Atributo         | Prioridad | Justificación |
|------------------|-----------|---------------|
| Performance      | Alta/Media/Baja | [razón] |
| Scalability      | Alta/Media/Baja | [razón] |
| Maintainability  | Alta/Media/Baja | [razón] |
| Security         | SIEMPRE alta | — |
| Testability      | Alta/Media/Baja | [razón] |

### Fase 3: Generar Opciones

Siempre presentar **mínimo 2 alternativas** con:
- Trade-offs explícitos
- Cuándo cada opción es mejor
- Costo estimado (simples: bajo/medio/alto)

### Fase 4: Recomendación Razonada

1. Recomendar una opción con justificación clara
2. Identificar los riesgos principales y cómo mitigarlos
3. Definir puntos de extensión para cambiar de opción si se necesita

### Fase 5: Documentar la Decisión

Crear un ADR en `docs/decisions/` usando el template.

---

## Patrones a Considerar (por contexto)

### Para APIs y Servicios

- **Hexagonal / Ports & Adapters** — cuando quieres aislar la lógica de negocio de frameworks
- **CQRS** — cuando reads y writes tienen necesidades muy diferentes
- **Event Sourcing** — cuando el historial de cambios es tan importante como el estado actual
- **Outbox Pattern** — cuando necesitas consistencia entre DB y mensajería

### Para Datos

- **Repository Pattern** — abstrae el acceso a datos de la lógica de negocio
- **Unit of Work** — coordina múltiples repositorios en una transacción lógica
- **Read Model** — proyecciones optimizadas para consultas específicas

### Para Sistemas Distribuidos

- **Circuit Breaker** — previene cascada de fallos
- **Retry con backoff exponencial** — maneja fallos transitorios
- **Saga Pattern** — transacciones distribuidas sin 2-phase commit
- **API Gateway** — punto único de entrada, cross-cutting concerns

---

## Formato de Diseño

```markdown
## Propuesta Arquitectónica: [componente]

### Contexto
[Problema que se resuelve en 2-3 líneas]

### Requisitos No Funcionales
- Escala: [dato]
- Latencia objetivo: [dato]
- Disponibilidad: [dato]

### Opciones Consideradas

#### Opción A: [nombre]
**Descripción:** ...
**Pros:** ...
**Contras:** ...
**Mejor cuando:** ...

#### Opción B: [nombre]
...

### Recomendación: Opción [X]

**Justificación:** [por qué es la mejor para este contexto]

**Diagrama:**
```
[ASCII diagram or description]
```

**Riesgos y Mitigaciones:**
- Riesgo: [R1] → Mitigación: [M1]

**Próximos pasos:**
1. [Paso concreto con responsable]

### ADR Creado
Ver [docs/decisions/XXX-nombre.md](../../docs/decisions/)
```

---

## Post-Design

1. Crear ADR en `docs/decisions/` usando el template
2. Actualizar `docs/architecture.md` si cambió la arquitectura global
3. Registrar la decisión en `memory/decisions/`
