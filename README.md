# Zachary Cohen — Engineering Portfolio

**Electromechanical Engineer | Systems & Mechatronics Design**

[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://portfolio.zcohen-nerd.com/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue.svg)](LICENSE.md)

The professional engineering portfolio of Zachary Cohen — systems integration, mechatronics design, and technical education across embedded control systems, autonomous platforms, and educational technology.

**Live site: https://portfolio.zcohen-nerd.com/** — part of the [zcohen-nerd ecosystem](https://www.zcohen-nerd.com/).

Built with [Docusaurus](https://docusaurus.io/), consuming the shared [`@zcohen-nerd/brand`](https://github.com/zcohen-nerd/zcohen-nerd-brand) package for the Navbar, Footer, and design tokens.

## Featured Projects

- [SENTRY Autonomous Turret](src/pages/projects/sentry-v3.md) — Production embedded actuation system
- [Autonomous Surfer Fleet](src/pages/projects/surfer-fleet.md) — Maritime autonomy platform
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
│  │  └─ documentation/      # Documentation & scholarship
│  └─ css/custom.css         # Brand tokens + page styles
├─ static/
│  ├─ assets/                # Images and media
│  └─ CNAME                  # Custom domain
└─ .github/workflows/        # GitHub Pages deploy
```

## Local Development

Requires the brand package cloned alongside this repo:

```bash
git clone https://github.com/zcohen-nerd/zcohen-nerd-brand.git ../zcohen-nerd-brand
git clone https://github.com/zcohen-nerd/Portfolio.git
cd Portfolio
npm install
npm start
```

## Deployment

Deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

## License

Content licensed under [CC BY-NC 4.0](LICENSE.md).
