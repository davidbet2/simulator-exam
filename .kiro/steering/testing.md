---
inclusion: fileMatch
fileMatchPattern: ["**/*.test.*", "**/*.spec.*", "**/tests/**", "**/test/**", "**/__tests__/**", "**/e2e/**"]
---

# Reglas para Tests

## Estructura de Tests (AAA Pattern)

```
// Arrange — preparar el estado
// Act — ejecutar la acción bajo test
// Assert — verificar el resultado esperado
```

- Cada test tiene exactamente UNA razón para fallar
- El nombre del test describe: QUÉ se hace, BAJO QUÉ condición, QUÉ se espera
- Formato recomendado: `should_<expected>_when_<condition>`

## Tipos de Tests y Cuándo Usarlos

| Tipo | Cuándo | No usar si |
|------|--------|-----------|
| Unit | Lógica aislada, funciones puras, entidades | Requiere I/O real |
| Integration | Repositorios, adaptadores, flujos completos | Solo testea una función |
| E2E | Flujos críticos de negocio end-to-end | Todos los casos — es lento |

## Mocks y Stubs

- Mockear SOLO dependencias externas (BD, APIs, filesystem)
- No mockear el sistema under test ni sus colaboradores internos
- Preferir fakes (implementaciones simples) sobre mocks complejos
- Un test que necesita muchos mocks puede indicar diseño acoplado

## Performance de Tests

- Unit tests: < 10ms por test
- Integration tests: < 1s por test
- Si un test tarda más, marcarlo con `@slow` o equivalente
- No hacer `sleep()` en tests — usar fake timers o awaitable events

## Anti-patterns a Evitar

- ❌ Tests que se acoplan al orden de ejecución
- ❌ Variables globales compartidas entre tests sin reset
- ❌ `describe.only` / `it.only` / `test.only` en código commiteado
- ❌ Tests que prueban el ORM/framework en vez de la lógica de negocio
- ❌ Asserts sin mensaje descriptivo en tests críticos

## Coverage

- No perseguir 100% de coverage a cualquier costo — es una métrica, no un objetivo
- Priorizar coverage en: lógica de negocio crítica, edge cases, paths de error
- Branch coverage más valioso que line coverage para lógica compleja
