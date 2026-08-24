# Frontend Specs — Data Contract Documentation

This document specifies the data contract for three frontend features on
the Financial Metrics Dashboard. It is a specification only — no React
components, hooks, or API calls are implemented here. Endpoint shapes were
verified directly against the running backend's `/docs` (OpenAPI/Swagger)
on 2026-08-23, not assumed from the feature request alone.

Related files in this folder:
- `api-types.ts` — response interfaces
- `param-types.ts` — request parameter types
- `components.md` — component breakdown, props, and layout

---

## Feature 1 — Date Range Filter

**Endpoint(s):**
- `GET /api/metrics/facets` — called once on mount to retrieve the
  available date range for the hint text.
- The existing `/api/metrics` call already made by the home dashboard,
  extended with `start_date`/`end_date` query params when both are set.

**Types:** `FacetsResponse` (`api-types.ts`), `DateRangeFilter` (`param-types.ts`)

**Parameters:**
- `start_date`, `end_date` — both optional, `string`, format `YYYY-MM-DD`.
  Confirmed via `/docs`: these accept `string | null`, so omitting the key
  entirely is the correct way to represent "unset," not sending an empty
  string.

**Edge cases:**
1. **Both dates empty:** no date params sent; dashboard shows all data
   (existing default behavior, unchanged).
2. **Only one date filled in:** filter is NOT applied. UI shows inline
   message: "Select both a start and end date to filter." No request
   includes a partial range.
3. **`end_date` before `start_date`:** UI blocks the request and shows:
   "End date must be after start date."

---

## Feature 2 — Anomaly Alerts Table

**Endpoint(s):** `GET /api/metrics/alerts`

**Types:** `AlertEntry`, `AlertsResponse` (`api-types.ts`); `AlertsParams`
(`param-types.ts`)

**Parameters:**
- `threshold`: `number`. API enforces only `>= 0` (confirmed via `/docs`
  — no upper bound is enforced server-side). This spec constrains the UI
  input to `[0.01, 1.0]`, default `0.3`, as a **frontend-only** rule.
- `group_by`: `"day" | "week" | "month"`, default `"month"` — not exposed
  in the UI for this feature; sent as a fixed default.
- `start_date`, `end_date`: optional, reused from Feature 1's
  `DateRangeFilter`; included only when both are set (see Feature 1, edge
  case 2).
- `business_type`: optional, not used by this feature as specified.

**Edge cases:**
1. **Empty array response:** table is not rendered; an explicit
   `EmptyState` is shown instead ("No anomalies detected" + threshold
   context), per `components.md`.
2. **Threshold input out of the UI-enforced range:** value is clamped to
   the nearest bound (0.01 or 1.0) on blur, with an inline note.
3. **Active date range with no data in it:** treated identically to case 1
   — the same empty state is shown, since the API returns `[]` either way
   and the frontend cannot distinguish "no anomalies" from "no data in
   range" without an additional request this spec does not require.

---

## Feature 3 — B2B vs B2C Comparison View

**Endpoint(s):**
- `GET /api/metrics/categories/top` — called twice, once per business
  line (`business_type=B2B` and `business_type=B2C`), each with
  `operation_type=income&limit=5`.
- `GET /api/metrics/facets` — used only for validating/displaying
  available categories or business lines if the UI needs that context;
  not required for the core comparison to function.

**Types:** `CategoryEntry`, `TopCategoriesResponse` (`api-types.ts`);
`TopCategoriesParams` (`param-types.ts`)

**Parameters (per call):**
- `operation_type`: fixed to `"income"` for this feature.
- `limit`: fixed to `5`.
- `business_type`: `"B2B"` or `"B2C"` — determines which panel the
  response populates.
- `start_date`, `end_date`: optional, reused `DateRangeFilter`, applied
  identically to both calls so both panels reflect the same period.

**Derived values (not returned by the API):**
- **% of group total** per category: computed client-side as
  `(entry.total_amount / sum(panel total_amounts)) * 100`.
- **Comparison chart totals:** `b2bTotal`/`b2cTotal` are each the sum of
  that panel's already-fetched top-5 `total_amount` values — a single,
  explicit rule, not a separate aggregate API call. This means the
  chart reflects only the top 5 categories per line, not true total
  income; this is an accepted scope limitation, not an oversight.

**Edge cases:**
1. **One panel's `categories` array is empty:** that panel alone shows
   `EmptyState` ("No income categories found..."); the other panel
   renders normally if it has data. The two panels are independent.
2. **Both panels empty (both totals are 0):** the comparison chart shows
   its own `EmptyState` ("No data to compare") instead of rendering an
   empty/blank chart.

---

## Reviewer Checklist

- [ ] `npx tsc --noEmit` passes with no errors, no `any`, no bare `object`
- [ ] Every interface property has a JSDoc comment
- [ ] All three endpoint response shapes match `/docs` exactly
- [ ] Both `AlertsParams` and `TopCategoriesParams` extend `DateRangeFilter`
- [ ] At least 2 edge cases documented per feature (see above — each has 2–3)
- [ ] Commits on `feature/frontend-specs` are separated by concern (types → components → contract docs)
