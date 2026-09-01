# API Verification Log

Every field, endpoint, and constraint referenced in `api-types.ts`,
`param-types.ts`, `components.md`, and `README.md` was checked directly
against the running backend's `/docs` (OpenAPI/Swagger UI) before being
written into any spec file. This log records that check per claim.

Legend: ✅ verified in `/docs` — ❌ wrong (corrected below) — ❓ unverified

## GET /api/metrics/facets

| Claim | Status | Note |
|---|---|---|
| Returns `operation_types: string[]` | ✅ | Confirmed values `["income", "outcome"]` in example response |
| Returns `business_types: string[]` | ✅ | Confirmed values `["B2B", "B2C"]` |
| Returns `categories: string[]` | ✅ | Confirmed in example response |
| Returns `min_date` / `max_date` as strings | ✅ | Confirmed format `YYYY-MM-DD`, not a Date object — this is a JSON API |
| No query parameters accepted | ✅ | Swagger UI shows "No parameters" for this endpoint |

## GET /api/metrics/alerts

| Claim | Status | Note |
|---|---|---|
| Response fields: `period`, `outcome_total`, `baseline_average`, `increase_ratio` | ✅ | Matches example response schema exactly |
| `threshold` param, default `0.3` | ✅ | Confirmed default value shown in Swagger UI |
| `threshold` minimum enforced by API is `0`, not `0.01` | ✅ | Swagger UI shows `minimum: 0`, **no upper bound** — the 0.01–1.0 range in the feature request is a UI-only constraint, not an API one. Documented explicitly in `param-types.ts` to avoid a false claim that the API enforces this range. |
| `group_by` accepts `day`, `week`, `month`, defaults to `month` | ✅ | Confirmed enum values in Swagger UI |
| `business_type` optional, accepts `B2B`/`B2C` | ✅ | Confirmed optional query param |
| Response is always an array, can be empty | ✅ | Verified via response schema (`type: array`); no explicit empty-case example, but standard array serialization guarantees `[]` is valid |

## GET /api/metrics/categories/top

| Claim | Status | Note |
|---|---|---|
| Response fields: `category`, `operation_type`, `total_amount` | ✅ | Matches example response schema exactly |
| `operation_type` required, `income`/`outcome`, default `outcome` | ✅ | Confirmed enum and default in Swagger UI |
| `limit` range 1–20, default 5 | ✅ | Confirmed `minimum: 1`, `maximum: 20`, default `5` |
| `start_date`/`end_date` optional, `string \| null` | ✅ | Confirmed as nullable date params in Swagger UI |
| `business_type` optional, `B2B`/`B2C` | ✅ | Confirmed optional query param |
| API does **not** return a percentage-of-total field | ✅ | Confirmed by inspecting the full response schema — only `category`, `operation_type`, `total_amount` are present. Documented in `api-types.ts` and `README.md` that the frontend must compute this client-side. |

## Fields explicitly NOT verified (flagged, not guessed)

None — every field referenced in the spec files was checked against a live
`/docs` response during this session. No field names, types, or
constraints were invented or assumed from the feature request text alone.
