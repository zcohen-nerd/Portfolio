# Bundle investigation — Mermaid & route loading (2026-08)

Task 8 of the quality-gate hardening pass: check how `@docusaurus/theme-mermaid`
and the Docusaurus route chunks load, and decide — **on bundle evidence only** —
whether anything can be removed or deferred without breaking a page. No framework
migration.

## Method

- Direct inspection of `build/assets/js/*.js` (raw + gzip per chunk, library
  signatures via grep).
- `npx docusaurus build --bundle-analyzer` (webpack-bundle-analyzer, bundled with
  Docusaurus — no new dependency).
- Compared the `<script>` tags in the initial HTML of a diagram page
  (`/projects/surfer-fleet/`) vs a non-diagram page (`/`).

## Findings

### Mermaid is already optimally code-split — keep it

| chunk       | contents                           |     raw |    gzip | how it loads                                                                                            |
| ----------- | ---------------------------------- | ------: | ------: | ------------------------------------------------------------------------------------------------------- |
| `main.*.js` | Docusaurus + React + theme runtime | ~518 KB | ~145 KB | `<script defer>` in every page's `<head>`                                                               |
| `3923.*.js` | **mermaid** (+ dagre, d3)          | ~730 KB | ~179 KB | webpack lazy `import()` — fetched **after hydration, only on pages that render a ` ```mermaid ` fence** |

- The mermaid **library is not in `main.*.js`.** The only "mermaid" strings in
  the initial chunk are the `@theme/Mermaid` module id and the
  `docusaurus-mermaid-container` class name — the loader, not the payload.
- The initial HTML of `/projects/surfer-fleet/` (a diagram page) references the
  same two scripts as `/` (`runtime~main`, `main`). The 730 KB mermaid chunk is
  pulled by `@theme/Mermaid`'s dynamic import when the component mounts, so it
  **never blocks first paint** and **never loads on the 15 non-diagram routes**.
- Only two published pages contain a mermaid fence:
  `src/pages/projects/surfer-fleet.mdx` and
  `src/pages/projects/fusion-system-blocks.mdx`.

**Decision: no change.** Removing or "deferring" `@docusaurus/theme-mermaid`
would yield **zero** initial-bundle improvement (it is already async and
route-gated) and would break both diagram pages. This is the exact case task 8
says to leave alone.

### Route chunking is healthy

99–88 JS chunks, ~4.1 MB raw / ~1.1 MB gzip **in total across the whole site**,
but any single route ships only `runtime~main` + `main` + its own small route
chunk (+ the mermaid chunk on the two diagram pages). `common.*.js` (~663 KB) and
`165.*.js` (~423 KB) are the next largest and are shared vendor/route code split
out by webpack's default `splitChunks` — normal for a Docusaurus site this size.
`size-limit` (`.size-limit.json`) now guards the two figures that reach every
visitor: initial JS gzip ≤ 170 KB (currently ~148 KB) and initial CSS gzip ≤
20 KB (currently ~16 KB).

### One safe, evidence-based trim — recommended, not done here

`@docusaurus/plugin-client-redirects@3.10.2` is in `dependencies` but **not wired
into `docusaurus.config.js`** (no `plugins` entry, no reference anywhere in
`src/`). With no plugin entry it generates nothing, so it contributes 0 bytes to
`build/` — but it still sits in the dependency and `npm audit` surface.

**Recommendation:** drop `@docusaurus/plugin-client-redirects` from
`package.json` `dependencies` in a separate, focused change (or wire it up if
redirects are actually wanted). Left out of the quality-gate branch to keep that
diff reviewable.

## No action items for the build itself

The bundle is not the problem the 2026-08 audit was worried about. The gates now
in place (`size-limit`, `scripts/bundle-report.mjs`, `perf-budgets.json`) will
catch a regression — e.g. mermaid accidentally being pulled into `main`, or a new
render-blocking `<head>` asset — on the next PR.
