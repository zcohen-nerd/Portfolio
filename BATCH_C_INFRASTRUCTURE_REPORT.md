# Batch C Infrastructure Report

## Scope

Canonical URLs, trailing-slash policy, robots/sitemaps, structured data, shared-navigation accessibility, external-link indicators, strict broken-link enforcement, and automated build validation across the brand package, hub, and portfolio.

## Repositories Changed

- `zcohen-nerd-brand` → branch `brand-batch-c-accessibility`
- `zcohen-nerd-landing-page` → branch `hub-batch-c-infrastructure`
- `Portfolio` → branch `portfolio-batch-c-infrastructure`
- Connector Guide and Literacy for Kids: **not present in this workspace** — deferred until cloned.

## Canonical Domain Result

Live audit showed the apex cutover already happened: `https://zcohen-nerd.com/` serves 200 and `www` 301-redirects to it (Cloudflare edge). The hub repo still said `www` in `url`, `CNAME`, README, and comments — all now apex. This also fixes a latent bug where a deploy could reset the GitHub Pages custom domain back to `www`. Brand defaults (`hubUrl`, `projectUrl`) moved to apex.

## Trailing-Slash Policy

| Site | Canonical URL | trailingSlash | Sitemap result |
|---|---|---:|---|
| Hub | https://zcohen-nerd.com/ | true | all entries apex + trailing slash, no redirects |
| Portfolio | https://portfolio.zcohen-nerd.com/ | true | all entries final-form, surfer-fleet excluded |

Both match live GitHub Pages behavior (no-slash 301s to slash — verified with live curls).

## Robots Policy

Zac chose **Option B (plain permissive)**: `User-agent: * / Allow: /` + Sitemap directive, no per-crawler AI blocks, applied to hub and portfolio repos. Observed caveat: the hub domain currently serves a **Cloudflare-managed robots.txt** (Content-Signals + AI-crawler Disallows) at the edge, which will keep overriding the repo file until the managed-robots feature is disabled in the Cloudflare dashboard — dashboard change deliberately not made from here.

## Structured Data

- Hub: `WebSite` + `Person` JSON-LD (verified facts only: name, alternate name, job title, hub URL, GitHub/LinkedIn/Substack/portfolio sameAs)
- Portfolio: `ProfilePage` whose `mainEntity` is the same Person identity anchored to the hub URL
- Both validated as parseable JSON-LD in built HTML by the new validation scripts

## Brand Package Release

Version stays **1.0.3** — it was never published (npm latest is 1.0.2), so per Zac's "Option 2" the accessibility work rides in the same first publish. `npm run build` compiles 5 files; pack dry-run shows 22 files including the new `src/utils/` + `lib/utils/`. **Publish still requires the machine holding npm credentials.**

## Consumer Dependency Migration / CI Workflow Cleanup

**Deferred until 1.0.3 is on npm.** Hub and portfolio keep `file:../zcohen-nerd-brand` and the CI brand-clone step. Follow-up (per consumer): set `"@zcohen-nerd/brand": "1.0.3"`, `npm install`, remove the workflow clone step, verify lockfile resolves to registry.npmjs.org.

## Plausible Result

Kept the existing `script.outbound-links.js` with `data-domain="zcohen-nerd.com"` (Zac's decision — it is the current correct pattern; domain matches apex). Validation asserts exactly one Plausible script. Dashboard-side verification still owed: site registered, pageview received, outbound click received.

## Shared Navigation Accessibility

- **Projects switcher** → disclosure pattern: no `role="menu"/"menuitem"`, `aria-expanded` + `aria-controls`, Escape closes and refocuses trigger, outside-click closes, link list **always server-rendered** (`hidden` when closed) so crawlers/no-JS visitors keep all 8 project links. Verified: previously the Connector Guide's live HTML contained zero project links in source.
- **Mobile drawer** → `role="dialog"` + `aria-modal`, trigger `aria-controls` + Open/Close label swap, focus enters on open, Tab trapped (both directions verified), Escape closes + returns focus, body scroll locked while open, content server-rendered.
- Browser-verified end-to-end in the hub preview (desktop keyboard sequence + mobile drawer sequence), zero console errors.

## External-Link Indicators

Shared `isExternalUrl` helper (zcohen-nerd.com family). Verified rendering: Literacy/GitHub/LinkedIn/Substack/Connector marked ↗ + sr-only text; Portfolio and SENTRY (subdomain family) unmarked; mailto unmarked. Applied to navbar links, switcher links, drawer links, and both footer columns.

## Footer Registry Consistency

Single registry (`src/data/projects.js`) drives switcher, drawer, footer, and hub cards. Current inventory: Portfolio, Literacy for Kids, Connector Guide, PinmapGen, Fusion System Blocks, FusionToGitHub, SENTRY, Writing. No Surfer Fleet, no legacy URLs.

## Strict Broken-Link Result

`onBrokenLinks: 'throw'` + markdown-hook throw on both sites. The portfolio's 17 long-standing false positives (raw-HTML anchors wrapping images with site-local `/assets/` hrefs, which the route checker can't see) were converted to absolute production URLs. Both sites build clean under strict mode.

## Automated Checks

`scripts/validate-build.js` in hub (24 assertions) and portfolio (26 assertions), wired into both deploy workflows after the build step: canonical/CNAME, OG images, JSON-LD parse, sitemap domain + slash policy, robots directives, legacy-URL bans, single Plausible script, résumé presence, Surfer Fleet redirect-only, Batch B publication facts, navigation-accessibility statics, duplicate-ID check. Full axe/browser automation deliberately not added (no existing browser test framework); statics cover the required minimums.

## Build Results

| Repository | Build | Validation | Browser validation |
|---|---:|---:|---:|
| brand | ✅ (babel, 5 files) | pack dry-run ✅ | via hub preview ✅ |
| hub | ✅ strict | 24/24 ✅ | keyboard + drawer + indicators ✅ |
| portfolio | ✅ strict | 26/26 ✅ | inherits shared components ✅ |

## Remaining Manual Steps

1. **Publish `@zcohen-nerd/brand@1.0.3`** from the machine with npm credentials (brand branch must merge first).
2. **Merge order matters**: brand PR → then hub/portfolio PRs (their CI validation asserts the new navigation markup, and CI clones brand *main*).
3. After publish: migrate hub/portfolio to the npm dependency and delete the CI clone steps (follow-up PRs).
4. Cloudflare dashboard: disable managed robots.txt if the repo-controlled Option B policy should actually serve on the hub domain.
5. Clone Connector Guide (and Literacy repos) into this workspace, then update them to brand 1.0.3.
6. Plausible dashboard: confirm the site is registered and events arrive.

## Deferred Work

- Per-project structured data and Open Graph cards
- Lighthouse performance budgets; portfolio asset compression (e.g. 2.7 MB ent-260.png)
- Project hierarchy/category work; writing index page
- Consumer dependency migration + CI clone removal (blocked on npm publish)
- Connector Guide / Literacy updates (repos not on this machine)
