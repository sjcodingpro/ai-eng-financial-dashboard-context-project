# Testing & CI Rules

- Every new pure function (business logic with no side effects) must ship
  with a unit test in the same PR.
- Every new API endpoint must have at least one integration test covering
  its success path and one covering an edge case (empty result, invalid
  filter, etc.).
- A CI workflow (e.g. GitHub Actions) must run the full test suite
  (`pytest` for backend, `vitest run` for frontend) on every push/PR before
  merge is allowed.

## Why this rule exists
The repository already has strong test coverage (15 backend tests, 5
frontend tests), but nothing currently runs them automatically — there is no
`.github/workflows` directory. Tests only run if a contributor remembers to
run them manually, which means a broken change could be merged without
anyone noticing.
