# /deploy — Comando de Deployment

Guía el proceso completo de deployment de forma segura.

## Uso

```
/deploy                    → Deployment a staging (default)
/deploy --env=production   → Deployment a producción (requiere confirmación extra)
/deploy --dry-run          → Simular el deployment sin ejecutarlo
/deploy --rollback         → Rollback a la versión anterior
```

## Instrucciones

Cuando se invoque este comando:

1. **Verificar prerrequisitos:**
   - Leer `docs/runbooks/` para encontrar el runbook de deployment aplicable
   - Verificar que el branch actual es el correcto para el entorno
   - Confirmar que los tests pasan: `git status` + verificar CI si aplica

2. **Presentar plan de deployment:**
   ```
   Entorno: [staging/production]
   Branch: [branch actual]
   Versión: [versión actual]
   Cambios desde último deploy: [N commits]
   ```

3. **Pedir confirmación explícita** antes de ejecutar cualquier comando de deploy

4. **Ejecutar deployment según el runbook** del entorno

5. **Verificación post-deploy:**
   - Health check del servicio
   - Verificar logs por errores
   - Confirmar que la versión desplegada es la correcta

## ⚠️ Precauciones

- **NUNCA** hacer deploy a producción sin confirmación explícita del usuario
- Si el deployment falla, no hacer rollback automáticamente — presentar opciones
- Registrar el deployment en `memory/sessions/`

## Flags

- `--env=[staging|production]`: Entorno objetivo (default: staging)
- `--dry-run`: Mostrar qué comandos se ejecutarían sin ejecutarlos
- `--rollback`: Iniciar proceso de rollback a versión anterior
