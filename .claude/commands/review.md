# /review — Comando de Code Review

Inicia un code review completo usando el skill de code-review.

## Uso

```
/review                    → Review del archivo actual o selección
/review src/api/           → Review de todo un directorio
/review --security         → Review enfocado solo en seguridad
/review --quick            → Review rápido (solo críticos)
```

## Instrucciones

Cuando se invoque este comando:

1. Verificar qué archivos están en el contexto actual (abiertos, seleccionados o especificados)
2. Si no hay contexto, preguntar qué archivos revisar
3. Aplicar el skill completo de `.claude/skills/code-review/SKILL.md`
4. Presentar el reporte con el formato definido en el skill
5. Al finalizar, preguntar si hay issues críticos que corregir ahora

## Flags

- `--security`: Solo ejecutar la sección de seguridad del skill
- `--quick`: Solo reportar issues **Críticos** y **Advertencias**, omitir sugerencias
- `--focus=[arquitectura|performance|testing]`: Enfocarse en una dimensión específica
