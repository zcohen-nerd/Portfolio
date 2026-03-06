---
title: Autonomous Surfer Fleet
description: "Maritime autonomous vehicle platform with advanced power management systems."
layout: default
permalink: /projects/surfer-fleet/
tags: [autonomous, maritime, power-systems]
status: "Class Deployment"
timeline: "2023-2025"
show_title: false
featured: true
weight: 2
---

# Autonomous Surfer Fleet: Maritime Autonomy Platform

<img src="{{ '/assets/images/project-placeholder.svg' | relative_url }}" alt="Autonomous Surfer Fleet Overview" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin-bottom: 2rem;">

## Overview

The SURFER Fleet project is a small autonomous surface-vehicle platform developed for robotics experimentation and education. Each vessel integrates onboard compute, propulsion control, power distribution, and sensor interfaces in a modular architecture that allows students to develop and test autonomy algorithms on real hardware.

The platform separates system management from student code, allowing experimentation with navigation and control algorithms without compromising core safety and vessel operation.

## Problem

Early vessel prototypes relied on ad-hoc wiring and single-computer architectures, which made development fragile and difficult to maintain across multiple vehicles. A more structured platform was needed that could support repeatable builds, safe operation, and parallel student development while maintaining centralized control over propulsion and emergency stop behavior.

## System Architecture

<img src="{{ '/assets/images/diagram-placeholder.svg' | relative_url }}" alt="SURFER Fleet System Architecture" style="width: 100%; max-width: 1000px; height: auto; border-radius: 8px; margin: 1rem 0;">

```mermaid
flowchart LR
  BAT[Battery System] --> PWR[Power Distribution Board]
  PWR --> PI1[System Raspberry Pi]
  PWR --> PI2[Student Raspberry Pi]
  PWR --> ESC[Motor Controllers]
  ESC --> THR[Thrusters]

  PI1 <--> PI2
  PI1 --> RELAY[Safety Relay / E-Stop Control]
  RELAY --> ESC

  SENS[Navigation & Environmental Sensors] --> PI1
  PI2 --> NAV[Student Navigation / Autonomy Code]
  
## Interfaces

- **Power interfaces:** Battery input distributed through an onboard power distribution board supplying compute nodes, motor controllers, and auxiliary electronics.
- **Data interfaces:** Ethernet and serial communication between onboard computers, along with sensor interfaces for navigation and system monitoring.
- **Control interfaces:** Motor controllers driven through the system control node, with relay-based safety shutdown paths that can immediately disable propulsion while leaving onboard compute powered.

## Key Design Decisions

- **Decision:** Separate system control and student compute onto two Raspberry Pi nodes.
  **Rationale:** Allows students to develop autonomy software without risking the stability of core vessel systems.
- **Decision:** Implement relay-based propulsion shutdown through an emergency stop circuit.
  **Rationale:** Ensure thrusters can be disabled immediately while keeping onboard computers powered to prevent data corruption.
- **Decision:** Centralize power distribution on a dedicated board.
  **Rationale:** Simplify wiring across multiple vessels and make system bring-up and maintenance more repeatable.
- **Decision:** Maintain identical hardware architecture across the fleet.
  **Rationale:** Allow the same software and experiments to run across multiple vessels without platform-specific changes.

## Implementation

- Designed and assembled multiple small autonomous vessels with standardized propulsion, compute, and power architectures.
- Integrated dual Raspberry Pi systems on each vessel: a system node responsible for core operation and a separate node used for student autonomy development.
- Developed power distribution hardware with relay-controlled propulsion shutdown tied to emergency stop systems.
- Built the platform to support swarm robotics experiments where multiple vessels can be operated and programmed simultaneously.

### Artifacts

- Hull/platform photo: (TBD: add image in `assets/images/projects/surfer-fleet/`)
- Electronics layout: (TBD: add image in `assets/images/projects/surfer-fleet/`)
- Bench integration setup: (TBD: add photo in `assets/images/projects/surfer-fleet/`)
- Field test setup: (TBD: add photo in `assets/images/projects/surfer-fleet/`)

## Testing & Verification

- Power distribution and propulsion shutdown verification across each vessel
- Dual-compute communication validation between system and student nodes
- Thruster control and maneuvering tests in controlled water environments
- Multi-vessel testing during swarm robotics experiments

## Lessons Learned

- Separating system infrastructure from student development environments significantly improves reliability during experimentation.
- Standardizing vessel hardware across the fleet simplifies both maintenance and software development.
- Emergency stop systems should disable propulsion without cutting power to onboard compute to prevent filesystem corruption.
- Designing for maintainability across multiple vessels becomes more important than optimizing any single platform.

---

**Project Status:** <span class="status-badge">Active Deployment</span> | **Timeline:** June 2022 - Present

[← Previous: Sentry V3]({{ '/projects/sentry-v3/' | relative_url }}) | [Next Project: Smart Home →]({{ '/projects/smart-home-system/' | relative_url }})
