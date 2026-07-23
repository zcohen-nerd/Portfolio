# Step 3 Factual Corrections Report

## Scope

Factual alignment of Fusion System Blocks, SPARK, ENT260, SENTRY, Literacy for Kids, and portfolio structured data.

## Branch Base

`portfolio-step-3-factual-corrections` branched from `main` at `7a21af8` (Steps 1 and 2 both merged; no stacking required).

## Source Repositories

| Project | Source repository | Reviewed | Evidence files |
|---|---|---|---|
| Fusion System Blocks | github.com/zcohen-nerd/Fusion_System_Blocks (read-only via API; no local clone in workspace) | main @ v0.1.1 release | README.md (full), repo tree, Releases |
| SPARK | github.com/zcohen-nerd/SPARK (read-only via API) | main, rev-0.4 baseline | README.md, CHANGELOG.md, docs/ + validation/ listings |
| Literacy for Kids | live canonical site + linked GitHub | www.literacy-for-kids.com | rendered site text + footer links |

## Fusion System Blocks

**Previous mischaracterization:** presented as a "lightweight architectural framework" / documentation workflow. **Now:** an Autodesk Fusion add-in providing a block-diagram editor inside CAD. Verified and published: diagrams stored in the Fusion design; 8 block shapes across Electrical/Mechanical/Software/Generic; typed wires; Link-to-CAD carrying name/material/mass; Placeholder→Verified progress states; rule checks (unconnected, voltage mismatch, power budget); snapshots with restore and diff; pages, nested diagrams, groups, net labels; 11 export formats (PDF, BOM, connection matrix, SVG…). Architecture section and updated Mermaid diagram reflect the actual layering (add-in layer / HTML-JS panel / pure-Python core / design-file persistence) straight from the README's developer section. Verification: **775 Python tests, 24 JS harness tests, 30 in-app diagnostics** (current README baseline), plus documented manual regression and release-validation plans — the three layers explicitly distinguished. Release status Public Beta, v0.1.1, early-release backups guidance, Community License with paid commercial use. GitHub + Releases links added.

## SPARK

**Previous mischaracterization:** "clean signal breakout rather than adding active circuitry" / "electrically simple" — the opposite of the real V0.4 design. **Now, all from README/CHANGELOG:** TPS2596 eFuse-protected 5 V entry; low-noise LDO internal 1.8/3.3 V rails; TPS22919-switched target rails defaulting OFF via hardware pulldowns; VTREF ≤ 3.6 V policy with 5V_TARGET explicitly power-only; hybrid translation (LSF0108 for open-drain I²C, SN74AXC8T245 for SWDIO/SPI/UART/GPIO-SWO); TCAN1051 CAN FD with switchable 120 Ω termination; 22 Ω series + SP0503BAHTG ESD on all external lines; 4-layer JLC04161H-7628 stackup, 12-mil routing, ENIG, ink-plugged vias, 88.9 × 88.9 mm enclosure-driven board. **Manufacturing state stated exactly:** schematic and PCB sources complete, fabrication packages and ODB++ present, **physical fabrication/assembly not recorded**. **Validation:** "A bench-validation plan is defined, but execution remains in progress" — no completed measurements claimed. Status stays Prototype. V1 goals (VTREF OVP, split CAN termination) noted as design-review outcomes.

## ENT260

Title and H1 → "ENT260 — Proposed SolidWorks Curriculum Redesign"; status callout at top; historical paragraph: taught at Anne Arundel Community College, ~75% CSWA pass in **prior offerings of the existing course**, with an explicit "not the proposal" separation sentence. Tense converted throughout the framing sections (would-language); modules/weeks/deliverables preserved verbatim; assessment table verified to total exactly 100% (no fix needed); "SolidWorks 2024" → version-neutral wording. Teaching-index card updated to match.

## Structured Data

**Previous defect:** an identical homepage `ProfilePage` was injected on every route. **Fix (spec's sanctioned fallback):** global block replaced with an accurate `Person` (hub URL, verified sameAs only); homepage-only ProfilePage deferred — the CommonMark homepage would need an MDX conversion that its raw-HTML content makes risky. Validator now parses JSON-LD on five representative routes and bans any homepage-claiming ProfilePage.

## SENTRY

Heading → "SENTRY V3: Deployed Mechatronics Platform" (caps fixed, no commercial-production implication; Deployed is the canonical status). Usage metric now carries its deployment context: "Used by 100+ students per year in its U.S. Naval Academy instructional deployment" (résumé states ongoing annual use; the timeframe wording no longer implies indefinite verified continuity). Timeline 2023–2025 left as-is — the canonical value from Zac's original frontmatter; the Batch B question about the exact window remains open. Nothing else on the page changed.

## Literacy for Kids

Canonical age range from the live site: **ages 8–12 (roughly grades 3–6)** — replaced the page's "roughly ages 7-11". Source link → **github.com/literacy-for-kids** (the org the live canonical site itself links) replacing the legacy personal-account repo link. Website URL form (www) already matched the live canonical. **Brand follow-up: none required** — the shared registry already says "kids 8–12".

## Automated Validation

24 new assertions in `validate-build.js`: FSB identity/links/verification/status/obsolete-framing ban; SPARK architecture components/GitHub/validation-status/false-rationale ban; ENT260 proposal labeling, historical CSWA binding, separation statement, unqualified-rewrite ban; parsed JSON-LD Person + per-route ProfilePage ban; SENTRY heading/usage; Literacy age + repo canonicals. One Step 1 marker updated (diagram chunk check now keys on the new architecture diagram's nodes). All 68 total checks pass.

## Build / Browser Validation

`npm ci` + strict build clean. Browser-verified: FSB Mermaid renders the new 5-node architecture diagram, add-in framing and test metrics visible, GitHub/Releases links present, no overflow; SPARK image/eFuse/validation-status/Prototype correct with obsolete phrasing gone; ENT260 proposal callout precedes the curriculum; homepage emits exactly one `Person` JSON-LD with hero and résumé intact; Literacy canonicals in place. Zero console errors. Pixel-level visual pass deferred (automation pane cannot composite this session).

## Factual Questions Still Requiring Zac

- **SENTRY:** Does 2023 mark the start of V3 development, classroom deployment, or the broader program? Did 100+ students/year continue after 2025 (current wording is deployment-scoped either way)?
- **SPARK:** Has any board been physically fabricated or assembled outside the repository record? Which validation-plan items, if any, have been executed?
- **ENT260:** Should any portion of the proposed sequence be marked as already piloted?

## Files Changed

`docusaurus.config.js`, `src/pages/projects/fusion-system-blocks.md`, `src/pages/projects/stlink-v3mods.md`, `src/pages/projects/sentry-v3.md`, `src/pages/teaching/ent260-solidworks.md`, `src/pages/teaching/instructional-design.md`, `src/pages/teaching/index.md`, `scripts/validate-build.js`, this report.

## Explicitly Deferred Work

- Teaching-index content and Impact & Metrics rewrite
- Selected Essays inventory
- Writing & Research index completion
- Hub résumé link
- Current Focus replacement for repeated hub identity section
- Brand npm publication
- Consumer dependency migration
- Remaining SENTRY image optimization
- Asset filename cleanup
- Surfer Fleet rewrite and relaunch
- Homepage-only ProfilePage JSON-LD (pending safe MDX conversion)
