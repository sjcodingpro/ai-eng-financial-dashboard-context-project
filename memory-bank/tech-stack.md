# Tech Stack

_Documented from direct inspection of `package.json`, `requirements.txt`,
and Dockerfiles. Last verified: 2026-08-23._

## Frontend

| Technology | Version | Role |
|---|---|---|
| React | 19.2.4 | Component framework |
| TypeScript | ~6.0.2 | Type-checking across all `.ts`/`.tsx` files |
| Vite | 8.0.4 | Dev server, build tool, `/api` dev proxy |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| shadcn/ui | — | UI primitives (`card.tsx`, `skeleton.tsx`) |
| lucide-react | 1.8.0 | Icons |
| Recharts | 3.8.1 | Line charts (Income/Outcome, Profit %) |
| clsx / tailwind-merge / class-variance-authority | 2.1.1 / 3.5.0 / 0.7.1 | Class-merging utility chain (`cn()`) |
| Vitest | 4.1.4 | Unit test runner |
| ESLint | 9.x | Linting (no Prettier configured — see code-style rule) |

## Backend

| Technology | Version | Role |
|---|---|---|
| Python | 3.13 | Runtime (`python:3.13-slim` base image) |
| FastAPI | unpinned | Web framework, routing, auto-docs |
| Pydantic | (FastAPI dependency) | Request/response validation |
| Uvicorn | unpinned | ASGI server, run with `--reload` |
| debugpy | unpinned | Remote debugger on port 5678 |
| pytest / pytest-cov / httpx | unpinned | Test framework and HTTP client for `TestClient` |

**Note:** backend dependencies are currently unpinned in
`requirements.txt` — see `.agents/rules/security.md` for the rule this
should follow going forward.

## Infrastructure

| Technology | Role |
|---|---|
| Docker | Separate `Dockerfile` per service (frontend: Node 24 Alpine, backend: Python 3.13-slim) |
| Docker Compose | Orchestrates both services; frontend on 5173, backend on 8000 (+5678 for debugpy), bind-mounted volumes for live reload |

No database, no external APIs, no auth provider, no message queue — the
entire stack is self-contained and runs from `docker compose up --build`
alone.
