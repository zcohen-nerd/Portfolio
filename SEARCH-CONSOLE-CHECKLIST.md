# Search Console checklist — portfolio.zcohen-nerd.com

Owner runbook for Google Search Console (GSC) and Bing Webmaster Tools (BWT).
**Nothing here has been done automatically.** Every step needs the owner, signed
in, with authorization for the property.

Property type: **URL-prefix** for `https://portfolio.zcohen-nerd.com/`. (If the
`zcohen-nerd.com` **Domain property** is set up on the hub, it already covers this
subdomain — check GSC before adding a duplicate.)

## 1. Verify

1. If the `zcohen-nerd.com` Domain property exists → this subdomain is already
   verified. Skip to step 2.
2. Otherwise GSC → *Add property* → **URL prefix** →
   `https://portfolio.zcohen-nerd.com/`.
3. **HTML tag** method: uncomment the placeholder in `docusaurus.config.js`
   `headTags` and paste the token:
   ```js
   {tagName: 'meta', attributes: {name: 'google-site-verification', content: '<token>'}},
   {tagName: 'meta', attributes: {name: 'msvalidate.01', content: '<token>'}},
   ```
4. `npm run build`, deploy, **Verify**. Repeat for BWT.

## 2. Submit the sitemap

- GSC → *Sitemaps* → `https://portfolio.zcohen-nerd.com/sitemap.xml`
- BWT → *Sitemaps* → same.
- Generated on every build by `@docusaurus/plugin-sitemap` (17 routes).

## 3. URL inspection (first pass)

Inspect + *Request indexing*:

- `/` — the portfolio homepage
- `/about/` · `/projects/` · `/privacy/`
- `/projects/surfer-fleet/` · `/projects/sentry-v3/` ·
  `/projects/fusion-system-blocks/` · `/projects/stlink-v3mods/` — the flagship
  case studies
- `/documentation/scholarship/` (publications) · `/teaching/`

## 4. Baseline (after ~28 days)

- GSC → *Performance* → 28 days → export **top 25 queries** + **top 25 pages**.
- GSC → *Pages* → indexed count (target ~17).
- Check the **rich-results** report for the FSB `SoftwareApplication` and the
  `Person` block — they should validate with no errors (there are no
  `offers`/`rating`, so no rich card is expected; the goal is a clean parse and
  entity understanding, not a stars widget).
- BWT → *Search Performance* → same.

| date | queries file | pages file | indexed | rich-results status | notes |
| --- | --- | --- | --- | --- | --- |
| _fill in_ | | | | | first baseline |

## 5. Monthly review (~15 min)

- GSC *Pages*: new "Discovered / Crawled – not indexed"? The `/teaching/*` and
  `/documentation/*` leaf pages are the likeliest to sit un-indexed — decide per
  page whether that's fine (thin) or worth a content pass.
- *Enhancements / Rich results*: any new errors on the `Person` or
  `SoftwareApplication` schema (e.g. after a Docusaurus upgrade changing head
  output)?
- *Performance*: recruiter-style queries ("electromechanical systems engineer",
  "autonomous maritime", "Fusion add-in", a name search) — position and CTR.
  Low-CTR high-impression pages → title/description candidates (keep them
  human-first).
- Confirm `sitemap.xml`, `robots.txt`, `site.webmanifest`, `/privacy/`, and a
  sample OG image still resolve after any deploy.
