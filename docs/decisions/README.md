# Architecture Decision Records (ADRs)

Este directorio contiene el historial de decisiones arquitectónicas del proyecto.

## ¿Qué es un ADR?

Un **Architecture Decision Record** es un documento corto que captura una decisión arquitectónica importante: qué se decidió, por qué se decidió así, y qué alternativas se consideraron.

Los ADRs son **inmutables** — una vez escritos no se editan. Si la decisión cambia, se crea un nuevo ADR que la reemplaza.

## Por qué los usamos

- Nuevo miembro del equipo puede entender el "por qué" del sistema, no solo el "qué"
- Evita repetir discusiones que ya se tuvieron
- Claude puede consultarlos antes de proponer cambios arquitectónicos
- Sirven como contexto para los MCPs de memoria (Engram/Claudemem)

## Índice

| # | Título | Estado | Fecha |
|---|--------|--------|-------|
| — | *(sin ADRs aún)* | — | — |

## Estados Posibles

- **Propuesto** — En discusión, no implementado
- **Aceptado** — Implementado y vigente
- **Deprecado** — Vigente pero se planea cambiar
- **Reemplazado** — Reemplazado por ADR #[N]

## Crear un nuevo ADR

1. Copiar `template.md` como `[NNN]-titulo-kebab-case.md`
2. Completar todas las secciones
3. Agregar al índice de este README
4. Hacer commit: `docs(adr): add ADR-[NNN] titulo`

También puedes pedirle a Claude:
```
"Crea un ADR para la decisión de usar [tecnología/patrón]"
```
Claude usará el skill de architecture y este template automáticamente.
