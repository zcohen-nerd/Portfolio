---
title: Autonomous Surfer Fleet
description: "Maritime autonomous vehicle platform with advanced power management and satellite communications."
layout: default
permalink: /projects/surfer-fleet/
tags: [autonomous, maritime, power-systems]
status: "Pilot Deployment"
timeline: "2022-2025"
show_title: false
---

# Autonomous Surfer Fleet: Maritime Autonomy Platform

<img src="{{ '/assets/images/project-placeholder.svg' | relative_url }}" alt="Autonomous Surfer Fleet Overview" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin-bottom: 2rem;">

## Overview

The Surfer Fleet project is an autonomous surface vehicle platform for long-duration maritime monitoring. It combines a marine power subsystem, onboard autonomy, and remote telemetry for field operations. The platform is structured to support modular payload integration and coordinated multi-vehicle missions.

## Problem

Ocean monitoring programs needed persistent data collection in locations where crewed vessel operations are expensive and difficult to schedule. The system therefore had to balance energy availability, autonomy, and communications reliability in a marine environment.

## System Architecture

<img src="{{ '/assets/images/diagram-placeholder.svg' | relative_url }}" alt="Surfer Fleet System Architecture" style="width: 100%; max-width: 1000px; height: auto; border-radius: 8px; margin: 1rem 0;">

The architecture is organized around four subsystems: power, navigation/autonomy, communications, and payload/data logging.

**Main components**
- Solar charging and battery storage subsystem
- GNSS/IMU/radar/vision sensor stack
- Multi-layer autonomy and mission planning software
- Satellite and local mesh communications links
- Modular payload interface for sensing packages

**Hardware and software interfaces**
- Sensor fusion feeds navigation and path-planning layers
- Mission planning coordinates with fleet-level task allocation
- Telemetry and command data pass through satellite/mesh communications
- Payload data is logged locally and forwarded through comms links

**Diagram references**
- System diagram: `assets/images/diagram-placeholder.svg`
- Power/configuration image: `assets/images/project-placeholder.svg`

## Key Design Decisions

- **Hybrid solar-battery power system:** Chosen to support long mission windows without continuous shore support.
- **Layered autonomy model:** Split reactive, tactical, and strategic control to separate fast safety actions from slower mission logic.
- **Satellite plus mesh communications:** Added resilience for remote operations and local coordination.
- **Modular payload interface:** Allowed mission-specific instrumentation changes without redesigning core control hardware.

## Implementation

Implementation covered hull/platform integration, embedded electronics, control software, and field validation workflow.

- Power subsystem integrated MPPT charging, battery management, and adaptive power budgeting.
- Navigation stack combined GNSS/INS with collision-avoidance and route planning methods.
- Communications stack used satellite messaging plus local radio links with retry/fault-tolerance behaviors.
- Development and validation used simulation, hardware-in-the-loop testing, controlled water testing, and iterative field trials.

## Lessons Learned

- Marine power management and communications reliability need to be designed together, not as separate workstreams.
- Fleet behavior is easier to maintain when vehicle-level and fleet-level decisions are explicitly separated.
- Field operations benefit from strong diagnostics and recovery procedures built into baseline firmware.
- Early planning for payload interfaces reduced rework when adding new sensing missions.

---

**Project Status:** <span class="status-badge">Active Deployment</span> | **Timeline:** June 2022 - Present

[← Previous: Sentry V3]({{ '/projects/sentry-v3/' | relative_url }}) | [Next Project: Smart Home →]({{ '/projects/smart-home-system/' | relative_url }})
