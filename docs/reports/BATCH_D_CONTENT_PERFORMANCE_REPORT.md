# Portfolio Batch D Content and Performance Report

## Scope

Media optimization, SENTRY V3/V4 separation, FIRST Robotics restructure, project-section audit, and index-promise accuracy. Executed stacked on the Batch C branch per Zac's "Option 2/stacked" decision (npm publish still pending).

## Performance Baseline

| Asset | Original size | Route | Notes |
|---|---:|---|---|
| SENTRY Reveal.gif | 5,283 KB | /projects/ + /projects/sentry-v3/ | animated GIF, 412×232, 12s |
| ent-260.png | 2,651 KB | /teaching/ ×2 | 1536×1024 |
| selected-essays.png | 2,279 KB | /documentation/ ×2 | 1536×1024 |
| documentation-scholarship.png | 1,869 KB | /documentation/ ×2 | 1671×940 |
| zachary-cohen-headshot.jpg | 1,798 KB | (unreferenced) | source for hub copy |
| hero-image.png | 1,484 KB | / + /documentation/ | 1536×808 |
| spark-board-perspective.png | 562 KB | /projects/ ×2 | 1046×697 |
| SENTRY PCB Labeled.png | 525 KB | /projects/sentry-v3/ | 2179×1759 labeled diagram |

Homepage build: 21 KB HTML, 637 KB total JS, 88 KB total CSS. No Lighthouse tooling existed; none was added (per spec) — byte measurements only.

## Media Optimizations

| Asset | Before | After | Reduction |
|---|---:|---:|---:|
| SENTRY animation (GIF → WebM) | 5,283 KB | 244 KB (+253 KB MP4 fallback, 11 KB poster) | −95.4% |
| hero-image (PNG → WebP) | 1,484 KB | 49 KB | −96.7% |
| ent-260 (PNG → WebP @1280) | 2,651 KB | 66 KB | −97.5% |
| selected-essays (PNG → WebP @1280) | 2,279 KB | 90 KB | −96.1% |
| documentation-scholarship (PNG → WebP @1280) | 1,869 KB | 67 KB | −96.4% |
| spark-board-perspective (PNG → WebP) | 562 KB | 61 KB | −89.1% |
| SENTRY PCB labeled (PNG → WebP, full res) | 525 KB | 273 KB | −48.0% (kept 2179px for label legibility) |
| headshot | 1,798 KB | removed from public build | −100% (was unreferenced) |

Total for the >500 KB set: **16,451 KB → ~861 KB** of served assets (WebM path) — a ~95% reduction. All originals preserved in `source-assets/` (not served; see its README). Regeneration commands: ffmpeg VP9 `-crf 36`, x264 `-crf 25 -preset slow +faststart`, libwebp `-quality 80–90`.

Video markup: semantic `<video autoplay muted loop playsinline preload="metadata">` with WebM+MP4 sources, poster, explicit 412×232 dimensions (no CLS), and a text caption. `src/clientModules/reduced-motion.js` strips autoplay and adds controls for `prefers-reduced-motion` users so they see the poster. The projects-index card uses the static poster image, not the video.

## SENTRY V3 Result

Page now ends at shipped work: the ~180-line V4 roadmap block was replaced by a short "What comes next" section linking to the roadmap. A **Testing & Verification** section was added using only documented evidence (bench bring-up via logic analysis/current monitoring — previously an Implementation bullet — plus the verified current-spike shot detection and ongoing classroom use). Batch B status/dates unchanged (Deployed | 2023–2025).

## SENTRY V4 Roadmap Result

New `/projects/sentry-v4/` (status: **Concept**) with the required disclaimer at top, organized into Overview / Goals / Lessons carried forward / Proposed architecture / Planned hardware changes / Planned software and controls changes / Open questions / Current status. All content preserved from the original roadmap text in future tense; no dates or commitments added. Cross-links in both directions. Listed on the projects index under a clearly-labeled "Roadmaps & Concepts" section — visually distinct, no dates, Concept pill.

## SENTRY Repository Link Result

`https://github.com/zcohen-nerd/SENTRY` verified public via the GitHub API earlier in this workspace session ("USNA WRCE SENTRY Turret Project"); linked from the V3 At-a-glance as "View source on GitHub".

## FIRST Main Page Result

`/frc/` rewritten to ~1,100 words: Overview, accessible HTML/CSS timeline (semantic `<ul>`, real text, mono year labels, cyan spine), Engineering and systems leadership, Teaching and mentorship, Programs and advocacy, What FIRST taught me, and the full-history link. All facts carried over verbatim from the existing page (2006 founding student Team 1712, 2013–2017 Power Hawks numbers, judging through Worlds, four district events + 2018 championship AEM, $250K legislation with Delegate Reznik). Heading order fixed (single h1, no pre-h1 headings — the old page opened with an h3).

## FIRST History Preservation

Complete original content preserved at `/frc/history/` (23K chars) with corrected heading structure and cross-links. `/frc/` remains the primary route; no redirects needed.

## FIRST Visual Assets

**No FIRST-related photographs exist anywhere in the workspace** — the timeline and restructure shipped without photos per the rules (no placeholders). Useful later: team/competition photos already cleared for public use, event-operations wide shots, and any photo without identifiable minors' information.

## Project Section Matrix

| Project | Missing before | Added | Still missing | Evidence |
|---|---|---|---|---|
| SENTRY V3 | Testing & Verification | ✅ added | — | existing Implementation bullet + documented current-sense detection + résumé classroom use |
| SPARK | Testing & Verification | not added | Testing & Verification | résumé says "validation" with no documented specifics — needs Zac's facts |
| Fusion System Blocks | Interfaces, Testing & Verification | not added | both | no interface/test documentation in repo — needs Zac's facts |

## Project Index Wording

"Project pages are organized for quick scanning: [8 fixed sections]" → "Project pages emphasize the problem, architecture, interfaces, implementation decisions, verification, and lessons that are most relevant to each system."

## Build Result

Strict (`onBrokenLinks: throw`) build passes; all validate-build.js assertions pass (validator's server-rendered-links check updated for the new grouped nav markup — it stopped at the first `</div>` and needed to scan the whole disclosure region).

## Browser Validation

Served-build DOM checks: video present with both sources + poster (HTTP 200 ×3, correct sizes), muted, 412×232 attrs, no GIF references anywhere; V4 disclaimer/Concept/cross-links; /frc/ timeline + history link; /frc/history/ intact. Screenshot-level visual pass not possible this session (browser pane not compositing) — flagged for a quick manual scroll after deploy.

## Content Questions Still Requiring Zac

- SPARK: what validation actually occurred (bring-up steps, measurements) to support a Testing & Verification section?
- Fusion System Blocks: interface documentation (Fusion API surface? file formats?) and any real-world testing notes
- FIRST photos cleared for public use
- (carried from Batch B) SENTRY hardware-revision count and true dev window

## Deferred Work

- Per-project Open Graph cards
- Full lightbox system (raw-file links kept only for the labeled PCB diagram)
- Renaming the remaining space-containing asset filenames (SENTRY/*.png, "Fusion System Blocks/", "How I Build Systems.png") — many references, little payoff this batch
- Metrics requiring Zac's input
- Additional approved FIRST photography
- Deeper Documentation-area restructuring
- Surfer Fleet rewrite and relaunch
