# Debug Prompt — Depuración Sistemática

> Prompt para debugging estructurado. Fuerza el proceso científico de hipótesis → experimento → conclusión.

---

## Prompt Base

```
Ayúdame a depurar el siguiente problema usando el método científico.
NO adivines — razona desde evidencia.

## Información del Bug

**Mensaje de error exacto:**
```
[pegar el stack trace o mensaje de error COMPLETO]
```

**Comportamiento esperado:**
[qué debería pasar]

**Comportamiento actual:**
[qué pasa en realidad]

**Reproducción:**
- ¿Ocurre siempre o intermitentemente? [siempre / a veces / solo bajo condición X]
- ¿En qué entornos ocurre? [local / staging / producción / todos]
- ¿Cuándo comenzó? [después de qué commit/cambio/deploy]

**Logs relevantes:**
```
[últimas N líneas de logs, no el archivo completo]
```

**Contexto del código:**
[pegar el código relevante o mencionar archivos a revisar]

## Proceso que Debes Seguir

1. **Analizar la evidencia** — No saltar a conclusiones
2. **Generar 3 hipótesis** ordenadas por probabilidad
3. **Diseñar un experimento mínimo** para verificar la hipótesis más probable
4. **Solo si me confirmas la hipótesis**, proponer el fix

Empieza por el análisis de evidencia.
```

---

## Variantes

### Debug de Performance

```
Tengo un problema de rendimiento. Ayúdame a identificar el cuello de botella.

**Síntoma:**
[latencia alta / uso de memoria / CPU al 100% / etc.]

**Métricas:**
- Antes: [tiempo/memoria/CPU]
- Después: [tiempo/memoria/CPU]
- Percentil P99: [si aplica]

**Contexto:**
- Volumen de datos: [N registros / N requests/s]
- Cuándo ocurre: [siempre / con X datos / a cierta hora]

**Profiling disponible:**
[pegar output de profiler o decir que no hay]

Identifica los 3 candidatos más probables de cuello de botella y el experimento
más económico para confirmar cuál es.
```

### Debug de Concurrencia/Race Condition

```
Tengo un bug que ocurre intermitentemente y sospecho que es un race condition.

**Síntoma:**
[descripción del comportamiento no determinístico]

**Frecuencia:**
[1 de cada N ejecuciones / solo bajo carga / etc.]

**Partes concurrentes del código:**
[pegar código con threads/async/locks]

**Logs (con timestamps):**
```
[logs mostrando el timing de los eventos]
```

Identifica potenciales race conditions y cómo verificarlos.
```

### Post-Mortem de Incidente

```
Tuvimos un incidente en producción. Ayúdame a entender la causa raíz.

**Descripción del incidente:**
[qué ocurrió, cuándo, impacto]

**Timeline:**
- HH:MM — [evento 1]
- HH:MM — [evento 2]
- HH:MM — [incidente detectado]
- HH:MM — [resolución]

**Logs del período:**
[logs relevantes]

**Cambios recientes:**
[deploys, cambios de config, cambios de datos en las últimas 24-48h]

Genera un análisis de causa raíz con:
1. Causa inmediata
2. Causa raíz subyacente
3. Factores contribuyentes
4. Acciones correctivas (inmediatas + largo plazo)
```
