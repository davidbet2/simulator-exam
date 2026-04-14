---
name: documentation
description: Generates technical documentation for code, APIs, and modules. Use when the user says "documenta", "escribe docs", "generate documentation", "document this", or "add docs to".
paths:
  - "**/*.{ts,js,py,go,java,cs,rb,rs}"
  - "docs/**"
allowed-tools: Read Grep Glob
---

# Skill: Documentation

## Trigger

Activar cuando el usuario diga: "documenta", "escribe docs", "genera documentación", "document this", "add docs"

---

## Principios de Documentación

1. **Documenta el "por qué", el código ya dice el "qué"**
2. **La documentación más cercana al código es la más mantenida**
3. **Una línea de ejemplo vale más que un párrafo de descripción**
4. **Documenta contratos, no implementaciones**

---

## Tipos de Documentación y Cuándo Generarlos

### Docstrings / Comentarios de API Pública

Para funciones/métodos/clases públicas:

```python
# Python
def process_payment(amount: Decimal, currency: str, idempotency_key: str) -> PaymentResult:
    """
    Procesa un pago de forma idempotente.

    Args:
        amount: Monto a cobrar. Debe ser positivo.
        currency: Código ISO 4217 (ej: "USD", "EUR").
        idempotency_key: UUID único por intento. Mismo key = mismo resultado.

    Returns:
        PaymentResult con status y transaction_id.

    Raises:
        InsufficientFundsError: Si el balance es insuficiente.
        InvalidCurrencyError: Si el currency code no es válido.

    Example:
        result = process_payment(Decimal("9.99"), "USD", str(uuid4()))
    """
```

```typescript
// TypeScript
/**
 * Processes a payment idempotently.
 * @param amount - Amount to charge. Must be positive.
 * @param currency - ISO 4217 currency code (e.g., "USD").
 * @param idempotencyKey - Unique UUID per attempt. Same key = same result.
 * @returns PaymentResult with status and transaction_id.
 * @throws {InsufficientFundsError} If balance is insufficient.
 * @example
 * const result = await processPayment(9.99, "USD", crypto.randomUUID());
 */
```

### README de Módulo (CLAUDE.md en src/)

Para cada módulo en `src/`, mantener un CLAUDE.md con:
- Propósito en 2-3 líneas
- Responsabilidades claras (qué hace y qué NO hace)
- Dependencias del módulo
- Decisiones de diseño clave

### Architecture Decision Records (ADRs)

Para decisiones que afectan la arquitectura general. Usar template en `docs/decisions/template.md`.

### Runbooks

Para operaciones que se repiten. Usar template en `docs/runbooks/template.md`.

---

## Proceso

### 1. Analizar lo que existe

- ¿Hay documentación previa que actualizar o está desactualizada?
- ¿Es una API pública o código interno?
- ¿Hay ejemplos de uso que documentar?

### 2. Generar según el tipo

Para código existente sin docs:
1. Leer el código y entender la intención
2. Identificar contratos: qué espera, qué retorna, qué puede fallar
3. Escribir la documentación in-context (donde vive el código)

### 3. Verificar consistencia

- La documentación debe ser consistente con los tests
- Los ejemplos deben ejecutar correctamente
- Los tipos deben coincidir con la implementación real

---

## Formato de Reporte

```markdown
## Documentación Generada — [módulo/archivo]

### Agregado
- [ ] Docstrings en [N] funciones públicas
- [ ] README de módulo en src/[módulo]/CLAUDE.md
- [ ] ADR para [decisión] en docs/decisions/

### Pendiente (requiere información del usuario)
- [ ] [Qué falta y qué información se necesita]
```
