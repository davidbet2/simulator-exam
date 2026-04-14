---
applyTo: "**/*.test.*,**/*.spec.*,**/tests/**,**/test/**,**/__tests__/**,**/e2e/**"
---

# Testing Rules

## Test Structure (AAA Pattern)

```
// Arrange — set up state
// Act    — execute the action under test
// Assert — verify the expected result
```

- Each test has exactly ONE reason to fail
- Test name describes: WHAT is done, UNDER WHAT condition, WHAT is expected
- Recommended format: `should_<expected>_when_<condition>`

## Test Types and When to Use Them

| Type | When | Do not use if |
|------|------|---------------|
| Unit | Isolated logic, pure functions, entities | Requires real I/O |
| Integration | Repositories, adapters, complete flows | Only tests one function |
| E2E | Critical business flows end-to-end | All cases — it's slow |

## Mocks and Stubs

- Mock ONLY external dependencies (DB, APIs, filesystem)
- Do not mock the system under test or its internal collaborators
- Prefer fakes (simple implementations) over complex mocks
- A test needing many mocks may indicate a tightly-coupled design

## Test Performance

- Unit tests: < 10ms per test
- Integration tests: < 1s per test
- If a test takes longer, mark it with `@slow` or equivalent
- Never use `sleep()` in tests — use fake timers or awaitable events

## Anti-patterns to Avoid

- ❌ Tests that depend on execution order
- ❌ Shared global state between tests without reset
- ❌ `describe.only` / `it.only` / `test.only` in committed code
- ❌ Tests that test the ORM/framework instead of business logic
- ❌ Assertions without descriptive messages in critical tests

## Coverage

- Do not chase 100% coverage at any cost — it is a metric, not a goal
- Prioritize coverage on: critical business logic, edge cases, error paths
- Branch coverage is more valuable than line coverage for complex logic
