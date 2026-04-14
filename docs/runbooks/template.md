# Runbook: [Nombre de la Operación]

**Versión:** 1.0
**Última actualización:** YYYY-MM-DD
**Autor:** [nombre]
**Tiempo estimado:** [X minutos]
**Impacto:** [Ninguno | Degradación parcial | Downtime total]
**Reversible:** [Sí / No / Parcialmente]

---

## Descripción

[Qué hace este runbook y cuándo se debe usar.
Incluir casos de uso / triggers: ¿qué evento lleva a ejecutar esto?]

---

## Prerrequisitos

- [ ] Acceso a [sistema/entorno]
- [ ] Credenciales para [servicio]
- [ ] [Herramienta X] instalada y configurada
- [ ] Notificar a [equipo/persona] antes de comenzar

---

## Variables

Definir antes de empezar:

```bash
# Completar estos valores antes de ejecutar
ENVIRONMENT="[staging|production]"
VERSION="[vX.Y.Z]"
REGION="[región si aplica]"
```

---

## Pasos

### 1. Verificación pre-operación

```bash
$ [comando para verificar estado inicial]
```

**Verificar que:** [qué debería mostrar la salida — sea específico]

---

### 2. [Nombre del paso 2]

[Descripción breve de qué hace este paso]

```bash
$ [comando exacto a ejecutar]
```

**Verificar que:** [resultado esperado]

---

### ⚠️ 3. [Paso irreversible — marcar con ⚠️]

**ANTES DE CONTINUAR:** Confirmar que los pasos anteriores completaron exitosamente.

```bash
$ [comando crítico]
```

**Verificar que:** [resultado esperado]

---

### 4. Verificación post-operación

```bash
$ [health check]
$ [verificar logs por errores]
```

**Verificar que:** [sistema operando normalmente]

---

## Rollback

> Ejecutar si algo salió mal después del paso [N].

### Rollback — Paso a Paso

1. [Primer paso de rollback]

```bash
$ [comando de rollback]
```

2. [Segundo paso]

---

## Troubleshooting

### Problema: [Error o síntoma común]

**Síntoma:** [Qué se ve cuando ocurre este problema]

**Causa probable:** [Por qué ocurre]

**Solución:**
```bash
$ [comando para resolver]
```

---

### Problema: [Otro error común]

**Síntoma:** ...

---

## Escalación

Si el runbook falla y no puedes resolver con el troubleshooting:

1. **No continuar** — detener la operación en el último paso exitoso
2. Notificar a: [nombre/canal/pagerduty]
3. Documentar: qué paso falló, error exacto, qué se intentó

---

## Notas

[Información adicional, advertencias, contexto histórico relevante]

---

*Runbook probado por última vez el: YYYY-MM-DD por [nombre]*
