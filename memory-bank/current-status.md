# Current Status

_Last verified against the codebase: 2026-08-23._

## Implemented Features

- Single-page financial dashboard (React SPA) showing 4 KPI cards (Total
  Income, Total Outcome, Profit, Profit Margin) and 2 line charts
  (Income vs. Outcome, Profit Margin % — both monthly, full year)
- FastAPI backend with 9 endpoints: `/health`, `/api/metrics`,
  `/api/metrics/facets`, `/api/metrics/summary`,
  `/api/metrics/categories/top`, `/api/metrics/comparison`,
  `/api/metrics/alerts`, `/api/metrics/b2b`, `/api/metrics/b2c`
- Reproducible mock financial data (360 seeded-random movements/year)
- Full test coverage on the backend (15 tests) and the frontend's pure
  utility functions (5 tests)
- Local dev environment fully containerized via Docker Compose, verified
  working end-to-end

## Known Gaps

- **8 of 9 backend endpoints are unused.** Only `/api/metrics` is called
  by the frontend. Filtering, summaries, comparisons, alerts, and B2B/B2C
  splits exist and are tested server-side but have no UI.
- **No filter controls in the UI**, despite the backend fully supporting
  date/category/operation-type filtering.
- **No CI pipeline** — tests exist but nothing runs them automatically on
  push or PR (see `.agents/rules/testing-and-ci.md`).
- **Unpinned backend dependencies** (see `.agents/rules/security.md`).
- **Permissive CORS configuration** (`allow_origins=["*"]` combined with
  `allow_credentials=True`) (see `.agents/rules/security.md`).
- **Silent error handling** in `App.tsx` — fetch failures are caught but
  never logged (see `.agents/rules/error-handling.md`).
- **Inconsistent quote style** across TypeScript files, no Prettier config
  (see `.agents/rules/code-style.md`).
- `frontend/src/lib/mock-data.ts` is dead code — a 60-record static dataset
  that is never imported anywhere in the app.

## Next Priorities

1. Add a CI workflow (GitHub Actions) running `pytest` and `vitest run` on
   every push/PR.
2. Pin backend dependency versions in `requirements.txt`.
3. Fix the CORS configuration (explicit origins, or drop credentials).
4. Fix silent error handling in `App.tsx` to log real errors.
5. Decide the fate of the 8 unused backend endpoints and `mock-data.ts`:
   either build UI to use them, or remove them to reduce maintenance
   surface.
6. Add a Prettier config and normalize quote style repo-wide.

These priorities map directly to the rules already documented in
`.agents/rules/`, so future contributors (human or AI) have both the
"what's wrong" (this file) and the "what to do about it" (the rules) in
one place.
