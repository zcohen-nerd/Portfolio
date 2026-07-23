# Step 2 — Portfolio Ecosystem Validation

Validates distinct Projects / Ecosystem navigation against the shared brand's Step 2 changes, using the existing `file:` workflow (no dependency migration, no npm publication). Based on main with the Step 1 Mermaid hotfix already merged; all Step 1 validator assertions preserved.

## Validator additions (`scripts/validate-build.js`)

- Internal `Projects` link must exist and target `/projects/`
- Ecosystem disclosure trigger (button bound to `zc-project-disclosure`): text starts with "Ecosystem", old "Projects" trigger absent — structural, no global string ban
- Disclosure links server-rendered raised to ≥8
- `/projects/fusion-system-blocks/` must continue to show "Public Beta"
- Existing unique-ID and Step 1 Mermaid checks unchanged

## Results

Strict build ✅ · full validator suite ✅ · browser check ✅ — desktop nav renders `Projects · FIRST Robotics · Teaching · Writing & Research · Ecosystem ▾`, disclosure opens with both groups and current-property highlighting, zero console errors, no duplicate IDs.

Merge after the brand Step 2 PR — CI builds against brand main.
