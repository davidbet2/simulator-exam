---
applyTo: "src/core/**,src/domain/**,src/business/**,**/*service*,**/*usecase*,**/*use_case*"
---

# Core / Domain Layer Rules

These rules apply when working on core business logic.

## Domain Purity

- Core CANNOT import frameworks, ORMs, or external adapters
- Dependencies flow from outside to inside (Dependency Inversion)
- Domain entities are plain objects/dataclasses — no framework decorators
- If you need an external service, use an interface (port) and an adapter

## Business Logic

- All business rules MUST live in this layer, not in controllers or repositories
- Use cases have a single responsibility (Single Responsibility Principle)
- Use cases are orchestrators — they do not contain format validation
- Domain invariants are validated in entities, not in services

## Errors and Exceptions

- Use typed domain errors (not generic strings)
- Domain exceptions MUST NOT inherit from infrastructure exceptions
- Document expected exceptional cases in the signature or docstring

## Testing in Core

- Core is the easiest module to test — no infrastructure mocks needed
- Core tests are pure unit tests without I/O
- Target coverage: > 90% on critical business logic

## Changes Requiring ADR

- Changing an existing domain invariant
- Adding an external dependency to core
- Changing a use case signature used in multiple places
- Introducing a new bounded context
