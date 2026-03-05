---
title: SENTRY Autonomous Turret
description: "Integrated electromechanical system combining embedded control, computer vision, and custom PCB design."
layout: default
permalink: /projects/sentry-v3/
tags: [embedded, production, mechatronics]
status: "In Production"
timeline: "2023-2024"
show_title: false
---

# Sentry V3: Production Embedded Actuation System

<img src="{{ '/assets/images/project-placeholder.svg' | relative_url }}" alt="Sentry V3 System Overview" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin-bottom: 2rem;">

## Overview

Sentry V3 is an embedded electromechanical actuation platform for rugged automation environments. The system combines custom control electronics, safety logic, communications interfaces, and a sealed mechanical enclosure. It was developed as a modular platform so control nodes can be configured for different channel counts and integration needs.

## Problem

The project addressed replacement of legacy pneumatic actuation hardware in production settings where downtime and field service complexity were high. The new design needed deterministic control behavior, hardware-level safety interlocks, and compatibility with existing PLC and SCADA infrastructure.

## System Architecture

<img src="{{ '/assets/images/diagram-placeholder.svg' | relative_url }}" alt="Sentry V3 System Architecture" style="width: 100%; max-width: 1000px; height: auto; border-radius: 8px; margin: 1rem 0;">

The architecture uses a dual-controller topology connected to distributed I/O, with an independent safety path separated from the primary control path. Communications are split between field control traffic and diagnostics interfaces.

**Main components**
- Control electronics with STM32-based processing
- Distributed digital/analog I/O interfaces
- Power conversion and isolation stages
- Safety monitoring and emergency-stop handling
- Field communications (CANopen and Modbus TCP)

**Hardware and software interfaces**
- Control loop execution in RTOS tasks
- CAN network integration with industrial controllers
- Local diagnostics over USB/Ethernet
- Safety inputs cross-checked independently of normal control logic

**Diagram references**
- System diagram: `assets/images/diagram-placeholder.svg`
- PCB/photo placeholder: `assets/images/project-placeholder.svg`

## Key Design Decisions

- **Dual-redundant control topology:** Selected to keep critical actuation available if one processing path faults.
- **Distributed I/O architecture:** Reduced harness complexity and improved field replacement workflow.
- **6-layer PCB stackup with controlled impedance:** Supported mixed-signal routing and robust CAN signaling.
- **Independent hardware interlocks:** Kept critical shutdown behavior available even if application firmware is compromised.
- **Sealed die-cast enclosure approach:** Matched the environmental and mounting constraints stated in the original requirements.

## Implementation

Implementation included electrical, firmware, and integration work across prototype and production-prep phases.

- PCB development with isolated power domains, protected transceivers, and test access for manufacturing.
- Firmware built around RTOS scheduling, state-machine control, watchdog supervision, and fault handling.
- Model-based and hardware-in-the-loop validation used during controller development.
- Manufacturing handoff work included in-circuit test planning, coating/process decisions, and traceability marking.
- Design reviews (SRR/PDR/CDR/PRR) were used to gate requirements, architecture, and release readiness.

## Lessons Learned

- Designing for testability early simplified manufacturing ramp and debug.
- Serviceability requirements should be defined before enclosure and connector architecture are fixed.
- Conservative component choices reduced supply-chain risk during build cycles.
- Separating safety pathways from application control logic reduced integration risk across revisions.

---

**Project Status:** <span class="status-badge">Production Deployment</span> | **Timeline:** January 2023 - March 2024

[← Back to Projects]({{ '/projects/' | relative_url }}) | [Next Project: Surfer Fleet →]({{ '/projects/surfer-fleet/' | relative_url }})
