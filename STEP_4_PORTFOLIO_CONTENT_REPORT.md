# Step 4 Portfolio Content Report

## Scope

Teaching-index completion and Writing & Research content completion.

## Branch Base

`portfolio-step-4-content-completion` from `main` @ `1916a61` (Step 3 merged via PR #19).

## Teaching Index

- **Section naming:** "Current Courses & Modules" → "Teaching & Curriculum Projects" (one open curriculum + one proposed college-course redesign; neither implied to be a current course lineup).
- **Literacy card:** now describes the actual project — free, open, 18-week computer-literacy curriculum for ages 8–12 with an optional CAD extension (canonical facts from Step 3).
- **ENT260 card:** proposal status explicit; description matches the Step 3 page framing.
- **Distinct copy:** the shared generic "Course materials, learning objectives…" sentence is gone from both cards.
- **Image dimensions:** measured, not guessed — literacy hero 800×533 (the Batch A conversion output), ENT260 1280×853 (the Batch D WebP output); lazy loading and alt text preserved.

## Teaching Scope & Outcomes

Replaced the metric-free "Impact & Metrics" with four verified facts: AACC adjunct instruction (résumé), the historically-qualified ~75% CSWA outcome in prior ENT260 offerings (résumé wording, explicitly not the proposal), the 18-week + CAD-extension Literacy scope (canonical site), and SENTRY's 100+ students/year USNA deployment (Step 3 wording). The Professional Development section was trimmed to remove the now-duplicated adjunct bullet.

## Substack Audit

Source: public RSS feed (`/feed`), 4 items, summaries taken from official subtitles.

| Essay | Published date | Canonical URL |
|---|---|---|
| Functional Success vs Engineering Success | July 22, 2026 | zcohennerd.substack.com/p/functional-success-vs-engineering |
| How Living Documentation Changes Engineering Culture | July 22, 2026 | zcohennerd.substack.com/p/how-living-documentation-changes |
| How to Build a Living Documentation System | July 22, 2026 | zcohennerd.substack.com/p/how-to-build-a-living-documentation |
| Why Every Engineer Should Document Like a Teacher | February 24, 2026 | zcohennerd.substack.com/p/why-every-engineer-should-document |

## Selected Essays

All four published essays listed newest-first with dates, subtitle-based one-line summaries, and canonical post links; closing "View all writing on Substack →" CTA. Cadence stays "occasional" ("published periodically" tightened to "published occasionally"); frontmatter description corrected — the old one promised requirements-engineering/risk-management content the page never had. Static snapshot only; no build-time RSS fetching.

## Writing & Research

"How These Resources Fit Together" (promising systems-engineering methods, **templates, and governance models**, plus the unsupported "measurable impact and repeatability" claim) → "What You'll Find Here" describing exactly the two real collections, each linked. Frontmatter description matched. Routes unchanged.

## Automated Validation

16 new assertions: teaching section rename + no empty metrics heading, distinct cards, literacy/proposed wording, AACC + historical CSWA, ≥1 essay with canonical URLs and dates, occasional/no-six-weeks/no-LinkedIn on essays, no governance/measurable-impact promises, both collection links. Full suite (~85 checks incl. Steps 1–3) passes.

## Build / Browser Validation

Strict build clean; browser-verified: renamed section, two distinct cards with explicit dimensions, AACC + historical CSWA on the page, 4 essays with 4 dates, occasional cadence, honest index sections. Zero console errors.

## Files Changed

`src/pages/teaching/index.md`, `src/pages/documentation/selected-essays.md`, `src/pages/documentation/index.md`, `scripts/validate-build.js`, this report.

## Unresolved Content Questions

- Three of four essays share a publication date (July 22, 2026) — if any were backdated imports, say so and I'll adjust the dates to match the canonical posts.

## Explicitly Deferred Work

- Hub résumé and Current Focus work, tracked in the Hub Step 4 branch
- Brand npm publication and dependency migration
- Remaining SENTRY raster conversion
- Asset filename cleanup
- Per-project Open Graph images
- FIRST photography
- Surfer Fleet rewrite and relaunch
