---
title: Projects
description: "Engineering projects spanning systems integration, mechatronics, and technical enablement."
layout: default
permalink: /projects/
show_title: false
---

# Engineering Projects

Project pages are organized for quick scanning: Overview, Problem, System Architecture, Interfaces, Key Design Decisions, Implementation, Testing & Verification, and Lessons Learned.

{% assign all_projects = site.pages | where_exp: "p", "p.path contains 'projects/' and p.path != 'projects/index.md'" | sort: "weight" %}
{% assign flagship = all_projects | where: "featured", true %}
{% assign additional = all_projects | where: "featured", false %}

## Flagship Systems

{% for project in flagship %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endfor %}

## Additional Projects

{% for project in additional %}
- [{{ project.title }}]({{ project.url | relative_url }})
{% endfor %}
