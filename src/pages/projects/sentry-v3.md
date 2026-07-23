---
title: SENTRY Autonomous Turret
description: "Integrated electromechanical system combining embedded control, computer vision, and custom PCB design."
status: Deployed
displayDate: 2023–2025
---

# SENTRY V3: Deployed Mechatronics Platform

<video autoplay muted loop playsinline preload="metadata" width="412" height="232" poster="/media/sentry/sentry-reveal-poster.webp" style="display: block; width: auto; max-width: 100%; max-height: 360px; height: auto; border-radius: 8px; margin: 0 auto 0.75rem;">
  <source src="/media/sentry/sentry-reveal.webm" type="video/webm">
  <source src="/media/sentry/sentry-reveal.mp4" type="video/mp4">
</video>

<p style="text-align: center; margin: 0 0 2rem;"><em>The assembled SENTRY V3 pan–tilt turret platform (silent looping animation).</em></p>

## At a glance

- Used by 100+ students per year in its U.S. Naval Academy instructional deployment
- Originated at the U.S. Naval Academy and released publicly as open source
- Subject of a selected Autodesk University 2025 presentation ([From Schematics to Reality](/documentation/scholarship/))
- [View source on GitHub](https://github.com/zcohen-nerd/SENTRY)

## Overview

SENTRY V3 is an embedded electromechanical platform that integrates sensing, actuation, and control for a pan-tilt robotic turret system. The platform combines custom motor control electronics, sensor interfaces, and embedded firmware to coordinate flywheel propulsion, ammunition feeding, and two-axis positioning. The design supports modular expansion and allows higher-level compute systems to command the platform while the embedded controller handles real-time motor control and safety behavior.

## Problem

Earlier versions of the platform relied on ad-hoc wiring and distributed control logic, which made integration, testing, and debugging difficult. The V3 design consolidates motor control, sensor interfaces, and safety handling into a dedicated embedded controller, creating a more maintainable architecture for experimentation and development.

## System Architecture

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/Functional Block Diagram.png">
  <img src="/assets/images/projects/SENTRY/Functional Block Diagram.png" alt="SENTRY functional block diagram" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 1rem auto 1.5rem;">
</a>

## Hardware Design

The mechanical and electrical design of SENTRY V3 was developed together so the control board, drivetrain, sensor placement, and service access all supported reliable integration. The platform layout emphasizes subsystem separation, maintainable wiring, and clear mechanical paths for actuation and feed components.

**CAD assembly overview**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY Turret-EDIT.jpg">
  <img src="/assets/images/projects/SENTRY/SENTRY Turret-EDIT.jpg" alt="SENTRY V3 CAD assembly overview" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 1rem auto 1.5rem;" loading="lazy">
</a>

**Labeled subsystem view**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY Turret Labeled.png">
  <img src="/assets/images/projects/SENTRY/SENTRY Turret Labeled.png" alt="SENTRY V3 labeled CAD view" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 0 auto 1.5rem;" loading="lazy">
</a>

## Interfaces

- **Power interfaces:** Single DC input supplying the platform, with onboard regulation providing local 5 V and 3.3 V rails for logic, sensors, and motor drivers.
- **Data interfaces:** I²C bus for onboard sensors and analog expansion, along with USB or serial communication to an external host computer used for higher-level control and perception.
- **Control interfaces:** PWM and digital GPIO used for motor drivers and actuators, with additional GPIO inputs for system triggers and safety control.

## Key Design Decisions

- **Decision:** Separate high-level control from real-time motor control.
  **Rationale:** Allow external compute systems to handle perception and targeting while the embedded controller manages timing-critical motor control and safety behavior.
- **Decision:** Use a microcontroller-based control board (RP2040) for actuator coordination.
  **Rationale:** Provide deterministic timing for motor control, sensor polling, and actuator sequencing without relying on a general-purpose host computer.
- **Decision:** Place sensors and auxiliary devices on a shared I²C bus.
  **Rationale:** Reduce wiring complexity and allow new sensors to be added without redesigning the control architecture.
- **Decision:** Use discrete motor drivers for pan, tilt, flywheel, and feed mechanisms.
  **Rationale:** Allow each subsystem to be controlled and tuned independently while simplifying debugging during bring-up.
- **Decision:** Integrate current monitoring on the flywheel drive.
  **Rationale:** Detect projectile events through current spikes, enabling reliable shot counting without additional sensors.

## Implementation

- Custom control PCB integrating motor drivers, sensor interfaces, and power regulation for turret subsystems.
- Embedded firmware running on the RP2040 that coordinates flywheel spin-up, ammunition feed control, and pan–tilt positioning.
- I²C sensor integration for orientation and system monitoring, with current sensing used to detect projectile events during firing.
- Integration with an external compute platform responsible for vision processing and target selection while the embedded controller manages real-time actuation.

**Cross-section view**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY Cross Section blur.png">
  <img src="/assets/images/projects/SENTRY/SENTRY Cross Section blur.png" alt="SENTRY V3 CAD cross section" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 1rem auto 1.5rem;" loading="lazy">
</a>

**Labeled cross-section**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY Turret Cross Section Labeled.png">
  <img src="/assets/images/projects/SENTRY/SENTRY Turret Cross Section Labeled.png" alt="SENTRY V3 labeled CAD cross section" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 0 auto 1.5rem;" loading="lazy">
</a>

### Artifacts

**Control board integration**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY Board-EDIT.jpg">
  <img src="/assets/images/projects/SENTRY/SENTRY Board-EDIT.jpg" alt="SENTRY V3 control board integration view" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 1rem auto 1.5rem;" loading="lazy">
</a>

**PCB layout**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY PCB.png">
  <img src="/assets/images/projects/SENTRY/SENTRY PCB.png" alt="SENTRY V3 PCB layout" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 0 auto 1.5rem;" loading="lazy">
</a>

**Labeled PCB**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/sentry-pcb-labeled.webp" title="Open full-resolution labeled PCB layout">
  <img src="/assets/images/projects/SENTRY/sentry-pcb-labeled.webp" alt="SENTRY V3 labeled PCB layout" width="2179" height="1759" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 0 auto 1.5rem;" loading="lazy">
</a>

**Electronics schematic**

<a href="https://portfolio.zcohen-nerd.com/assets/images/projects/SENTRY/SENTRY Schematic.png">
  <img src="/assets/images/projects/SENTRY/SENTRY Schematic.png" alt="SENTRY V3 electronics schematic" style="display: block; width: auto; max-width: 100%; max-height: 420px; height: auto; border-radius: 8px; margin: 0 auto 1.5rem;" loading="lazy">
</a>

## Testing & Verification

- Bench testing and bring-up were performed using logic analysis, current monitoring, and iterative firmware tuning.
- Flywheel current sensing was verified as a projectile-event detector — current spikes provide shot counting without dedicated sensors.
- The platform's classroom deployment (100+ students per year at the U.S. Naval Academy) exercises the integrated system across repeated build-and-run cycles.

## Lessons Learned

- Separating high-level control from real-time actuation simplifies system behavior and makes debugging significantly easier.
- Current sensing can serve as a reliable proxy for mechanical events when adding dedicated sensors would increase complexity.
- Integrating multiple motor-driven subsystems requires careful sequencing and state management to prevent unexpected interactions between actuators.
- Early bring-up instrumentation (current monitoring, logic analysis, and serial diagnostics) greatly reduces iteration time during firmware development.
- Designing the control board with spare interfaces and expansion capability makes it easier to add sensors and experiment with new control strategies.

## What comes next

The deployed V3 platform established the mechanical, electrical, embedded, and controls architecture described above. A separate V4 roadmap explores a ground-up redesign — layered perception, compute, control, and safety domains — carrying forward the lessons from V3 deployment. V4 is planning-stage work, not a shipped system.

[View the SENTRY V4 roadmap →](/projects/sentry-v4/)

---

**Project Status:** <span class="status-badge">Deployed</span> | **Timeline:** 2023–2025

[← Back to Projects](/projects/) | [Next Project: SPARK Programming Board →](/projects/stlink-v3mods/)
