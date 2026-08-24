# Portfolio Improvement TODO

Open items only. Completed items (Engineering Focus section, per-project
Lessons Learned, SENTRY diagrams and imagery, core-domains tightening,
factual/status cleanup) were removed — see git history for the original list.

Primary goals remain:

- Emphasize real engineering decisions
- Add system architecture visuals
- Highlight systems integration experience
- Make the writing read like an engineer describing real work

---

## Content

### Relaunch the Autonomous Surfer Fleet page

The draft in `drafts/projects/surfer-fleet/` needs a complete rewrite before
publishing (see its README):

- Real photos: hull/platform, electronics layout, bench integration, field test
- Fleet architecture diagram
- Replace filler copy; verify all claims
- Use a controlled-vocabulary status (`Deployed`), not "Active Deployment"
- Remove the `/projects/surfer-fleet` → `/projects/` redirect on relaunch

### Refresh the résumé PDF

`static/files/zac-cohen-resume.pdf` predates the current résumé (it lacks
the Micro1 role). Export a public-safe version (no phone, no clearance
details) and replace it.

### Add the PID Hover Rig

On the résumé's Selected Projects, absent from the site. Fits Teaching
(controls teaching platform) or Projects. Needs photos before publishing.

### FIRST photography

`/frc/` and `/frc/history/` have zero images across 20 years of involvement.

### SPARK diagrams

Schematic and PCB layout images are now on the page. Still wanted:

- Debug signal flow diagram
- Hardware architecture diagram

Diagrams should be exported from yEd.

---

## Site infrastructure

- **Per-subpage OG images:** sentry-v4, frc/history, teaching and
  documentation subpages fall back to the generic site card.
- **External link checking:** `validate-build.js` only checks built output;
  Substack, DOI, Autodesk, ST.com, and literacy-for-kids.com links are never
  verified. Consider a scheduled link-check workflow.
- **Essays page freshness:** no process syncs `/documentation/selected-essays/`
  with new Substack posts; newest listed is July 2026.
- **Analytics:** none by design so far — decide on Plausible (snippet
  documented in the hub report) or keep none.

---

## Long-term additions (optional)

Possible future projects to add:

- SENTRY V4 build (page exists as roadmap; becomes a project page when hardware exists)
- SPARK V0.4 production version
- Drone platform (Artemis lab concept)
- Custom power supply project

Only add projects when they have:

- working hardware
- photos
- architecture diagrams
