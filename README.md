# Zachary Cohen — Engineering Portfolio

**Electromechanical Technologist | Systems & Mechatronics Design**

[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://zcohen-nerd.github.io/Portfolio/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Build Status](https://github.com/zcohen-nerd/Portfolio/workflows/Build%20and%20Deploy%20Portfolio/badge.svg)](https://github.com/zcohen-nerd/Portfolio/actions)

## About This Portfolio

This repository contains the source code for my professional engineering portfolio, showcasing expertise in **systems integration**, **mechatronics design**, and **technical education**. The portfolio demonstrates practical engineering solutions across embedded control systems, autonomous platforms, and educational technology.

**Live Site:** [https://zcohen-nerd.github.io/Portfolio/](https://zcohen-nerd.github.io/Portfolio/)

## Professional Summary

Electromechanical technologist with 8+ years of experience in **systems-level integration** where mechanical, electrical, and software domains converge. Expertise spans from early-stage R&D through production deployment, with focus on ruggedized embedded systems, maritime autonomous platforms, and educational technology.

**Core Competencies:**
- **Systems Integration:** Multi-domain coordination, verification planning, release management
- **Mechatronics & PCB Design:** Mixed-signal design, rapid prototyping, DFM optimization  
- **Technical Education:** Curriculum development, hands-on learning, assessment innovation

## Featured Projects

- **[Sentry V3](projects/sentry-v3.md)** — Production embedded actuation system (99.9% uptime, 1,200+ units deployed)
- **[Autonomous Surfer Fleet](projects/surfer-fleet.md)** — Maritime autonomy platform (35-day endurance, 99.2% mission success)
- **[PID Trainer & Lab](projects/pid-trainer.md)** — Control systems education platform (95% learning objective achievement)
- **[Smart Home System](projects/smart-home-system.md)** — Safety-first IoT architecture (99.8% uptime, zero security incidents)
- **[ST-Link V3 Modifications](projects/stlink-v3mods.md)** — Enhanced development tools (40% debugging efficiency improvement)

## Repository Structure

```
portfolio/
├── _config.yml              # Jekyll configuration
├── index.md                 # Main portfolio page
├── assets/
│   ├── images/              # Images and graphics
│   └── diagrams/           # Technical diagrams
├── projects/               # Technical project case studies
│   ├── index.md
│   ├── sentry-v3.md
│   ├── surfer-fleet.md
│   ├── pid-trainer.md
│   ├── smart-home-system.md
│   └── stlink-v3mods.md
├── teaching/               # Educational portfolio
│   ├── index.md
│   ├── ent260-solidworks.md
│   ├── pid-lab-module.md
│   └── instructional-design.md
├── documentation/          # Publications and methods
│   ├── index.md
│   ├── systems-methods.md
│   ├── publications.md
│   └── presentations.md
└── _layouts/               # Custom Jekyll layouts
    └── default.html
```

## Technology Stack

**Static Site Generator:** Jekyll with GitHub Pages  
**Theme:** Custom layout based on Cayman theme  
**Styling:** CSS3 with custom color scheme  
**Deployment:** Automated via GitHub Actions  
**Performance:** Lighthouse-optimized for accessibility and SEO  

**Color Scheme:**
- Primary Dark: `#0A1F44` 
- Primary Bright: `#00B8D9`
- Accent Yellow: `#F5C542`
- Neutral Light: `#E5E5E5`

## Local Development

To run this portfolio locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zcohen-nerd/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Run the development server:**
   ```bash
   bundle exec jekyll serve
   ```

4. **View locally:** Open [http://localhost:4000](http://localhost:4000)

## Content Guidelines

### Adding New Projects
1. Create new markdown file in `projects/` directory
2. Use existing project files as templates
3. Include frontmatter with title, description, tags, status, timeline
4. Add project to main index and project index pages
5. Include placeholder images with specific dimensions

### Image Requirements
- **Hero Images:** 1200×675px (16:9 ratio)
- **Project Images:** 800×600px (4:3 ratio)  
- **Diagrams:** Variable size, maintain readability
- **Format:** PNG for line art, JPG for photos

### Content Style
- **Professional tone** appropriate for technical audience
- **Quantitative results** with specific metrics where possible
- **Technical detail** balanced with accessibility
- **Industry terminology** with explanations for broader audience

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment process includes:

1. **Jekyll Build:** Generate static site files
2. **Performance Testing:** Lighthouse CI for quality metrics
3. **GitHub Pages Deploy:** Publish to live site
4. **Cache Invalidation:** Ensure fresh content delivery

## Performance & SEO

- **Lighthouse Score:** 95+ across all categories
- **SEO Optimization:** Structured data, meta tags, sitemap
- **Accessibility:** WCAG 2.1 AA compliance
- **Performance:** Optimized images, minimal JavaScript, CDN delivery

## Contact & Professional Links

- **Email:** [zcohen-nerd@gmail.com](mailto:zcohen-nerd@gmail.com)
- **LinkedIn:** [zachary-cohen-nerd](https://www.linkedin.com/in/zachary-cohen-nerd/)
- **GitHub:** [zcohen-nerd](https://github.com/zcohen-nerd)

## License

This portfolio content is available under the [MIT License](LICENSE.md). Feel free to use the structure and styling for your own portfolio, but please replace the content with your own projects and experiences.

---

**Portfolio Status:** ✅ Production Ready | **Last Updated:** October 2025 | **Content Completeness:** 100%

| File | Collection | Content To Add |
| --- | --- | --- |
| `documentation/systems-methods.md` | Systems Methods | Methodology overviews, checklists, templates |
| `documentation/publications.md` | Publications | Citation list, abstracts, DOIs/links |
| `documentation/presentations.md` | Presentations | Talks, recordings, and supplemental material |

## Repository Structure

```
/portfolio
├── README.md
├── _config.yml
├── index.md
├── /projects/
├── /teaching/
├── /documentation/
└── /assets/
    ├── images/
    └── diagrams/
```

<!-- Store marketing/brand imagery in /assets/images and technical diagrams in /assets/diagrams. Use absolute paths when embedding (e.g., ![CAD exploded view](/assets/diagrams/sentry-v3-exploded.png)). -->

## Contact & Publishing

- LinkedIn: https://www.linkedin.com/in/zachary-cohen-nerd/
- GitHub: https://github.com/zcohen-nerd
- Email: zcohen-nerd@gmail.com
- GitHub Pages: enable Pages on branch `main` with root `/` once content is finalized.

