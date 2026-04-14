# Stack Tecnológico

> Inventario del stack tecnológico del proyecto. Claude usa este archivo para dar sugerencias y código consistentes con las tecnologías elegidas.

---

## Stack Principal

| Capa               | Tecnología          | Versión | Razón de elección       |
|--------------------|---------------------|---------|-------------------------|
| Runtime            | [ej: Node.js]       | [X.Y]   | [ADR-NNN]               |
| Framework web      | [ej: Fastify]       | [X.Y]   | [ADR-NNN]               |
| Base de datos      | [ej: PostgreSQL]    | [X.Y]   | [ADR-NNN]               |
| ORM/Query Builder  | [ej: Prisma]        | [X.Y]   | [ADR-NNN]               |
| Testing            | [ej: Vitest]        | [X.Y]   | —                       |
| Linting            | [ej: ESLint]        | [X.Y]   | —                       |
| Formateo           | [ej: Prettier]      | [X.Y]   | —                       |

---

## Herramientas de Desarrollo

| Herramienta    | Versión | Propósito                   |
|----------------|---------|-----------------------------|
| Claude Code    | latest  | Asistente de desarrollo IA  |
| Git            | ≥2.40   | Control de versiones        |
| Docker         | [X.Y]   | Containerización (si aplica)|
| [Otros]        | ...     | ...                         |

---

## Dependencias Externas (Servicios)

| Servicio        | Propósito           | Entorno              |
|-----------------|---------------------|----------------------|
| [ej: SendGrid]  | Envío de emails     | staging + production |
| [ej: S3]        | Almacenamiento blob | staging + production |

---

## Convenciones de Código por Tecnología

### [Tecnología Principal]

- **Estilo:** [ej: ESLint + Prettier, estándar del proyecto]
- **Imports:** [ej: absolute paths, no relative para cruzar módulos]
- **Errores:** [ej: Result pattern / throw / error first callbacks]
- **Types:** [ej: strict TypeScript, no `any` salvo con comentario justificado]
- **Async:** [ej: async/await, no callbacks ni .then() chains]

---

## Decisiones Pendientes

| Área           | Opciones en consideración | ADR          |
|----------------|--------------------------|--------------|
| [Área]         | [Opción A vs B]          | Pendiente    |

---

## Versiones Mínimas Requeridas

```
[runtime] >= [X.Y]
[tool]    >= [X.Y]
```
