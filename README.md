# Zachary Cohen — Engineering Portfolio

**Electromechanical Engineer | Systems & Mechatronics Design**

[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://portfolio.zcohen-nerd.com/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue.svg)](LICENSE.md)

The professional engineering portfolio of Zachary Cohen — systems integration, mechatronics design, and technical education across embedded control systems, autonomous platforms, and educational technology.

**Live site: https://portfolio.zcohen-nerd.com/** — part of the [zcohen-nerd ecosystem](https://www.zcohen-nerd.com/).

Built with [Docusaurus](https://docusaurus.io/), consuming the shared [`@zcohen-nerd/brand`](https://github.com/zcohen-nerd/zcohen-nerd-brand) package for the Navbar, Footer, and design tokens.

## Featured Projects

- [SENTRY Autonomous Turret](src/pages/projects/sentry-v3.md) — Deployed mechatronics platform
- [SPARK Programming Board](src/pages/projects/stlink-v3mods.md) — Embedded development tooling
- [Fusion System Blocks](src/pages/projects/fusion-system-blocks.md) — Visual systems documentation framework

## Repository Structure

```
Portfolio/
├─ docusaurus.config.js      # Site config (brand theme, metadata)
├─ src/
│  ├─ pages/                 # All content pages (markdown)
│  │  ├─ index.md            # Homepage
│  │  ├─ frc.md              # FIRST Robotics
│  │  ├─ projects/           # Project writeups
│  │  ├─ teaching/           # Teaching portfolio
│  │  └─ documentation/      # Writing & research
│  └─ css/custom.css         # Brand tokens + page styles
├─ static/
│  ├─ assets/                # Images and media
│  ├─ files/                 # Résumé PDF
│  └─ CNAME                  # Custom domain
├─ drafts/                   # Unpublished content awaiting rework
├─ scripts/                  # Build validation + OG image generation
├─ docs/reports/             # Archived work-session reports
└─ .github/workflows/        # GitHub Pages deploy
```

## Local Development

The [`@zcohen-nerd/brand`](https://github.com/zcohen-nerd/zcohen-nerd-brand) theme is consumed from the npm registry — no sibling clone needed:

```bash
git clone https://github.com/zcohen-nerd/Portfolio.git
cd Portfolio
npm install
npm start
```

To run the same checks as CI:

```bash
npm run build
node scripts/validate-build.js
```

## Deployment

Deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

## License

Content licensed under [CC BY-NC 4.0](LICENSE.md).
