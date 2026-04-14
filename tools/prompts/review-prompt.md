# Review Prompt — Code Review Estructurado

> Prompt optimizado para code reviews profundos. Alternativa al skill cuando necesitas más control sobre el output.

---

## Prompt Base

```
Realiza un code review exhaustivo del siguiente código.

## Contexto
- Proyecto: [PROJECT_NAME]
- Módulo: [módulo o archivo a revisar]
- Propósito de este código: [qué hace]
- Cambio que introduce: [nuevo feature / bugfix / refactor / etc.]

## Checklist de Review

Evalúa en este orden y sé específico con archivo:línea cuando encuentres algo:

### 1. Seguridad (prioridad máxima)
- [ ] Injection vulnerabilities (SQL, command, XSS, etc.)
- [ ] Autenticación y autorización correcta
- [ ] Secrets o credenciales hardcodeadas
- [ ] Validación de inputs en boundaries del sistema
- [ ] Logging de datos sensibles (PII, tokens, passwords)

### 2. Corrección
- [ ] El código hace lo que dice hacer
- [ ] Manejo de errores y casos límite (null, empty, overflow)
- [ ] Condiciones de carrera si hay concurrencia
- [ ] Contratos de API respetados

### 3. Calidad
- [ ] Complejidad innecesaria
- [ ] Duplicación evitable
- [ ] Nombres que comunican intención
- [ ] Funciones de responsabilidad única

### 4. Tests
- [ ] Hay tests para el comportamiento nuevo/cambiado
- [ ] Los casos límite están testeados
- [ ] Los tests son frágiles (dependen de tiempo, orden, etc.)

## Formato de Respuesta

Usa este formato exacto:

### 🔴 Crítico (bloquea merge)
[issues que DEBEN resolverse]

### 🟡 Advertencia (debería corregirse)
[issues importantes pero no bloqueantes]

### 🔵 Sugerencia (mejora opcional)
[ideas de mejora sin impacto funcional]

### ✅ Bien hecho
[al menos 2-3 aspectos positivos concretos]

### Veredicto
APROBAR | APROBAR CON CAMBIOS MENORES | APROBAR CON CAMBIOS MAYORES | RECHAZAR

Razón: [una línea]
```

---

## Variantes

### Review Enfocado en Seguridad

```
Realiza un security audit del siguiente código con foco en OWASP Top 10.
Para cada vulnerabilidad encontrada, incluir:
- Severidad: Critical/High/Medium/Low
- OWASP categoría
- Código vulnerable exacto
- Exploit scenario (cómo se exploraría)
- Fix recomendado con código

[CÓDIGO AQUÍ]
```

### Review de Arquitectura

```
Evalúa las decisiones arquitectónicas del siguiente código:
- ¿Respeta la separación de capas definida en docs/architecture.md?
- ¿Las dependencias van en la dirección correcta?
- ¿Hay acoplamiento innecesario?
- ¿Es testeable sin integración?
- ¿Escala para [N usuarios/requests]?

[CÓDIGO AQUÍ]
```
