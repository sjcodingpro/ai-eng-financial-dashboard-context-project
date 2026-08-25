# Skills Ecosystem Exploration

## Topics searched
- `npx skills find typescript` — mostly Next.js-specific or advanced-type
  patterns not needed here (this project's types already pass `tsc --noEmit`
  cleanly with no `any`).
- `npx skills find testing` — surfaced `anthropics/skills@webapp-testing`
  (141.1K installs, official Anthropic source).

## Skill chosen: `anthropics/skills@webapp-testing`

**Justification:** throughout this session, every fix (skip link, lazy-loaded
charts) required manually opening the browser, pressing Tab, and eyeballing
whether things worked. This skill teaches a repeatable
reconnaissance-then-action pattern (navigate → wait for `networkidle` →
inspect rendered DOM → act) using Playwright, which would make that
verification automated and repeatable instead of manual and easy to skip in
future sessions. Directly relevant to a demonstrated gap in this project's
own workflow, not chosen for its install count alone.

## Application attempt and outcome

Installed cleanly (`Safe`, 0 alerts, Low Risk). Attempted to install
Playwright locally to write an automated test script following the skill's
own pattern (verifying the skip link, `#main-content` landmark, both
rendered charts, and the KPI section).

**Blocked by a real environment incompatibility, not a project issue:**
this machine runs Python 3.14, and Playwright's `greenlet` dependency (a C
extension) fails to compile against Python 3.14's internal frame structure
changes — confirmed via the actual compiler error (`incomplete type
'_PyInterpreterFrame'`), not a guess. Downgrading Playwright to an older
version hit the same wall, since `greenlet` itself needs updating to
support 3.14, not just Playwright.

**What we did instead:** applied the skill's own reconnaissance-then-action
methodology manually — navigating to `localhost:5173`, using the keyboard
(Tab) to verify the skip link, and visually confirming both charts render
correctly after the lazy-loading change. Same verification pattern the
skill describes, executed by hand rather than scripted.

**Value of the skill going forward:** on a machine with a compatible Python
version (or inside the project's own Docker container, which could have
its own pinned Python version), this skill would let that same manual
verification be automated and run consistently across sessions.
