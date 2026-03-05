---
title: Projects
description: "Engineering projects spanning systems integration, mechatronics, and technical enablement."
layout: default
permalink: /projects/
show_title: false
---

# Engineering Projects

Project pages are organized for quick scanning: Overview, Problem, System Architecture, Interfaces, Key Design Decisions, Implementation, Testing & Verification, and Lessons Learned.

{% assign sorted_pages = site.pages | sort: "weight" %}

## Flagship Systems

{% for project in sorted_pages %}
{% if project.path contains 'projects/' and project.path != 'projects/index.md' and project.featured == true %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endif %}
{% endfor %}

## Additional Projects

{% for project in sorted_pages %}
{% if project.path contains 'projects/' and project.path != 'projects/index.md' and project.featured != true %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endif %}
{% endfor %}
