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

### PID Hover Rig full page

A compact card now exists in Additional Engineering Work. A full project
page needs photos of the actual rig (the PID-Trainer repo is currently
empty except for a license).

### SPARK evidence

Beta boards are in hand and bring-up has begun. Highest-value additions:

- Photos of the physical boards and assembly
- Bring-up measurements as they are collected (power rails, eFuse,
  translation, CAN FD) — the page has a pending checklist ready for them
- Debug signal flow and hardware architecture diagrams (yEd)

### Two-page public résumé

The served PDF is the four-page extended record. A targeted ~2-page
general engineering résumé needs an editable source document — none
exists in the repo, so it must be exported from the résumé source and
added alongside the extended version.

---

## Site infrastructure

- **Per-subpage OG images:** surfer-fleet, sentry-v4, frc/history, teaching
  and documentation subpages fall back to the generic site card.
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
