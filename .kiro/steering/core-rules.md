---
inclusion: fileMatch
fileMatchPattern: ["src/core/**", "src/domain/**", "src/business/**", "**/*service*", "**/*usecase*", "**/*use_case*"]
---

# Reglas para Capa Core / Dominio

## Pureza del Dominio

- El core NO puede importar frameworks, ORM, ni adaptadores externos
- Las dependencias fluyen desde afuera hacia adentro (Dependency Inversion)
- Las entidades de dominio son plain objects/dataclasses — sin decoradores de framework
- Si necesitas un servicio externo, usar una interfaz (puerto) y un adaptador

## Lógica de Negocio

- Toda regla de negocio DEBE estar en esta capa, no en controladores ni repositorios
- Los casos de uso tienen una sola responsabilidad (Single Responsibility)
- Los casos de uso son orquestadores — no contienen validación de formato
- Los invariantes de dominio se validan en las entidades, no en los servicios

## Errors y Excepciones

- Usar errores de dominio tipados (no strings genéricos)
- Las excepciones de dominio NO heredan de excepciones de infraestructura
- Documentar los casos excepcionales esperados en la firma o docstring

## Testing en Core

- El core es el módulo más fácil de testear — no requiere mocks de infraestructura
- Los tests de core son unit tests puros sin I/O
- Coverage objetivo: >90% en lógica de negocio crítica

## Cambios que Requieren ADR

- Cambiar un invariante de dominio existente
- Agregar dependencia externa al core
- Cambiar la firma de un caso de uso usado en múltiples lugares
- Introducir un nuevo bounded context
