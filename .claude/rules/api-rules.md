---
paths:
  - "src/api/**"
  - "**/*controller*"
  - "**/*router*"
  - "**/*endpoint*"
  - "**/*handler*"
---

# Reglas para Capa API

Estas reglas aplican automáticamente cuando Claude trabaja en archivos de la capa API (`src/api/**`).

## Contratos y Versioning

- Todo endpoint nuevo DEBE tener versionado explícito (`/v1/`, `/v2/`, etc.)
- Los cambios de contrato deben ser backward-compatible o crear nueva versión
- Los breaking changes requieren deprecation notice con un ciclo de versión

## Validación de Input

- Validar SIEMPRE en la capa de entrada — nunca confiar en el caller
- Usar schemas declarativos (Zod, Pydantic, JSON Schema, etc.)
- Los IDs de recursos deben sanitizarse antes de consultar la base de datos
- Nunca pasar request bodies directamente a la capa de datos sin validación

## Seguridad en API

- Autenticación: verificar token ANTES de cualquier lógica de negocio
- Autorización: verificar permisos a nivel de recurso, no solo de ruta
- Los errores de autenticación/autorización DEBEN retornar 401/403 genéricos
- Nunca exponer stack traces, IDs internos, ni detalles de BD en respuestas de error
- Rate limiting RECOMENDADO en endpoints públicos

## Responses

- Usar HTTP status codes apropiados (200/201/400/401/403/404/409/422/500)
- Los errores DEBEN incluir un `error_code` machine-readable además del mensaje
- La paginación debe usar cursor-based (no offset) para colecciones grandes
- Documentar con OpenAPI/Swagger si el proyecto lo usa

## Logging en API

- Loggear request id, method, path, status code, duración en cada request
- NUNCA loggear request bodies completos — pueden contener PII o secretos
- Los 4xx/5xx DEBEN loggearse con suficiente contexto para debug
