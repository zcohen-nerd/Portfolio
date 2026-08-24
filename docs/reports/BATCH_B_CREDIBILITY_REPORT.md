# Portfolio Batch B Credibility Report

## Scope

Publications, speaking, résumé access, project metadata consistency, and verified quantitative evidence.

## Publication Corrections

The scholarship page previously listed two publications with **incorrect titles and malformed DOIs** ("Real-Time Integration and Testing of Distributed Autonomous Systems", "Modular Embedded Architectures for Autonomous Surface Vehicles"). The embedded IEEE document numbers turned out to belong to the real papers; both were verified via the Crossref API and relinked with official DOIs.

### ICUAS 2025

"GNSS Emulator for Test and Evaluation of Flight Controller Performance" — Co-author — International Conference on Unmanned Aircraft Systems (ICUAS), May 2025. Verified DOI: `10.1109/ICUAS65942.2025.11007919` (Crossref: authors McClelland, Cohen, Kutzer, DeVries; published 2025-05-14).

### IEEE/RSJ IROS 2024

"A Geometry-based Approach for Support-free Additive Manufacturing of Structures with Large Overhang Angles and Closed Features" — Co-author **and conference presenter**; presented at IROS 2024 in Abu Dhabi. Verified DOI: `10.1109/IROS58592.2024.10801999` (Crossref: authors Liu, Cohen, Kim, Armand, Kutzer; published 2024-10-14).

### Autodesk University 2025

"From Schematics to Reality: Turbocharging Mechatronics with Fusion" — **Selected Presenter**, September 2025, based on SENTRY. Moved out of the publications section into "Conference Presentations & Selected Speaking". The unverifiable "Las Vegas, NV" location was removed; the existing official autodesk.com class link was preserved (Autodesk blocks automated verification — flagged for manual confirmation).

## Homepage Credential Section

"Publications & Speaking" section added between Other Work and How I Work: intro line plus three compact entries with exact role distinctions, linking to the detailed page.

## Navigation / Writing & Research Result

Nav label "Documentation" → "Writing & Research" (label + page heading only; the `/documentation/` route is unchanged, so no redirects needed). The hub's "Writing" nav (→ Substack) is a different site and label; no collision within the portfolio nav.

## Résumé

### Source File Selected

`ZCohen Resume (7).pdf` attached by Zac (authoritative; content matches current roles and corrected publications).

### Public Path

`static/files/zac-cohen-resume.pdf` → `https://portfolio.zcohen-nerd.com/files/zac-cohen-resume.pdf`

### Privacy Review

Per Zac's direction, phone number and clearance data are replaced with "available upon request." The original PDF's fonts made in-place redaction unsafe (overlay methods left the text extractable), so the public PDF was **rebuilt from scratch** with pdf-lib: identical verified content, three "available upon request" substitutions, selectable text, scrubbed metadata. Confirmed by extraction: no phone digits, no clearance strings recoverable. Note: the rebuilt PDF is a clean typeset, not the original visual design — Zac should eyeball it once.

### Links Added

Homepage Contact ("View résumé (PDF)") and the scholarship page contact block. Not added elsewhere.

## Project Metadata Vocabulary

`PROJECT_METADATA_GUIDE.md` created: Concept / Prototype / Public Beta / Deployed / Archived, definitions, en-dash date rules, frontmatter as source of truth.

## Metadata Reconciliation

| Project | Previous values | Canonical value | Evidence | Remaining uncertainty |
|---|---|---|---|---|
| SENTRY | Card: "In Production \| 2023-2025"; page footer: "Production Deployment \| January 2024 - December 2025" | **Deployed \| 2023–2025** | Original pre-migration frontmatter authored by Zac (`timeline: "2023-2025"`); résumé confirms deployment at USNA and ongoing student use | Page footer previously said Jan 2024–Dec 2025 — Zac should confirm the true development window |
| SPARK | Card: "Production Prototype \| May 2025 - Present"; footer: "Prototype Deployment" | **Prototype \| May 2025–Present** | Résumé (present tense: "Designing…") | None |
| Fusion System Blocks | Card: "Public Release \| 2025–2026"; footer: "Public Release \| 2025–2026" | **Public Beta \| 2025–Present** | v0.1.1 release Feb 2026, active commits, résumé "Developing…" | None |

## Metadata Architecture

Canonical `status`/`displayDate` added to each project page's frontmatter; cards and page footers updated to match. Full programmatic derivation (React index consuming a data file) documented as technical debt in the guide — the index is CommonMark HTML.

## Quantified Evidence Added

- SENTRY "At a glance": 100+ students annually; USNA origin + public open-source release; selected AU 2025 presentation (all résumé-verified)
- ENT260: "Taught at Anne Arundel Community College. Students achieve a ~75% pass rate on the CSWA exam." (résumé-verified)
- FRC page already carried résumé-consistent figures ($250K annual funding, 100+ volunteer staff) — left as is

## Metrics Still Needed from Zac

- SENTRY: number of hardware revisions? True development window (2023 start vs the page footer's January 2024)?
- SENTRY: confirm whether "100+ students annually" continues post-departure
- SPARK: board revision count / validation status worth publishing?
- Fusion System Blocks: any usage/download numbers worth citing?
- Autodesk University: confirm the class-page URL renders correctly (autodesk.com blocks automated checks) and the session location/format

## Institution Naming Result

No vague institution phrases existed; USNA (SENTRY) and Anne Arundel Community College (ENT260) added where résumé-supported.

## Build Result

Success. No new broken links — only the 17 pre-existing static-asset false positives.

## Browser Validation

See Batch B final report; performed on the served build.

## Remaining Risks

- Rebuilt résumé layout differs from the original design (content identical) — needs Zac's visual sign-off
- AU class link unverified by automation

## Deferred Work

- Add résumé link to the hub in a separate PR
- Add metrics that require Zac's factual input
- Broader project-page content work
- SENTRY V4 roadmap separation
- FIRST Robotics page restructuring and imagery
- Documentation-area information architecture
