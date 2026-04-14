---
applyTo: "**"
---

# Security Rules — Always Active

These rules apply to **all files** in the project without exception.

## OWASP Top 10 — Mandatory Checks

### A01: Broken Access Control
- Never trust client-side for access controls
- Verify permissions server-side for every operation
- Use allow-lists (not deny-lists) for access control

### A02: Cryptographic Failures
- Never implement custom cryptography — use standard libraries
- HTTPS/TLS for all data in transit
- Passwords: bcrypt, argon2, scrypt (NO MD5, SHA1, SHA256 without salt)
- Encryption keys: never hardcoded, use secret managers

### A03: Injection
- **SQL**: Always use prepared statements or parameterized ORM — NEVER concatenate
- **Shell**: Avoid `shell=True` in Python, always escape in Node.js
- **HTML**: Escape output before rendering (XSS prevention)
- **Path**: Normalize and validate paths before filesystem operations

### A05: Security Misconfiguration
- Never commit secrets, tokens, or credentials
- Remove debug/development configuration in production
- Production errors MUST NOT expose stack traces

### A06: Vulnerable Components
- Warn when a library is used without a pinned version
- Report if a dependency has known CVEs (if in metadata)

### A07: Authentication Failures
- Sessions: cryptographically random tokens, httpOnly cookies
- Never accept JWTs with `alg: none`
- Implement rate limiting on authentication endpoints

### A09: Logging and Monitoring Failures
- Log security events: auth failures, access denied, permission changes
- NEVER log passwords, tokens, or PII
- Security logs must be append-only (protect from deletion)

## Protected Files

These files MUST NEVER be modified without explicit user confirmation:
- `.env`, `.env.*`, `*.secret`, `secrets/**`
- `*.pem`, `*.key`, `*.p12`, `*.pfx` (certificates/private keys)
- `**/migrations/**` (DB migrations — irreversible changes)
- `**/production.yml`, `**/prod/**` (production config)

## Secret Detection

Alert immediately if any of these patterns are found in source code:
- `password = "..."` (literal value)
- `api_key = "..."` (literal value)
- `secret = "..."` (literal value)
- Token matching `[A-Za-z0-9+/]{40,}` hardcoded
- Strings starting with `sk-`, `ghp_`, `xoxb-`, `AKIA`
