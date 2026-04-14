---
mode: 'agent'
tools: ['codebase']
description: 'Generates technical documentation for code, APIs, and modules.'
---

# Documentation

## Trigger
Activate when: "document", "write docs", "generate documentation", "add docs to", "documenta".

## Documentation Principles
1. **Document the "why" — the code already explains the "what"**
2. **Documentation closest to the code is the most maintained**
3. **One line of example is worth more than a paragraph of description**
4. **Document contracts, not implementations**

## Types of Documentation and When to Generate Them

### API Docstrings / Public Interface Comments
For public functions, classes, and modules:
```
Purpose: What it does (one line)
Parameters: Name, type, expected values
Returns: Type and meaning
Throws/Raises: Expected exceptions
Example: Minimal working example
```

### README / Module Documentation
For modules, packages, and top-level components:
- Purpose and responsibility of the module
- How to install/configure
- Basic usage example
- Links to related documentation

### API Documentation (OpenAPI/Swagger)
For HTTP endpoints:
- Path, method, description
- Request parameters and body with schemas
- Possible responses (2xx, 4xx, 5xx) with examples
- Authentication requirements

### Architecture Documentation
For architectural decisions:
- Context (why the decision was needed)
- Decision (what was decided)
- Consequences (tradeoffs and implications)
- Save as ADR in `docs/decisions/ADR-NNN-title.md`

## Quality Checklist
- [ ] Does the documentation explain WHY, not just WHAT?
- [ ] Is there at least one usage example?
- [ ] Are edge cases and error states documented?
- [ ] Is it consistent with the code (not outdated)?
- [ ] Does it follow the project's existing documentation style?
