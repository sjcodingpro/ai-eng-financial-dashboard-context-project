# Component Specifications

This document specifies the components required for the three feature
requests. It defines names, typed props, layout, and conditional
rendering rules — precise enough to implement without further questions.
No components are built here; this is a specification only.

---

## Feature 1 — DateRangeFilterBar

**Component:** `DateRangeFilterBar`

**Props:**
- `value: DateRangeFilter` — controlled state, the currently applied filter
- `onChange: (next: DateRangeFilter) => void` — fired when either date input changes
- `facets: FacetsResponse | null` — used for the "available range" hint text; `null` while facets are still loading

**Layout:** single row at the top of the home dashboard:
`[Start date input] [End date input] [Available range hint text]`

**Behavior rules:**
- Both inputs are plain HTML date inputs (`type="date"`), independently optional.
- **When both are empty:** no `start_date`/`end_date` params are sent to any endpoint; the dashboard shows all available data (matches current default behavior).
- **When only one is filled in:** the filter is NOT applied yet. Show an inline message next to the inputs: "Select both a start and end date to filter." No API calls include a partial date range.
- **When both are filled in:** apply `start_date`/`end_date` to every metrics call the home dashboard already makes (the existing `/api/metrics` call, plus the alerts table's call from Feature 2).
- **If `end_date` is before `start_date`:** show an inline validation message: "End date must be after start date." Do not send the request.

**Hint text:** rendered as:
`Data available from {facets.min_date} to {facets.max_date}`
While `facets` is `null` (still loading), render: `Loading available date range…`

---

## Feature 2 — OutcomeAlertsTable

**Component:** `OutcomeAlertsTable`

**Props:**
- `alerts: AlertEntry[]` — the rows to display
- `threshold: number` — the current threshold value (controlled)
- `onThresholdChange: (next: number) => void`
- `dateFilter: DateRangeFilter` — passed through from Feature 1's shared state; included in the `/api/metrics/alerts` call when both dates are set
- `loading: boolean`

**Layout:** rendered directly below the existing Income/Outcome and Profit charts on the home dashboard. Structure, top to bottom:
1. Section heading: "Spending Anomalies"
2. Threshold numeric input, labeled "Alert threshold" (constrained 0.01–1.0, default 0.3 — see `param-types.ts` note on why this is a UI-only constraint)
3. The table itself, or its empty state

**Table columns (in order):**
1. Period
2. Recorded Outcome (formatted as currency)
3. Rolling Average (previous 3 periods, formatted as currency)
4. % Increase (formatted as percentage, derived from `increase_ratio * 100`)

**Behavior rules:**
- **Empty state:** if `alerts.length === 0`, do not render the table element at all. Render an `EmptyState` component instead, with title `"No anomalies detected"` and body text: `"No periods exceeded the {threshold * 100}% spending threshold you set."` The section heading and threshold input remain visible above the empty state.
- **Invalid threshold input (below 0.01 or above 1.0):** clamp the value to the nearest valid bound on blur (e.g. typing 1.5 becomes 1.0 when the user leaves the field) and show a brief inline note: "Threshold must be between 0.01 and 1.0."
- **Loading state:** while `loading` is true, render a skeleton table (3 placeholder rows) instead of the empty state or real data — do not show the empty state message while a request is still in flight.

---

## Feature 3 — B2B vs B2C Comparison View

**Route:** new page, e.g. `/comparison` (exact path left to the app's routing convention; must be reachable from primary navigation).

**Component:** `BusinessComparisonView` (page-level container)

**Props:** none (top-level route component); manages its own `DateRangeFilter` state internally, seeded from the same shared filter as the home dashboard if the app has global filter state, or its own independent instance otherwise — **this spec chooses independent state per page** unless a global store is introduced.

### Sub-component: `TopCategoriesPanel`

**Props:**
- `businessType: "B2B" | "B2C"`
- `categories: CategoryEntry[]`
- `dateFilter: DateRangeFilter`
- `loading: boolean`

**Layout:** one panel per business line, rendered side by side (two columns on desktop, stacked on mobile). Each panel:
1. Heading: `"B2B — Top Income Categories"` or `"B2C — Top Income Categories"`
2. Table with columns: Category, Total Income (currency), % of Group Total

**% of Group Total calculation:** the API does not return this value (confirmed in `api-types.ts`). The frontend must compute it as:
`(entry.total_amount / sum(all entries' total_amount in this panel)) * 100`

**Empty state:** if `categories.length === 0` for a given panel, render `EmptyState` with title `"No income categories found"` and body: `"No income data available for this business line in the selected date range."` Each panel handles its own empty state independently — one panel being empty does not affect the other.

### Sub-component: `BusinessComparisonChart`

**Props:**
- `b2bTotal: number`
- `b2cTotal: number`
- `loading: boolean`

**Layout:** single chart below both panels, comparing total income between B2B and B2C.

**Aggregation rule (must be a single, explicit rule):** `b2bTotal` and `b2cTotal` are each computed as the sum of `total_amount` across that panel's already-fetched top-5 `CategoryEntry[]` array — **not** a separate API call. This means the chart reflects only the top 5 income categories per line, not all income; this spec explicitly accepts that scope limitation rather than issuing a 4th API call for a true grand total.

**Empty state:** if both `b2bTotal` and `b2cTotal` are 0, render `EmptyState` with title `"No data to compare"` instead of an empty/blank chart.
