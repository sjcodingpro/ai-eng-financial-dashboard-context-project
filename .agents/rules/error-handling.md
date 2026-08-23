# Error Handling Rules

- Never swallow caught errors silently. Every `.catch()` or `except` block
  must log the actual error (e.g. `console.error(err)` in TypeScript,
  `logging.exception(...)` in Python) before showing a user-facing message.
- User-facing error messages must stay generic and safe; the real error
  detail belongs in logs only, never in the UI.

## Why this rule exists
`frontend/src/App.tsx` currently discards the real fetch error in its
`.catch()` block and shows only a hardcoded message. If the backend ever
fails for a real reason (network issue, bad response shape, CORS
misconfiguration), there is currently no way to diagnose it from logs alone.
