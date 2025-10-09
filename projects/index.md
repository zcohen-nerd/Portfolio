---
title: Projects
description: "Engineering projects spanning systems integration, mechatronics, and technical enablement."
layout: default
permalink: /projects/
---

# Engineering Projects

Showcasing systems-level engineering work across embedded control, PCB design, and production readiness.

<div class="project-grid">
  {% for project_file in site.pages %}
    {% if project_file.path contains 'projects/' and project_file.path != 'projects/index.md' %}
      <div class="project-card">
        <div class="placeholder-img">
          🖼️ {{ project_file.title | default: project_file.name }} Image
        </div>
        <h3><a href="{{ project_file.url | relative_url }}">{{ project_file.title | default: project_file.name }}</a></h3>
        <p><em>Add project summary from frontmatter or content excerpt</em></p>
        <p><a href="{{ project_file.url | relative_url }}">Read more →</a></p>
      </div>
    {% endif %}
  {% endfor %}
</div>

## Project Categories

### 🏭 **Production Systems**
Projects that have reached manufacturing or deployment scale
- **Sentry V3**: Production-ready embedded actuation system
- **Autonomous Surfer Fleet**: Maritime autonomy in pilot deployment

### 🔬 **R&D and Prototyping**
Research, development, and proof-of-concept work
- **ST-Link V3 Mods**: Developer tooling improvements
- **Smart Home System**: Safety-critical IoT architecture

### 📚 **Educational Technology**
Hardware and curriculum for technical education
- **PID Trainer & Lab**: Control systems education platform

## Technical Domains

- **Embedded Control**: Real-time systems, firmware, sensors and actuators
- **PCB Design**: Mixed-signal design, rapid prototyping, DFM considerations  
- **Systems Integration**: Multi-domain coordination, verification, manufacturing handoff
- **Educational Technology**: Curriculum design, lab development, assessment