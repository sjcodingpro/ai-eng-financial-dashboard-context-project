# Engineering Practices Analysis (Phase 2)

_This analysis was performed before writing the rules in `.agents/rules`
(Phase 3). It is documented here as its own artifact to make the Phase 2
analysis step traceable and independently reviewable._

## Good Practices (5)

| # | Practice | Evidence |
|---|---|---|
| 1 | Pure, testable business logic | `computeKPIs()` / `computeMonthlyData()` in `financial-utils.ts` are side-effect-free and directly unit tested (`financial-utils.test.ts`, 5 tests) |
| 2 | Strong backend test coverage | 15 test functions in `test_routes.py`, covering all 9 endpoints plus filtering/date-edge logic |
| 3 | Type-consistent schema across the stack | Pydantic models + `Literal` types on the backend mirror TypeScript interfaces in `financial-types.ts` |
| 4 | Deliberately scoped `.gitignore` | Explicitly separates OS, Node, Python, and Docker artifact rules — not a generic template |
| 5 | Reproducible mock data via seeding | `generate_mock_movements(seed=42)` guarantees identical output every run, no database needed |

## Bad / Risky Practices (5)

| # | Practice | Evidence |
|---|---|---|
| 1 | Silent error swallowing | `App.tsx` line 35: `.catch(() => { setError(...) })` discards the real error, no logging |
| 2 | Insecure CORS configuration | `main.py`: `allow_origins=["*"]` + `allow_credentials=True` — known anti-pattern |
| 3 | Unpinned backend dependencies | `requirements.txt` lists packages with no version pins at all |
| 4 | No CI pipeline | No `.github/workflows` directory exists — 15 backend + 5 frontend tests never run automatically |
| 5 | Inconsistent quote style, unenforced | Mixed single/double quotes across `.ts`/`.tsx` files, no Prettier config to catch it |

## Grouped by Category

- **Testing:** ✅ pure functions tested, 15 backend tests exist / ⚠️ no CI to run them automatically
- **Security:** ⚠️ permissive CORS + credentials combo, ⚠️ unpinned dependencies
- **Architecture:** ✅ pure decoupled business logic, ✅ consistent typed schema across frontend/backend
- **Developer Experience:** ✅ seeded reproducible mock data / ⚠️ silent error swallowing
- **Code Style:** ⚠️ mixed quote conventions, no formatter enforcement
- **Documentation:** ✅ deliberately scoped `.gitignore` / ⚠️ (carried from Phase 1) `AGENTS.md` referenced directories that didn't exist yet

## Resulting Rule Set

This analysis directly produced the four rule files added in Phase 3:
`.agents/rules/error-handling.md`, `security.md`, `testing-and-ci.md`, and
`code-style.md`.
