# Step 1 Mermaid Hotfix Report

## Scope

Emergency repair of the Fusion System Blocks Mermaid rendering defect and FIRST Full History heading hierarchy.

## Root Cause

The Fusion System Blocks page carried a raw `<div class="mermaid">` wrapper from the original Jekyll port. Jekyll rendered it with its own browser-side Mermaid script; Docusaurus never had Mermaid enabled, so the source rendered as visible body text. The duplicate FIRST-history H1 came from the Batch D page split: the script that removed the original `# *FIRST* Robotics Competition` heading matched `\n` line endings against a CRLF file, so the replacement silently failed.

## Docusaurus Mermaid Configuration

### Docusaurus Version

`@docusaurus/core` resolved at 3.10.1.

### Mermaid Theme Version

`@docusaurus/theme-mermaid` pinned exactly at 3.10.1 (official themes must match core; the initial mismatched install in Batch A history proved that). No other dependencies changed; React untouched.

### Configuration Changes

- `markdown.mermaid: true` added inside the existing `markdown` object (format `detect` and strict broken-markdown-link hooks preserved)
- `themes: ['@docusaurus/theme-mermaid', '@zcohen-nerd/brand']` — Mermaid theme first, brand second; build and visual test confirmed no ordering conflict with the brand's swizzled Navbar/Footer

## Fusion System Blocks

### Previous Markup

Raw `<div class="mermaid">flowchart LR …</div>` (rendered as plain text).

### Corrected Markup

Fenced ` ```mermaid ` block with direction changed `LR → TB`. Same six nodes, same five directed relationships, no wording changes. Rationale: the LR chain rendered 1448×70 — scaled into the ~800px content column it became ~39px tall with illegible labels, far worse on mobile. TB renders 236×590 and is readable at every width (the smallest allowed diagram-level adjustment; technical meaning unchanged).

### Render Result

Client-hydrated by the Docusaurus integration into `.docusaurus-mermaid-container` → SVG. Browser-verified: all six node labels, five `path.flowchart-link` edges, no raw source visible, no console errors.

## Regression Validation

### Source Checks

`scripts/validate-build.js` now fails if any file under `src/pages/` contains `<div class="mermaid"` (drafts/ exempt), and requires the Fusion source to contain a fenced ` ```mermaid ` block.

### Built-Output Checks

The Fusion page's HTML with `<script>` blocks stripped must not contain `flowchart` or `SYS[System Context]` (the raw-text failure mode). Rendering evidence is asserted from the real output structure: the diagram is client-hydrated (SSG emits a placeholder comment), so the validator requires the diagram definition in a built JS page chunk and the `docusaurus-mermaid-container` runtime in the theme bundle. Also new: `/frc/history/` must contain exactly one `<h1>` in built HTML, and the Surfer Fleet draft must remain present under `drafts/`.

### CI Integration

The deploy workflow already runs `node scripts/validate-build.js` after the build (added in Batch C) — the new assertions run in CI with no workflow changes.

## FIRST Full History

### Heading Change

`# *FIRST* Robotics Competition` → `## *FIRST* Robotics Competition`, kept as a sibling H2 alongside `## Event Manager & Leadership - *FIRST* Chesapeake` (the pair originally functioned as title+subtitle; each subsequent major section is an H2 with H3 children — one H1, no skipped levels). No copy changes.

### Built H1 Count

1 (validated in built HTML and by the new CI check).

## Surfer Fleet

### Draft Preservation

`drafts/projects/surfer-fleet/` intact (README + original source); new validator check pins this.

### Redirect Result

`/projects/surfer-fleet/` → `/projects/` via the existing client-redirects config; browser-verified, no draft text, no loop.

### Sitemap Result

No surfer-fleet entries (existing check, still passing).

## Build Result

`npm ci` + strict build clean; all validator assertions pass (including the six new ones).

## Browser Validation

Fusion diagram rendering, `/frc/history/` single H1 + content intact, Surfer redirect, `/projects/`, `/frc/` timeline, and homepage shared navigation all verified against the served production build; zero console errors. The browser pane could not composite pixels this session, so a human visual glance at the rendered diagram (colors/contrast) post-deploy is the one remaining check.

## Files Changed

`package.json`, `package-lock.json`, `docusaurus.config.js`, `src/pages/projects/fusion-system-blocks.md`, `src/pages/frc/history.md`, `scripts/validate-build.js`, `STEP_1_MERMAID_HOTFIX_REPORT.md`

## Remaining Manual Checks

- Visual confirmation of diagram contrast/theme on the live site after deploy

## Explicitly Deferred Work

- Surfer Fleet rewrite and relaunch
- Shared Projects-to-Ecosystem navigation rename
- Brand package publication and consumer migration
- Page-specific JSON-LD
- Fusion System Blocks factual rewrite
- SPARK factual rewrite
- ENT260 framing
- Teaching and Writing content improvements
- Remaining image optimization
