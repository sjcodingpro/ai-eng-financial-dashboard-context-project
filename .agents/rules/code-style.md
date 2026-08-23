# Code Style Rules

- Use double quotes consistently across all TypeScript/TSX files.
- Add and enforce a Prettier config (`.prettierrc`) so style is automated,
  not manually reviewed.
- Keep business logic (`lib/*.ts`) pure and framework-agnostic — no React
  imports, no side effects, so it stays independently testable.

## Why this rule exists
The codebase currently mixes single quotes (`financial-types.ts`,
`kpi-row.tsx`) and double quotes (`App.tsx`) with no Prettier config to
catch or standardize this. Small inconsistencies like this compound as more
contributors touch the codebase.
