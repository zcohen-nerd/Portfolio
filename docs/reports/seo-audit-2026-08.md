# SEO / metadata audit — portfolio.zcohen-nerd.com (2026-08)

Canonical origin `https://portfolio.zcohen-nerd.com/` (`trailingSlash: true`).
**No analytics, no third-party scripts.**

## Route inventory (OG-image column is the only real weakness)

| Route | title | FM description | OG image after this pass |
| --- | --- | --- | --- |
| `/` | Electromechanical Systems Engineer | ✔ | site-wide (`og-zac-cohen-portfolio.png`) — by design |
| `/about/` | About | ✔ | **`og-about.png` (new)** |
| `/projects/` | Projects | ✔ | **`og-projects.png` (new)** |
| `/projects/surfer-fleet/` | SURFER Autonomous Vessel Fleet | ✔ | `og-surfer.jpg` (photo composite) |
| `/projects/sentry-v3/` | SENTRY Autonomous Turret | ✔ | `og-sentry-v3.png` |
| `/projects/sentry-v4/` | SENTRY V4 Roadmap | ✔ | site-wide — a concept page; acceptable |
| `/projects/fusion-system-blocks/` | Fusion System Blocks | ✔ | `og-fusion-system-blocks.png` |
| `/projects/stlink-v3mods/` | SPARK Programming Board | ✔ | `og-spark.png` |
| `/frc/` | FIRST Robotics | ✔ | `og-frc.png` |
| `/frc/history/` | FIRST Robotics — Full History | ✔ | site-wide — lower value; acceptable |
| `/teaching/` | Teaching & Education | ✔ | `og-teaching.png` |
| `/teaching/ent260-solidworks/` | ENT260 — Proposed SolidWorks Curriculum Redesign | ✔ | site-wide — acceptable |
| `/teaching/instructional-design/` | Computer Literacy for Kids Curriculum Project | ✔ | site-wide — acceptable |
| `/documentation/` | Writing & Research | ✔ | `og-writing-research.png` |
| `/documentation/scholarship/` | Scholarship & Speaking | ✔ | site-wide — acceptable |
| `/documentation/selected-essays/` | Selected Essays | ✔ | site-wide — acceptable |
| `/privacy/` **(new)** | Privacy | ✔ | site-wide |

Every route has a front-matter `description` (no route falls back to the generic
description). Titles unique. `<link rel="canonical">` correct on `/`. Sitemap via
`@docusaurus/plugin-sitemap` (all `<loc>` on the subdomain, trailing slash);
`static/robots.txt` + `static/CNAME` + root `CNAME` = `portfolio.zcohen-nerd.com`.

## Structured data

- **`Person`** (config `headTags`, every route) — enhanced: added `image`,
  `description`, `knowsAbout` (9 topics from the sites' own pages), and the
  portfolio URL to `sameAs` (now matches the hub's `Person` block). `Person.url`
  stays the **hub** URL (`validate-build.js` asserts this — identity is anchored
  to `zcohen-nerd.com`). **No `worksFor`, no `address`** (owner decision).
- **`SoftwareApplication`** (new, `/projects/fusion-system-blocks/` only, via an
  inline `<Head>` in the `.mdx`) — `name`, `applicationCategory:
  "DeveloperApplication"`, `operatingSystem: "Autodesk Fusion"`,
  `softwareVersion: "0.1.1"`, `url` (the page), `sameAs` / `downloadUrl` (the
  GitHub links the page already shows), `license` (URL to the repo's real
  `LICENSE` file), `author` (Person). **No `offers`, no `aggregateRating`, no
  `Organization`** — all fields are backed by the page's visible content.
- `validate-build.js` bans a homepage-scoped `ProfilePage` on 5 routes — not
  tripped (the new block is `SoftwareApplication`).

## What this pass changed

| Task | Change |
| --- | --- |
| 2 | Added `og-about.png` + `og-projects.png` (`scripts/generate-og-pages.ps1`), wired via front-matter `image:` in `about.md` / `projects/index.md`, and added to the `ogPages` loop in `validate-build.js` (both checked at 1200×630). **All six pre-existing cards regenerate byte-identical — none modified.** |
| 3 | `Person` JSON-LD enhanced (see above). |
| 4 | `SoftwareApplication` on the FSB page (see above). |
| 6 | New `src/pages/privacy.md` stub ("no analytics, no cookies, no third-party scripts" + link to the hub privacy page). Footer "Privacy" link appended to `customFields.brand.connectLinks`. Brand package untouched. |
| 7 | `icon-192/512.png`, `apple-touch-icon.png`, `site.webmanifest` (`display: "browser"` — not a PWA). `headTags` link entries added. |
| 8 | Commented verification-meta placeholders in `headTags`; see the checklist. |

**Not changed:** titles, descriptions, canonical handling, sitemap, homepage /
About copy (Task 5 reviewed — the hero domains line and About already carry the
target intents naturally; the About page's Maryland/Baltimore geography is
factual and stays). `@docusaurus/plugin-client-redirects` is still an unwired
dependency — recommend dropping it in a separate change.

## Verified

`npm run build` SUCCESS · `node scripts/validate-build.js` **all pass (288 ok)** ·
every JSON-LD block parses (UTF-8 em-dashes intact) · FSB `SoftwareApplication`
present on its route · `og-about` / `og-projects` referenced on their routes at
1200×630 · `site.webmanifest` valid, `display: "browser"`.
