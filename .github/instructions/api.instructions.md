---
applyTo: "src/api/**,**/*controller*,**/*router*,**/*endpoint*,**/*handler*"
---

# API Layer Rules

These rules apply automatically when working on API layer files (`src/api/**`).

## Contracts and Versioning

- Every new endpoint MUST have explicit versioning (`/v1/`, `/v2/`, etc.)
- Contract changes must be backward-compatible or create a new version
- Breaking changes require a deprecation notice with one version cycle

## Input Validation

- Always validate at the entry layer — never trust the caller
- Use declarative schemas (Zod, Pydantic, JSON Schema, etc.)
- Resource IDs must be sanitized before querying the database
- Never pass request bodies directly to the data layer without validation

## API Security

- Authentication: verify token BEFORE any business logic
- Authorization: verify permissions at resource level, not just route level
- Auth/authorization errors MUST return generic 401/403 responses
- Never expose stack traces, internal IDs, or DB details in error responses
- Rate limiting RECOMMENDED on public endpoints

## Responses

- Use appropriate HTTP status codes (200/201/400/401/403/404/409/422/500)
- Errors MUST include a machine-readable `error_code` alongside the message
- Pagination must use cursor-based (not offset) for large collections
- Document with OpenAPI/Swagger if the project uses it

## Logging in API

- Log request id, method, path, status code, duration for each request
- NEVER log complete request bodies — they may contain PII or secrets
- 4xx/5xx MUST be logged with enough context for debugging
