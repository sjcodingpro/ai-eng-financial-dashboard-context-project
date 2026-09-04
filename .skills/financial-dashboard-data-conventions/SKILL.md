---
name: financial-dashboard-data-conventions
description: Enforces this project's established patterns for displaying financial data — currency/percentage formatting, KPI variant colors, and loading states — so new components stay consistent with the existing dashboard. Use when adding new metrics, cards, or charts to this financial dashboard.
license: MIT
---

# Financial Dashboard Data Conventions

## Objective
New UI that displays financial data (amounts, percentages, or aggregated
metrics) must match the formatting, color-variant, and loading-state
conventions already established in `frontend/src/lib/financial-utils.ts`
and `frontend/src/components/dashboard/`, instead of introducing ad-hoc
formatting or one-off loading UI.

## Inputs
- A new component, chart, or KPI card displaying a monetary amount,
  percentage, or aggregated financial metric.
- Existing utilities: `formatCurrency()` and `formatPercent()` in
  `financial-utils.ts`.
- Existing `KPICard` variant system (`income | outcome | profit |
  profitPercent`) and its CSS custom properties (`--income-badge`,
  `--outcome-badge`, etc.) in `index.css`.

## Rules
1. **Never format currency or percentages manually.** Always call
   `formatCurrency(value)` or `formatPercent(value)`. Do not write inline
   `.toFixed()`, `Intl.NumberFormat`, or string concatenation with `$`/`%`
   anywhere else in the codebase.
2. **Reuse the existing color-variant system for financial polarity.**
   Income-type values use the `income` variant, outcome/expense values use
   `outcome`, net/profit values use `profit`. Do not invent new ad-hoc
   colors for "positive/negative" — extend `variantStyles` in
   `kpi-card.tsx` if a genuinely new category is needed.
3. **Every new data-driven component must accept a `loading: boolean`
   prop and render a `Skeleton`-based placeholder matching its own final
   layout dimensions** — the same pattern already used by `KPICard`,
   `IncomeOutcomeChart`, and `ProfitPercentChart`. Never a spinner, blank
   space, or text-only "Loading…" state.
4. **Every new chart must include a visually-hidden (`sr-only`) text
   summary** of what it shows, following the precedent already set in
   `income-outcome-chart.tsx` and `profit-percent-chart.tsx`.

## Expected Output
A new component that:
- Uses `formatCurrency`/`formatPercent` for all displayed numeric values.
- Uses the established color-variant system for financial polarity.
- Accepts a `loading` prop with a matching skeleton state.
- Includes an `sr-only` description if it renders a chart.

## Acceptance Criteria
- [ ] No inline number formatting exists outside `financial-utils.ts`.
- [ ] No new CSS color values were introduced for income/outcome/profit
      semantics; existing CSS variables were reused or extended.
- [ ] The component accepts and correctly handles a `loading` prop with a
      skeleton matching its real layout.
- [ ] If the component is a chart, it includes an `sr-only` summary.
- [ ] `npx tsc --noEmit` still passes with no errors.
