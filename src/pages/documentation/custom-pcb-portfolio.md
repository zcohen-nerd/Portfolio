---
title: Custom PCB Portfolio — Evidence Appendix
description: "Evidence basis for the '30+ custom PCBs designed and deployed' claim: the boards with public repositories or case studies, and the categories of institutional work that make up the rest."
---

# Custom PCB Portfolio — Evidence Appendix

The [About page](/about/) and [home page](/) state **30+ custom PCBs designed and
deployed**. That figure is from the [résumé](pathname:///files/zac-cohen-resume.pdf),
where it appears in the U.S. Naval Academy role (2023–2026) and again in the
consulting-engagement summary. This page shows what backs it: the boards that
have a public repository or a case study, and the categories of institutional
work that make up the remainder.

## What this page is and isn't

- It is **not** a schematic or layout dump. Institutional and employer designs
  stay closed; only what has already been published elsewhere is linked.
- Every row has a **known evidence basis** — a public repo, a portfolio case
  study, a peer-reviewed publication, or the résumé as the record of employment.
- **Ownership is not blurred.** The U.S. Naval Academy work was done as a USNA
  employee; USNA owns those designs. SENTRY was *released publicly by the
  institution* (USNA WRCE) under GPL-3.0. SURFER is a USNA research program.
  SPARK, Fusion System Blocks, and the teaching rigs are the author's own.

## Individually documented boards

| Board / system | ~Year | Purpose | Role | Maturity / state | Public evidence |
|---|---|---|---|---|---|
| **SURFER — battery-monitor & vessel-Pi supply** | 2024–2025 | 18 V DeWalt-pack low-voltage monitoring; dedicated 5 V rail for the vessel Raspberry Pi | Sole designer — schematic, layout, firmware | **Deployed** — 20-vessel fleet, repeated live-water | [SURFER case study](/projects/surfer-fleet/) |
| **SURFER — safety-relay controller (ATtiny85)** | 2024–2025 | Latches the propulsion relay; e-stop debounce; vessel-Pi heartbeat; warning light; default-disabled propulsion | Sole designer — schematic, layout, firmware | **Deployed** | [SURFER case study](/projects/surfer-fleet/) |
| **SURFER — power-distribution board** | 2024–2025 | Separates propulsion, LED, and research-electronics supply paths; DC-DC conversion | Sole designer | **Deployed** | [SURFER case study](/projects/surfer-fleet/) |
| **SURFER — CAN interface board** | 2024–2025 | Vessel CAN bus interface between the control Pi and the propulsion / sensing electronics | Sole designer | **Deployed** | [SURFER case study](/projects/surfer-fleet/) |
| **SENTRY V3 control PCB (RP2040)** | 2023–2025 | Consolidates motor control, sensing, and safety for a pan-tilt turret into one embedded controller | Electromechanical + PCB architecture; reference firmware | **Deployed** — USNA EW309, 100+ students/yr; released publicly by USNA WRCE | [github.com/zcohen-nerd/SENTRY](https://github.com/zcohen-nerd/SENTRY) (GPL-3.0) · [SENTRY case study](/projects/sentry-v3/) |
| **SPARK — STLINK-V3MODS breakout** | 2025–present | Protected debug-probe interface: eFuse power entry, switched target rails, hybrid level translation, CAN FD | Sole designer — schematic, 4-layer PCB, fabrication package | **Prototype** — design complete; no fabrication, assembly, or measurement records published | [github.com/zcohen-nerd/SPARK](https://github.com/zcohen-nerd/SPARK) (CERN-OHL-S-2.0) · [SPARK case study](/projects/stlink-v3mods/) |
| **PID Hover Rig control board** | teaching platform | Fan drive and sensor interface for a ping-pong-ball PID-levitation demonstrator; students close the loop on the hardware | Sole designer | Instructional platform in use | Résumé, *Selected Projects*; no public repo |

## Institutional work — no separate public repository

These are the categories of USNA-owned boards behind the aggregate count. They
are not individually published because they are institutional designs; the
résumé and the USNA employment record are the evidence basis.

| Category | ~Year | Purpose | Role | State | Evidence basis |
|---|---|---|---|---|---|
| Autonomous-surface-vessel sensor & payload-interface boards (beyond the four SURFER boards above) | 2023–2026 | Standardized sensor / payload / communications interfaces replicated across the 20-vessel fleet | Designer | Deployed (institutional) | [Résumé](pathname:///files/zac-cohen-resume.pdf) — USNA role; [SURFER case study](/projects/surfer-fleet/) describes the fleet |
| Robotics-lab motion-control & power-distribution boards | 2023–2026 | Motor control, power distribution, and embedded processing for faculty and cadet robotics projects | Designer | Deployed / instructional (institutional) | Résumé — USNA role |
| Research & test-fixture boards | 2023–2026 | Experimental hardware behind peer-reviewed work on GNSS flight-controller evaluation and support-free additive manufacturing | Hardware designer & test lead | Research (published, co-author) | [Scholarship & Speaking](/documentation/scholarship/) — the boards themselves are not separately published |
| Engineering-lab / classroom PCB-prototyping boards | 2012–2022 | Instructional electronics for the fabrication labs and curricula built for several high-school programs | Designer / instructor | Instructional | Résumé — *Engineering Teacher & Program Lead* role |

## Reading the number

Seven boards are individually documented above (four deployed on SURFER, one
deployed on SENTRY, one prototype on SPARK, one teaching rig). The remaining
count is institutional work across the USNA autonomous-marine and robotics
platforms and years of engineering-lab teaching — recorded in the résumé rather
than published board-by-board, because those designs are owned by the
institutions they were built for.

## Related work

- [SURFER Autonomous Vessel Fleet](/projects/surfer-fleet/) — four of the deployed boards in context, with the vessel architecture they support.
- [SENTRY V3](/projects/sentry-v3/) — the one deployed board with a full public repository.
- [SPARK Programming Board](/projects/stlink-v3mods/) — the interface hardware that de-risks exactly this kind of board bring-up.
