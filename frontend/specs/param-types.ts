/**
 * TypeScript types for the query parameters sent to the API by the three
 * specified frontend features. Verified directly against the running
 * backend's /docs on 2026-08-23.
 */

// ---------------------------------------------------------------------
// Shared across Features 1, 2, and 3
// ---------------------------------------------------------------------

/**
 * Optional date range filter shared by all three features.
 * Both fields are optional and independent — see frontend/specs/README.md
 * for the explicit rule on what happens when only one is filled in.
 *
 * IMPORTANT: only include the keys the user has actually set in the
 * outgoing query string. Do not send empty-string values — omit the key
 * entirely when a field is unset, since the backend treats an absent
 * param differently from an empty string.
 */
export interface DateRangeFilter {
  /** Inclusive start date. Format: YYYY-MM-DD. */
  start_date?: string;
  /** Inclusive end date. Format: YYYY-MM-DD. */
  end_date?: string;
}

// ---------------------------------------------------------------------
// Feature 2 — Anomaly alerts table
// ---------------------------------------------------------------------

/**
 * Query parameters for GET /api/metrics/alerts.
 *
 * NOTE ON THRESHOLD RANGE: the backend only enforces `threshold >= 0`
 * (confirmed via /docs — no upper bound is enforced server-side). The
 * 0.01–1.0 range described in the feature request is a UI-level
 * constraint this spec chooses to enforce in the input control itself,
 * not something the API guarantees or validates beyond >= 0.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Spike threshold as a ratio. UI must constrain input to [0.01, 1.0];
   * default 0.3. Values below 0 will be rejected by the API with a 422.
   */
  threshold: number;
  /**
   * Grouping granularity for periods. Feature 2 does not expose this in
   * the UI; default to "month" to match the dashboard's existing
   * monthly view.
   */
  group_by?: "day" | "week" | "month";
  /** Optional business line filter. Not used by Feature 2 as specified. */
  business_type?: "B2B" | "B2C";
}

// ---------------------------------------------------------------------
// Feature 3 — B2B vs B2C comparison view
// ---------------------------------------------------------------------

/**
 * Query parameters for GET /api/metrics/categories/top.
 * One call is made per business line (B2B and B2C) to populate each
 * side of the comparison view.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Feature 3 always requests "income" categories. */
  operation_type: "income" | "outcome";
  /** Feature 3 always requests 5. API allows 1–20 (confirmed via /docs). */
  limit: number;
  /** Required for Feature 3 — one call per business line. */
  business_type: "B2B" | "B2C";
}
