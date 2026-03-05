---
title: Teaching & Education
description: "Curriculum development, lab design, and instructional technology for engineering education."
layout: default
permalink: /teaching/
show_title: false
---

# Teaching & Educational Impact

Creating learning experiences that bridge theory and practice in engineering education.

## Teaching Philosophy

_Add 2-3 paragraphs describing your educational approach, learning theories you follow, and how you design inclusive, effective technical education._

## Current Courses & Modules

<div class="project-grid">
  {% for teaching_file in site.pages %}
    {% if teaching_file.path contains 'teaching/' and teaching_file.path != 'teaching/index.md' %}
      <div class="project-card">
        <div class="placeholder-img">
          📚 {{ teaching_file.title | default: teaching_file.name }} Materials
        </div>
        <h3><a href="{{ teaching_file.url | relative_url }}">{{ teaching_file.title | default: teaching_file.name }}</a></h3>
        <p><em>Add course/module description and learning outcomes</em></p>
        <p><a href="{{ teaching_file.url | relative_url }}">Learn more →</a></p>
      </div>
    {% endif %}
  {% endfor %}
</div>

## Educational Technology

### Laboratory Development
- **Hands-on Learning**: Design of practical labs that reinforce theoretical concepts
- **Safety Integration**: Embedded safety protocols and risk management in lab design
- **Assessment Innovation**: Performance-based evaluation methods and peer learning

### Curriculum Design
- **Backward Design**: Starting with learning outcomes and working toward activities
- **Inclusive Pedagogy**: Accessible materials and multiple learning modalities
- **Industry Alignment**: Real-world applications and current technology integration

## Impact & Metrics

_Add quantitative and qualitative measures of educational impact:_
- Student enrollment and completion rates
- Learning outcome assessments
- Student feedback and testimonials
- Adoption by other institutions or instructors

## Professional Development

_List relevant teaching certifications, workshops, conferences, or continuing education in instructional design._