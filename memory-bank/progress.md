# Progress Log — Agent Skills Session

## Skills applied

### 1. `addyosmani/web-quality-skills@accessibility`
- Added a "Skip to main content" link (WCAG 2.4.1), manually verified via
  keyboard Tab navigation.
- Added `role="alert"` to the fetch-error banner so screen readers announce
  it (WCAG 3.3.1/3.3.3, 4.1.3).
- Added `sr-only` text summaries to both charts, since their SVG content is
  otherwise invisible to screen readers (WCAG 1.1).
- One finding was investigated and correctly ruled out: `lucide-react`
  icons already set `aria-hidden="true"` by default (confirmed by reading
  the installed library's source), so no icon-labeling fix was needed.

### 2. `vercel-labs/agent-skills@vercel-react-best-practices`
- This skill assumes Next.js (RSC, `next/dynamic`, `next/image`); most of
  its 70 rules don't apply to this Vite SPA and were explicitly skipped
  rather than force-fit.
- Combined two separate `.filter().reduce()` passes in `computeKPIs()`
  into a single loop (`js-combine-iterations`).
- Lazy-loaded both chart components using `React.lazy` + `Suspense` (the
  Vite equivalent of the skill's `next/dynamic` guidance,
  `bundle-dynamic-imports`), reusing the charts' existing skeleton as the
  Suspense fallback to avoid layout shift.
  - **Before:** one 585.01 kB bundle, with a build warning.
  - **After:** main bundle dropped to 188.09 kB; Recharts and both chart
    components split into their own lazy-loaded chunks. No more
    chunk-size warning.

### 3. Ecosystem exploration — `anthropics/skills@webapp-testing`
- Chosen because this session's verification was entirely manual
  (Tab-key tests, eyeballing chart renders); this skill's
  reconnaissance-then-action Playwright pattern would make that
  repeatable.
- Installation of Playwright hit a real environment blocker: this
  machine's Python 3.14 is incompatible with Playwright's `greenlet`
  dependency (confirmed via the actual C compiler error, not assumed).
  Verification was instead performed manually, following the same
  pattern the skill describes.
- Full justification: `memory-bank/skills-ecosystem-exploration.md`.

### 4. Custom skill authored — `.skills/financial-dashboard-data-conventions`
- Documents this project's real, existing conventions (currency/percent
  formatting via `financial-utils.ts`, the KPI color-variant system,
  skeleton-based loading states, `sr-only` chart summaries) so future
  contributions — human or AI — stay consistent instead of reinventing
  formatting or loading UI per component.

## What was NOT changed
Per the assignment's constraint, no full rebuild or unrelated refactor was
performed. Every change above is traceable to a specific skill rule, and
where a skill's guidance didn't apply to this stack, that was documented
rather than forced.
