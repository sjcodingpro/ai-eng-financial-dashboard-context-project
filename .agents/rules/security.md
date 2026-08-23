# Security Rules

- Never combine `allow_origins=["*"]` with `allow_credentials=True` in CORS
  config. If credentials are needed, list explicit allowed origins. If
  origins must stay wildcarded, set `allow_credentials=False`.
- Pin all dependency versions in `requirements.txt` and `package.json`
  (exact or `~=`/`^` ranges) — never leave a dependency unpinned.
- Never commit `.env` files or hardcoded secrets. Use `.env.example` to
  document required variables without real values.

## Why this rule exists
`backend/app/main.py` currently sets `allow_origins=["*"]` together with
`allow_credentials=True`, a known insecure CORS combination. Separately,
`backend/requirements.txt` lists dependencies with no version pins at all,
meaning a fresh install today could resolve entirely different (and
potentially breaking) package versions than what was tested against.
