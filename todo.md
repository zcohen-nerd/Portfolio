# Portfolio Improvement TODO

This document tracks updates needed to improve the clarity, credibility, and engineering signal of the portfolio.

Primary goals:

- Remove unfinished projects
- Reduce generic AI-style text
- Emphasize real engineering decisions
- Add system architecture visuals
- Highlight systems integration experience

---

# GLOBAL SITE IMPROVEMENTS

## Rewrite hero section slightly

Current tone is good but still a bit generic.

Adjust wording to emphasize:

- systems integration
- hardware + firmware + mechanical
- real prototypes and test setups

Add something like:

"Most of my work involves turning partially defined concepts into working physical systems, building the tools and infrastructure required to test and validate them."

---

## Add "Engineering Focus" section under hero

Add a short list that helps recruiters categorize your skills quickly.

Example:

Engineering Focus

- Embedded systems
- Electromechanical system integration
- PCB design and bring-up
- Embedded debugging infrastructure
- Rapid prototyping and hardware validation
- Control systems and actuation
- Test platform development

---

## Add diagrams to the site

At least one diagram per major project.

Priority projects:

SENTRY  
SPARK  
Autonomous Surfer Fleet

Preferred diagram types:

- System architecture diagram
- Hardware architecture diagram
- Control flow diagram

Diagrams should be exported from yEd.

---

## Reduce generic "Core domains" text

Current cards show things like:

Core domains: PCB, embedded firmware, controls, integration, test

Keep them but tighten wording to:

Core domains: embedded systems, PCB design, actuation control, system integration

Avoid long lists.

---

# PROJECT SECTION CHANGES

## REMOVE PROJECT

Delete completely:

PID Trainer & Lab Module

Actions:

- Remove from Featured Systems
- Delete project page if it exists
- Remove any navigation links

Reason:

Project is not mature enough for portfolio inclusion.

---

# FEATURED SYSTEMS SECTION

After removal of PID Trainer, the featured projects should be:

1. SENTRY
2. Autonomous Surfer Fleet
3. SPARK
4. Smart Home System

Order recommendation:

1. SENTRY
2. SPARK
3. Autonomous Surfer Fleet
4. Smart Home System

Reason:

Front-load embedded hardware work.

---

# SENTRY PROJECT PAGE

Add sections if not present:

Problem  
System Architecture  
Hardware Design  
Safety Architecture  
Implementation  
Lessons Learned

Add diagrams:

- System architecture
- Hardware architecture
- Control flow

Mention explicitly:

- motor drivers
- sensors
- safety systems
- embedded control
- integration challenges

---

# SPARK PROJECT PAGE

Add a section:

Hardware Architecture Highlights

Content should mention:

- hardened signal path
- hybrid level translation strategy
- switchable target power rails
- ESD protection
- 4-layer PCB design

Add diagrams:

- debug signal flow
- hardware architecture

Add images:

- PCB render
- assembled board
- debugging setup photo

---

# AUTONOMOUS SURFER FLEET PAGE

Strengthen the systems engineering story.

Add sections:

System Architecture  
Distributed Control Model  
Power Distribution  
Communication Architecture  
Integration Challenges

Mention:

- Raspberry Pi architecture
- power management
- communications
- control integration

Add diagram:

Fleet architecture diagram.

---

# SMART HOME SYSTEM PAGE

Keep this project but position it as:

Systems engineering and infrastructure design.

Add sections:

System Architecture  
Reliability Strategy  
Monitoring and Observability  
Automation Design

Mention:

- Home Assistant architecture
- monitoring tools
- redundancy
- failure handling

---

# ADD NEW SECTION TO FRONT PAGE

Add below Featured Systems:

## Engineering Approach

Short paragraph:

"My work focuses on building reliable electromechanical systems by defining clear interface boundaries between hardware, firmware, and mechanical structures. I prioritize modular architectures that allow systems to evolve without requiring complete redesign."

---

# OTHER WORK SECTION

Keep but clarify scope.

Rename to:

Tools and Supporting Work

Include:

- Fusion System Blocks
- Documentation Library
- Teaching Portfolio

These should be secondary to hardware projects.

---

# PROJECT PAGE CONSISTENCY

Every project page should follow the same structure:

Overview  
Problem  
System Architecture  
Hardware Design  
Implementation  
Lessons Learned

Consistency makes the portfolio feel more professional.

---

# ADD "LESSONS LEARNED" TO EVERY PROJECT

Hiring managers love this.

Examples:

- signal integrity issues discovered
- power sequencing problems
- integration constraints
- debugging challenges

---

# ADD VISUAL CREDIBILITY

Minimum per project:

1 architecture diagram  
1 hardware image  
1 implementation photo

Hardware portfolios without images feel weak.

---

# FINAL QUALITY CHECK

Before publishing updates:

- remove all "TBD" language
- eliminate placeholder phrasing
- reduce passive voice
- avoid marketing tone

Goal:

Make the writing read like an engineer describing real work.

---

# LONG TERM ADDITIONS (OPTIONAL)

Possible future projects to add:

- SENTRY V4 redesign
- SPARK V0.4 production version
- drone platform (Artemis lab concept)
- custom power supply project

Only add projects when they have:

- working hardware
- photos
- architecture diagrams