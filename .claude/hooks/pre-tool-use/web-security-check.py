#!/usr/bin/env python3
"""
Hook: PreToolUse — WebFetch Security Check
===========================================
Bloquea peticiones WebFetch a dominios sospechosos o maliciosos
antes de que se ejecuten.

Protocolo:
- exit(0) con JSON hookSpecificOutput → decisión de permiso
- exit(0) sin output → continúa normalmente
"""
import json
import sys
import urllib.parse

# Dominios o patrones de URL que NUNCA deben accederse automáticamente
BLOCKED_URL_PATTERNS: list[tuple[str, str]] = [
    # Data exfiltration endpoints comunes
    ("ngrok.io", "Túnel público — potencial exfiltración de datos"),
    ("requestb.in", "Endpoint de captura de peticiones HTTP"),
    ("hookbin.com", "Endpoint de captura de peticiones HTTP"),
    ("webhook.site", "Endpoint público de captura no verificado"),
    ("burpcollaborator.net", "Herramienta de auditoría / exfiltración"),
    ("canarytokens.com", "Honeypot de rastreo"),
    # Servicios de acortado usados en phishing
    ("bit.ly/", "URL acortada — destino desconocido"),
    ("tinyurl.com/", "URL acortada — destino desconocido"),
    ("t.co/", "URL acortada — destino desconocido"),
    # Metadata endpoints de cloud (acceso lateral no intencionado)
    ("169.254.169.254", "AWS/GCP metadata endpoint — SSRF potencial"),
    ("metadata.google.internal", "GCP metadata endpoint — SSRF potencial"),
    # Esquemas peligrosos
    ("file://", "Acceso a filesystem local vía URL"),
    ("gopher://", "Protocolo obsoleto — vector SSRF"),
    ("dict://", "Protocolo leve — vector SSRF"),
]

# Dominios de confianza que pueden tener substrings de los bloqueados
TRUSTED_DOMAINS: list[str] = [
    "github.com",
    "githubusercontent.com",
    "npmjs.com",
    "pypi.org",
    "docs.anthropic.com",
    "code.claude.com",
]


def is_trusted(url_lower: str) -> bool:
    return any(td in url_lower for td in TRUSTED_DOMAINS)


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    url: str = data.get("tool_input", {}).get("url", "")
    if not url:
        sys.exit(0)

    url_lower = url.lower()

    # Trusted domains bypass the checks below
    if is_trusted(url_lower):
        sys.exit(0)

    for pattern, reason in BLOCKED_URL_PATTERNS:
        if pattern.lower() in url_lower:
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": (
                        f"[web-security-check] URL bloqueada por política de seguridad.\n"
                        f"Patrón detectado: '{pattern}'\n"
                        f"Razón: {reason}\n"
                        f"URL: {url}\n"
                        f"Accede manualmente si es intencional."
                    ),
                }
            }
            print(json.dumps(output))
            sys.exit(0)

    sys.exit(0)


if __name__ == "__main__":
    main()
