# Contributing — Portfolio

## Prerequisites

- **Node 22** (`.nvmrc`; `engines` enforces `>=22`).
- `npm ci` to install.

## Local checks

Run `npm run <script>`:

| Script                    | What it checks                                                                                                                                                                                                                                                         | CI job (`.github/workflows/quality.yml`)    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `build`                   | Production build. Fails on broken **internal** links **and anchors** (`onBrokenLinks` / `onBrokenAnchors` / `onBrokenMarkdownLinks: 'throw'`).                                                                                                                         | `build`                                     |
| `format:check`            | Prettier, **only on files changed vs the PR base** (`scripts/changed-files.mjs`).                                                                                                                                                                                      | `format-lint`                               |
| `format`                  | Prettier **write** over the whole repo — the one-time baseline (see below).                                                                                                                                                                                            | —                                           |
| `lint`                    | ESLint (flat config, JS/JSX). `jsx-a11y` runs here as a fast static a11y check.                                                                                                                                                                                        | `format-lint`                               |
| `lint:md` / `lint:md:all` | markdownlint on changed Markdown / on everything.                                                                                                                                                                                                                      | `format-lint` / —                           |
| `validate`                | `scripts/validate-build.js` — canonical domain, sitemap, robots, duplicate IDs, single `<h1>`, status-vocabulary drift, per-page OG dimensions, Related-work rules, inline-media budgets, and ~120 page-content guards. **Needs `npm run build` first.**               | `validators`                                |
| `test:a11y`               | Playwright + `@axe-core/playwright` — WCAG 2.1 A/AA smoke on `/`, `/projects/`, the four flagship case studies, `/about/`, `/404.html`.                                                                                                                                | `a11y`                                      |
| `test:responsive`         | Playwright — no horizontal overflow, landmarks inside the viewport, tap targets, full-page screenshots at 360/390/768/1024/1440/1920 px, on `/`, `/projects/`, and a flagship.                                                                                         | `responsive`                                |
| `size`                    | `size-limit` — initial JS (gzip) ≤ 170 kB, initial CSS (gzip) ≤ 20 kB. **Needs `npm run build`.**                                                                                                                                                                      | `bundle-budget`                             |
| `bundle-report`           | `scripts/bundle-report.mjs` — payload sizes, route-chunk count, per-route LCP candidate, render-blocking `<head>` asset count, inline-media weight (mp4 excluded when a `.webm` sibling exists — matches the repo's prior 1200 kB rule); enforces `perf-budgets.json`. | `bundle-budget`                             |
| `links:external`          | linkinator over the served build — outbound URLs, retries, skip list for login-gated / bot-walled hosts (`linkinator.config.json`).                                                                                                                                    | `links-external.yml` (weekly, non-blocking) |
| `verify`                  | `format:check && lint && lint:md && validate`.                                                                                                                                                                                                                         | —                                           |

## The one-time Prettier baseline

`format:check` and the pre-commit hook only touch changed files. When the tree is
clean, land the full sweep as its own commit:

```bash
npm run format
git commit -am "chore: prettier baseline (no behaviour change)"
```

then record the SHA in `.git-blame-ignore-revs`.

## Pre-commit hook (opt-in)

```bash
git config core.hooksPath .githooks   # runs lint-staged on staged files
```

## CI gates

`.github/workflows/quality.yml` runs on every PR: one `build` job publishes the
`site` artifact, then `format-lint`, `validators`, `a11y`, `responsive`, and
`bundle-budget` fan out. Each uploads its report artifact.

`a11y` and `responsive` are **`continue-on-error` for now** — they run and publish
reports but do not block merges, until the acceptance-triage pass has fixed or
documented every current finding.

`.github/workflows/links-external.yml` runs weekly (and on demand) with
`--warn-only`. Deploy (`deploy.yml`) is unchanged.

## Adding images, PDFs, or other media

This repository ships publicly. Every non-code artifact is inventoried in
[`NOTICE.md`](./NOTICE.md) with its rights status, and the licenses are split
(see [`LICENSE.md`](./LICENSE.md)). Before adding any image, PDF, video, or audio
file:

1. **Establish provenance.** Who made it, from what, and when. Design outputs you
   authored (schematics, PCB renders, CAD, diagrams) are fine; photos of people,
   events, or institutional facilities need the photographer's permission and, if
   people are identifiable, their consent.
2. **Determine the rights status** and add a row to `NOTICE.md`:
   - Authored for this repo → CC BY-NC 4.0 (prose graphics) or MIT (generated
     build output).
   - Output of a separate project → "project repo governs"; link that repo.
   - Institutional / employer / third-party → not licensed here; reference for
     accuracy only.
   - Can't establish reuse authority → mark **"rights status requires owner
     confirmation"** and list it under the excluded section. Do **not** delete a
     useful piece of public evidence over an unresolved rights question — mark it
     and move on.
3. **Do not** relicense institutional or third-party material, and do not guess
   ownership.

A PR that adds media without a matching `NOTICE.md` row should not merge.

## Notes

- **Mermaid** (`@docusaurus/theme-mermaid`) is already async + route-gated — the
  730 kB mermaid chunk loads only on the two diagram pages, after paint, and
  never touches `main.*.js`. No change; see
  `docs/reports/bundle-investigation-2026-08.md`.
- **`scripts/validate-content.js`** (source-level front-matter / OG-dimension /
  Related-work checks) lands with the MDX-components remediation; it will be
  wired into `validate` and CI at that point.

## Deferred / known backlog

- **Acceptance triage** — run `test:a11y` / `test:responsive` against the
  consolidated remediated tree; fix each finding or add a narrowly-scoped,
  commented entry to `e2e/axe-exclusions.ts`.
- `@docusaurus/plugin-client-redirects` is a dependency but not wired into the
  config — recommend dropping it in a separate change.
- **Markdown backlog** — `lint:md:all` reports pre-existing `MD022/MD032/MD047`
  in `static/assets/images/README.md`; the `lint:md` gate is changed-scoped.
- Perf budgets sit ~15 % above the 2026-08 baseline; ratchet down after any
  optimisation.
