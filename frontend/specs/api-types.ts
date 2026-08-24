/**
 * TypeScript interfaces for API responses consumed by the three specified
 * frontend features. Verified directly against the running backend's
 * /docs (OpenAPI/Swagger) on 2026-08-23 — not guessed from documentation
 * alone.
 */

// ---------------------------------------------------------------------
// GET /api/metrics/facets
// Used by: Feature 1 (date range reference), Feature 3 (available
// categories/business lines).
// ---------------------------------------------------------------------

/**
 * Response shape of GET /api/metrics/facets.
 * Confirmed via /docs: dates are returned as ISO date strings (YYYY-MM-DD),
 * not Date objects — this is a JSON API, so dates always arrive as string.
 */
export interface FacetsResponse {
  /** All operation_type values present in the dataset. */
  operation_types: ("income" | "outcome")[];
  /** All business_type values present in the dataset. */
  business_types: ("B2B" | "B2C")[];
  /** All category values present in the dataset. */
  categories: string[];
  /** Earliest date with data, inclusive. Format: YYYY-MM-DD. */
  min_date: string;
  /** Latest date with data, inclusive. Format: YYYY-MM-DD. */
  max_date: string;
}

// ---------------------------------------------------------------------
// GET /api/metrics/alerts
// Used by: Feature 2 (anomaly alerts table).
// ---------------------------------------------------------------------

/** A single row returned by GET /api/metrics/alerts. */
export interface AlertEntry {
  /** Period label, format depends on the group_by param sent (e.g. "2026-03" for month). */
  period: string;
  /** Total outcome (spending) recorded in this period. */
  outcome_total: number;
  /** Average outcome across the 3 periods immediately prior to this one. */
  baseline_average: number;
  /**
   * Ratio of increase over baseline_average, e.g. 0.42 means a 42% spike.
   * Only periods exceeding the requested `threshold` are included in the
   * response — the API itself performs this filtering server-side.
   */
  increase_ratio: number;
}

/** GET /api/metrics/alerts always returns an array — may be empty ([]). */
export type AlertsResponse = AlertEntry[];

// ---------------------------------------------------------------------
// GET /api/metrics/categories/top
// Used by: Feature 3 (B2B vs B2C top-5 category tables).
// ---------------------------------------------------------------------

/** A single row returned by GET /api/metrics/categories/top. */
export interface CategoryEntry {
  /** Category name (e.g. "sales", "suppliers"). */
  category: string;
  /** The operation_type this entry belongs to; matches the query param sent. */
  operation_type: "income" | "outcome";
  /**
   * Total amount for this category within the filtered range.
   * Note: the API does NOT return a percentage-of-total field — Feature 3
   * requires the frontend to compute that client-side from this array.
   */
  total_amount: number;
}

/** GET /api/metrics/categories/top always returns an array — may be empty ([]). */
export type TopCategoriesResponse = CategoryEntry[];
