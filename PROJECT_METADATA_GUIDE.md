# Project Metadata Guide

Controlled vocabulary and conventions for project status and dates across the portfolio. Every public representation of a project (index card, page header/footer, homepage mention) must agree with the canonical values defined here and in each page's frontmatter.

## Allowed statuses

| Status | Meaning |
|---|---|
| **Concept** | Design or investigation work that has not reached a functional prototype. |
| **Prototype** | A functioning implementation used for development, demonstration, or testing. |
| **Public Beta** | Publicly available and usable, but still actively changing. |
| **Deployed** | Used in its intended operational, instructional, research, or production environment. |
| **Archived** | Completed or no longer actively maintained, preserved as prior work. |

Do not use `Live`, `In Production`, `Production Prototype`, `Public Release`, `Class Deployment`, or other ad-hoc labels. If none of the five statuses fits, that is a signal to discuss adding one deliberately — not to invent a new label inline.

Note: the ecosystem hub (zcohen-nerd.com) uses its own card vocabulary from the shared brand registry; this guide governs the portfolio only.

## Date format

- Year ranges use an en dash with no spaces: `2023–2025`
- Open-ended ranges: `May 2025–Present`
- Single events: `October 2024`

Never mix hyphens (`2023-2025`), spaced dashes (`2023 – 2025`), or em dashes (`2023—2025`) in dates.

## Where metadata lives

Canonical project metadata lives in each project page's frontmatter:

```yaml
title: SENTRY Autonomous Turret
status: Deployed
displayDate: 2023–2025
```

The pages are CommonMark markdown, so frontmatter is not rendered — it is the **source of truth** that humans copy from. The projects index cards (`src/pages/projects/index.md`) and any body text mentioning status/dates must match the frontmatter exactly.

## Current canonical values

| Project | Status | displayDate |
|---|---|---|
| SENTRY Autonomous Turret | Deployed | 2023–2025 |
| SPARK Programming Board | Prototype | May 2025–Present |
| Fusion System Blocks | Public Beta | 2025–Present |
| SENTRY V4 Roadmap | Concept | — (none; planning-stage) |

## Rules

1. Never manually introduce a status or date that differs from the page frontmatter.
2. When a project's state changes, update the frontmatter **first**, then every rendered mention in the same commit.
3. Do not duplicate dates into new locations — link to the project page instead.

## Known technical debt

The index cards are static HTML inside CommonMark markdown, so card values are manually kept in sync with frontmatter rather than derived programmatically. Full deduplication would require converting the projects index to a React page with a data registry — deferred.
