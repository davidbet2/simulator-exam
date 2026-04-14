---
# Sin paths: → aplica SIEMPRE, en todos los archivos del proyecto
---

# Reglas de Seguridad — Siempre Activas

Estas reglas aplican a **todos los archivos** del proyecto sin excepción.

## OWASP Top 10 — Checks Obligatorios

### A01: Broken Access Control
- Nunca confiar en el client-side para controles de acceso
- Verificar permisos en el servidor para cada operación
- Usar allow-list (no deny-list) para control de acceso

### A02: Cryptographic Failures
- Nunca implementar criptografía custom — usar librerías estándar
- HTTPS/TLS para todo dato en tránsito
- Passwords: bcrypt, argon2, scrypt (NO MD5, SHA1, SHA256 sin sal)
- Claves de cifrado: nunca hardcodeadas, usar secret managers

### A03: Injection
- **SQL**: Siempre usar prepared statements o ORM paramétrico — NUNCA concatenar
- **Shell**: Evitar `shell=True` en Python, escapar siempre en Node.js
- **HTML**: Escapar output antes de renderizar (XSS prevention)
- **Path**: Normalizar y validar rutas antes de operaciones de filesystem

### A05: Security Misconfiguration
- No commitear secrets, tokens, ni credenciales en el código
- Remover configuración de debug/desarrollo en producción
- Los errores de producción NO deben exponer stack traces

### A06: Vulnerable Components
- Advertir cuando se use una librería sin versión pinneada
- Reportar si una dependencia tiene CVEs conocidos (si están en los metadatos)

### A07: Authentication Failures
- Sessions: tokens aleatorios criptográficamente seguros, httpOnly cookies
- Nunca aceptar JWTs con `alg: none`
- Implementar rate limiting en endpoints de autenticación

### A09: Logging and Monitoring Failures
- Loggear eventos de seguridad: auth failures, accesos denegados, cambios de permisos
- NUNCA loggear passwords, tokens, PII en logs
- Los logs de seguridad deben ser append-only (protegerlos de eliminación)

## Archivos Protegidos

Estos archivos NUNCA deben modificarse sin confirmación explícita del usuario:
- `.env`, `.env.*`, `*.secret`, `secrets/**`
- `*.pem`, `*.key`, `*.p12`, `*.pfx` (certificados/claves privadas)
- `**/migrations/**` (migraciones de BD — cambios irreversibles)
- `**/production.yml`, `**/prod/**` (config de producción)

## Detección de Secretos en Código

Si Claude detecta alguno de estos patterns en el código fuente, DEBE alertar:
- `password = "..."` (valor literal)
- `api_key = "..."` (valor literal)
- `secret = "..."` (valor literal)
- Token con patrón `[A-Za-z0-9+/]{40,}` hardcodeado
- Cadenas que empiecen con `sk-`, `ghp_`, `xoxb-`, `AKIA`
