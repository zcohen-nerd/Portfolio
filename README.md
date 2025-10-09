# Zachary Cohen — Engineering Portfolio# Zachary Cohen — Engineering Portfolio



**Electromechanical Technologist | Systems & Mechatronics Design****Electromechanical Technologist | Systems & Mechatronics Design**



[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://zcohen-nerd.github.io/Portfolio/)[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://zcohen-nerd.github.io/Portfolio/)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

[![Build Status](https://github.com/zcohen-nerd/Portfolio/workflows/Build%20and%20Deploy%20Portfolio/badge.svg)](https://github.com/zcohen-nerd/Portfolio/actions)[![Build Status](https://github.com/zcohen-nerd/Portfolio/workflows/Build%20and%20Deploy%20Portfolio/badge.svg)](https://github.com/zcohen-nerd/Portfolio/actions)



## About This Portfolio## About This Portfolio



This repository contains the source code for my professional engineering portfolio, showcasing expertise in **systems integration**, **mechatronics design**, and **technical education**. The portfolio demonstrates practical engineering solutions across embedded control systems, autonomous platforms, and educational technology.This repository contains the source code for my professional engineering portfolio, showcasing expertise in **systems integration**, **mechatronics design**, and **technical education**. The portfolio demonstrates practical engineering solutions across embedded control systems, autonomous platforms, and educational technology.



**Live Site:** [https://zcohen-nerd.github.io/Portfolio/](https://zcohen-nerd.github.io/Portfolio/)**Live Site:** [https://zcohen-nerd.github.io/Portfolio/](https://zcohen-nerd.github.io/Portfolio/)



## Professional Summary## Professional Summary



Electromechanical technologist with 8+ years of experience in **systems-level integration** where mechanical, electrical, and software domains converge. Expertise spans from early-stage R&D through production deployment, with focus on ruggedized embedded systems, maritime autonomous platforms, and educational technology.Electromechanical technologist with 8+ years of experience in **systems-level integration** where mechanical, electrical, and software domains converge. Expertise spans from early-stage R&D through production deployment, with focus on ruggedized embedded systems, maritime autonomous platforms, and educational technology.



**Core Competencies:****Core Competencies:**

- **Systems Integration:** Multi-domain coordination, verification planning, release management- **Systems Integration:** Multi-domain coordination, verification planning, release management

- **Mechatronics & PCB Design:** Mixed-signal design, rapid prototyping, DFM optimization  - **Mechatronics & PCB Design:** Mixed-signal design, rapid prototyping, DFM optimization  

- **Technical Education:** Curriculum development, hands-on learning, assessment innovation- **Technical Education:** Curriculum development, hands-on learning, assessment innovation



## Featured Projects## Featured Projects



- **[Sentry V3](projects/sentry-v3.md)** — Production embedded actuation system (99.9% uptime, 1,200+ units deployed)- **[Sentry V3](projects/sentry-v3.md)** — Production embedded actuation system (99.9% uptime, 1,200+ units deployed)

- **[Autonomous Surfer Fleet](projects/surfer-fleet.md)** — Maritime autonomy platform (35-day endurance, 99.2% mission success)- **[Autonomous Surfer Fleet](projects/surfer-fleet.md)** — Maritime autonomy platform (35-day endurance, 99.2% mission success)

- **[PID Trainer & Lab](projects/pid-trainer.md)** — Control systems education platform (95% learning objective achievement)- **[PID Trainer & Lab](projects/pid-trainer.md)** — Control systems education platform (95% learning objective achievement)

- **[Smart Home System](projects/smart-home-system.md)** — Safety-first IoT architecture (99.8% uptime, zero security incidents)- **[Smart Home System](projects/smart-home-system.md)** — Safety-first IoT architecture (99.8% uptime, zero security incidents)

- **[ST-Link V3 Modifications](projects/stlink-v3mods.md)** — Enhanced development tools (40% debugging efficiency improvement)- **[ST-Link V3 Modifications](projects/stlink-v3mods.md)** — Enhanced development tools (40% debugging efficiency improvement)



## Repository Structure## Repository Structure



``````

portfolio/portfolio/

├── _config.yml              # Jekyll configuration├── _config.yml              # Jekyll configuration

├── index.md                 # Main portfolio page├── index.md                 # Main portfolio page

├── assets/├── assets/

│   ├── images/              # Images and graphics│   ├── images/              # Images and graphics

│   └── diagrams/           # Technical diagrams│   └── diagrams/           # Technical diagrams

├── projects/               # Technical project case studies├── projects/               # Technical project case studies

│   ├── sentry-v3.md│   ├── index.md

│   ├── surfer-fleet.md│   ├── sentry-v3.md

│   ├── pid-trainer.md│   ├── surfer-fleet.md

│   ├── smart-home-system.md│   ├── pid-trainer.md

│   └── stlink-v3mods.md│   ├── smart-home-system.md

├── teaching/               # Educational portfolio│   └── stlink-v3mods.md

│   ├── ent260-solidworks.md├── teaching/               # Educational portfolio

│   ├── pid-lab-module.md│   ├── index.md

│   └── instructional-design.md│   ├── ent260-solidworks.md

├── documentation/          # Publications and methods│   ├── pid-lab-module.md

│   ├── systems-methods.md│   └── instructional-design.md

│   ├── publications.md├── documentation/          # Publications and methods

│   └── presentations.md│   ├── index.md

└── _layouts/               # Custom Jekyll layouts│   ├── systems-methods.md

    └── default.html│   ├── publications.md

```│   └── presentations.md

└── _layouts/               # Custom Jekyll layouts

## Technology Stack    └── default.html

```

**Static Site Generator:** Jekyll with GitHub Pages  

**Theme:** Custom layout based on Cayman theme  ## Technology Stack

**Styling:** CSS3 with custom color scheme  

**Deployment:** Automated via GitHub Actions  **Static Site Generator:** Jekyll with GitHub Pages  

**Theme:** Custom layout based on Cayman theme  

**Color Scheme:****Styling:** CSS3 with custom color scheme  

- Primary Dark: `#0A1F44` **Deployment:** Automated via GitHub Actions  

- Primary Bright: `#00B8D9`**Performance:** Lighthouse-optimized for accessibility and SEO  

- Accent Yellow: `#F5C542`

- Neutral Light: `#E5E5E5`**Color Scheme:**

- Primary Dark: `#0A1F44` 

## Local Development- Primary Bright: `#00B8D9`

- Accent Yellow: `#F5C542`

To run this portfolio locally:- Neutral Light: `#E5E5E5`



1. **Clone the repository:**## Local Development

   ```bash

   git clone https://github.com/zcohen-nerd/Portfolio.gitTo run this portfolio locally:

   cd Portfolio

   ```1. **Clone the repository:**

   ```bash

2. **Install dependencies:**   git clone https://github.com/zcohen-nerd/Portfolio.git

   ```bash   cd Portfolio

   bundle install   ```

   ```

2. **Install dependencies:**

3. **Run the development server:**   ```bash

   ```bash   bundle install

   bundle exec jekyll serve   ```

   ```

3. **Run the development server:**

4. **View locally:** Open [http://localhost:4000](http://localhost:4000)   ```bash

   bundle exec jekyll serve

## Content Guidelines   ```



### Adding New Projects4. **View locally:** Open [http://localhost:4000](http://localhost:4000)

1. Create new markdown file in `projects/` directory

2. Use existing project files as templates## Content Guidelines

3. Include frontmatter with title, description, tags, status, timeline

4. Add project to main index and project index pages### Adding New Projects

5. Include placeholder images with specific dimensions1. Create new markdown file in `projects/` directory

2. Use existing project files as templates

### Image Requirements3. Include frontmatter with title, description, tags, status, timeline

- **Hero Images:** 1200×675px (16:9 ratio)4. Add project to main index and project index pages

- **Project Images:** 800×600px (4:3 ratio)  5. Include placeholder images with specific dimensions

- **Diagrams:** Variable size, maintain readability

- **Format:** PNG for line art, JPG for photos### Image Requirements

- **Hero Images:** 1200×675px (16:9 ratio)

### Content Style- **Project Images:** 800×600px (4:3 ratio)  

- **Professional tone** appropriate for technical audience- **Diagrams:** Variable size, maintain readability

- **Quantitative results** with specific metrics where possible- **Format:** PNG for line art, JPG for photos

- **Technical detail** balanced with accessibility

- **Industry terminology** with explanations for broader audience### Content Style

- **Professional tone** appropriate for technical audience

## Deployment- **Quantitative results** with specific metrics where possible

- **Technical detail** balanced with accessibility

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment process includes:- **Industry terminology** with explanations for broader audience



1. **Jekyll Build:** Generate static site files## Deployment

2. **GitHub Pages Deploy:** Publish to live site

3. **Cache Invalidation:** Ensure fresh content deliveryThe site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment process includes:



## Performance & SEO1. **Jekyll Build:** Generate static site files

2. **Performance Testing:** Lighthouse CI for quality metrics

- **SEO Optimization:** Structured data, meta tags, sitemap3. **GitHub Pages Deploy:** Publish to live site

- **Accessibility:** WCAG 2.1 AA compliance4. **Cache Invalidation:** Ensure fresh content delivery

- **Performance:** Optimized images, minimal JavaScript, CDN delivery

## Performance & SEO

## Contact & Professional Links

- **Lighthouse Score:** 95+ across all categories

- **Email:** [zcohen-nerd@gmail.com](mailto:zcohen-nerd@gmail.com)- **SEO Optimization:** Structured data, meta tags, sitemap

- **LinkedIn:** [zachary-cohen-nerd](https://www.linkedin.com/in/zachary-cohen-nerd/)- **Accessibility:** WCAG 2.1 AA compliance

- **GitHub:** [zcohen-nerd](https://github.com/zcohen-nerd)- **Performance:** Optimized images, minimal JavaScript, CDN delivery



## License## Contact & Professional Links



This portfolio content is available under the [MIT License](LICENSE.md). Feel free to use the structure and styling for your own portfolio, but please replace the content with your own projects and experiences.- **Email:** [zcohen-nerd@gmail.com](mailto:zcohen-nerd@gmail.com)

- **LinkedIn:** [zachary-cohen-nerd](https://www.linkedin.com/in/zachary-cohen-nerd/)

---- **GitHub:** [zcohen-nerd](https://github.com/zcohen-nerd)



**Built with Jekyll • Deployed via GitHub Pages • Last updated: October 2025**## License

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

## Contact & Collaboration

**Currently available for:** Technical consulting, product development partnerships, curriculum design, and speaking engagements.

- **Email:** [zcohen-nerd@gmail.com](mailto:zcohen-nerd@gmail.com)
- **LinkedIn:** [zachary-cohen-nerd](https://www.linkedin.com/in/zachary-cohen-nerd/)
- **GitHub:** [zcohen-nerd](https://github.com/zcohen-nerd)
- **Portfolio Site:** [https://zcohen-nerd.github.io/Portfolio/](https://zcohen-nerd.github.io/Portfolio/)

---

## License & Attribution

### Personal Content License

**All personal content including but not limited to:**
- Professional biography and personal information
- Project descriptions and technical details
- Professional photographs and branding materials
- Course materials and educational content
- Research publications and presentations

**© 2025 Zachary Cohen. All rights reserved.**

This personal content is protected by copyright and may not be reproduced, distributed, or used without explicit written permission.

### Open Source Components

The Jekyll theme, build configuration, and structural templates are available under their respective open-source licenses. See [LICENSE.md](LICENSE.md) for full details.

### Image Guidelines

For optimal GitHub Pages performance:
- **Professional photos:** 600-800px wide
- **Project images:** Consistent aspect ratios (4:3 or 16:9)
- **Technical diagrams:** Store in `/assets/diagrams/` with descriptive names

---

**Built with Jekyll • Deployed via GitHub Pages • Last updated: October 2025**

## Contact & Publishing

- LinkedIn: https://www.linkedin.com/in/zachary-cohen-nerd/
- GitHub: https://github.com/zcohen-nerd
- Email: zcohen-nerd@gmail.com
- GitHub Pages: enable Pages on branch `main` with root `/` once content is finalized.

#   D e p l o y m e n t   F i x 
 
 