---
title: Teaching & Education
description: "Curriculum development, lab design, and instructional technology for engineering education."
layout: default
permalink: /teaching/
show_title: false
---

# Teaching & Educational Impact

My teaching focuses on helping students move beyond simply learning tools and toward thinking like engineers.  
Across courses in CAD, digital design, and mechatronics, I design learning experiences that bridge theoretical concepts with real-world engineering practice.

Many of my students are preparing for careers in manufacturing, robotics, and electromechanical systems. My goal is to ensure they leave the classroom not just knowing how to operate software or hardware, but understanding how engineering decisions affect the systems they will build and maintain.

Related leadership work in student engineering environments is highlighted in [FIRST Robotics Competition]({{ '/frc/' | relative_url }}).

## Teaching Philosophy

Engineering is best learned by building, testing, and iterating. While theoretical foundations are important, real understanding emerges when students apply those concepts to physical systems and encounter the kinds of constraints engineers face in practice.

My courses emphasize:

- **Project-based learning** that mirrors real engineering workflows  
- **Hands-on experimentation** with hardware and digital tools  
- **Iterative design** where students refine solutions through testing and feedback  

Students are encouraged to approach problems the way practicing engineers do: defining requirements, evaluating trade-offs, documenting decisions, and learning from failure.

As both a practicing engineer and an educator, I intentionally integrate real industry practices into coursework so students gain experience with the tools, processes, and mindset used in professional engineering environments.

## Current Courses & Modules

<div class="project-grid">
  {% for teaching_file in site.pages %}
    {% if teaching_file.path contains 'teaching/' and teaching_file.path != 'teaching/index.md' %}
      {% assign teaching_title = teaching_file.title | default: teaching_file.name %}
      <div class="project-card">
        {% if teaching_file.path == 'teaching/instructional-design.md' %}
          <img src="https://zcohen-nerd.github.io/computer_literacy_for_kids/img/hero-image.png" alt="Computer Literacy for Kids curriculum preview" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;" loading="lazy">
        {% elsif teaching_file.path == 'teaching/ent260-solidworks.md' %}
          <img src="{{ '/assets/images/Teaching/ent-260.png' | relative_url }}" alt="ENT260 course preview" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;" loading="lazy">
        {% else %}
          <div class="placeholder-img">
            📚 {{ teaching_title }} Materials
          </div>
        {% endif %}
        <h3><a href="{{ teaching_file.url | relative_url }}">{{ teaching_title }}</a></h3>
        <p>Course materials, learning objectives, and example projects demonstrating how students apply engineering concepts through hands-on design and modeling.</p>
        <p><a href="{{ teaching_file.url | relative_url }}">Learn more →</a></p>
      </div>
    {% endif %}
  {% endfor %}
</div>

## Educational Technology

### Laboratory Development

Hands-on laboratories are central to my teaching approach. I design labs that allow students to directly interact with the systems they are studying, reinforcing theoretical concepts through experimentation.

Key principles include:

- **Hands-on learning** through physical systems and practical experimentation  
- **Integrated safety practices** embedded directly into laboratory workflows  
- **Performance-based evaluation** where students demonstrate understanding through completed designs and working systems  

### Curriculum Design

Courses are structured to support both conceptual understanding and practical application.

- **Backward design**: defining learning outcomes first and building activities to support them  
- **Multiple learning modalities** including visual modeling, physical systems, and guided experimentation  
- **Industry alignment** through the use of professional tools and real-world engineering examples  

## Impact & Metrics

My teaching has focused on helping students build practical engineering skills that transfer directly into industry and further study.

Areas of impact include:

- Preparing mechatronics students to use professional CAD tools such as SolidWorks  
- Developing hands-on laboratory experiences that reinforce system-level thinking  
- Supporting student success in project-based engineering courses  

## Professional Development

I continually refine my teaching through both professional engineering work and ongoing involvement in technical education.

Relevant experience includes:

- Adjunct faculty in engineering technology and solid modeling  
- Development of project-based engineering curricula  
- Mentoring students in hands-on engineering design and fabrication
