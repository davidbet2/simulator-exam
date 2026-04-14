# Runbooks Operativos

Este directorio contiene los playbooks para operar el sistema de forma segura y reproducible.

## ¿Qué es un Runbook?

Un **Runbook** es una guía paso a paso para ejecutar una operación operativa:
deploy, rollback, scale up, incident response, backup, etc.

Los runbooks están diseñados para poder ejecutarse **bajo presión**, por lo que deben ser:
- Claros y sin ambigüedad
- Con comandos exactos copiables
- Con checkpoints de verificación
- Con sección de troubleshooting para los problemas más comunes

## Índice

| Runbook | Descripción | Frecuencia |
|---------|-------------|------------|
| [template.md](template.md) | Template para nuevos runbooks | — |
| *(sin runbooks aún)* | — | — |

## Crear un nuevo Runbook

1. Copiar `template.md` como `[operacion]-runbook.md`
2. Completar todas las secciones
3. **Probar el runbook** antes de hacer commit — que cada paso funcione
4. Agregar al índice de este README

O pedirle a Claude:
```
"Crea un runbook para [operación]"
```

## Convenciones

- Los comandos van en bloques de código con el símbolo del prompt: `$`
- Los valores a reemplazar van en `[MAYÚSCULAS_CON_CORCHETES]`
- Los pasos críticos irreversibles tienen ⚠️ delante
- Cada paso tiene su verificación ("Verificar que...")
