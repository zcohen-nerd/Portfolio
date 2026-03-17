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

<div class="project-grid">
{% for project in sorted_pages %}
{% if project.path contains 'projects/' and project.path != 'projects/index.md' and project.featured == true %}
	<div class="project-card">
		{% if project.image %}
		<img src="{{ project.image | relative_url }}" alt="{{ project.title }}" class="project-image" loading="lazy">
		{% else %}
		<div class="placeholder-img">{{ project.title }}</div>
		{% endif %}
		<h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
		<p>{{ project.description }}</p>
		<p class="project-status"><strong>{{ project.status }}</strong>{% if project.timeline %} | {{ project.timeline }}{% endif %}</p>
		<p><a href="{{ project.url | relative_url }}">View project →</a></p>
	</div>
{% endif %}
{% endfor %}
</div>

## Additional Projects

<div class="project-grid">
{% for project in sorted_pages %}
{% if project.path contains 'projects/' and project.path != 'projects/index.md' and project.featured != true %}
	<div class="project-card">
		{% if project.image %}
		<img src="{{ project.image | relative_url }}" alt="{{ project.title }}" class="project-image" loading="lazy">
		{% else %}
		<div class="placeholder-img">{{ project.title }}</div>
		{% endif %}
		<h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
		<p>{{ project.description }}</p>
		<p class="project-status"><strong>{{ project.status }}</strong>{% if project.timeline %} | {{ project.timeline }}{% endif %}</p>
		<p><a href="{{ project.url | relative_url }}">View project →</a></p>
	</div>
{% endif %}
{% endfor %}
</div>
