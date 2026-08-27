---
title: Projects
description: "Engineering projects spanning systems integration, mechatronics, and technical enablement."
---

# Engineering Projects

Project pages emphasize the problem, architecture, interfaces, implementation decisions, verification, and lessons that are most relevant to each system.

## Flagship Systems

<div class="project-grid">
	<div class="project-card">
		<img src="/assets/images/projects/surfer-fleet/surfer-on-water.webp" alt="SURFER autonomous vessel on the water" class="project-image" width="1600" height="1205" loading="lazy">
		<h3><a href="/projects/surfer-fleet/">SURFER Autonomous Vessel Fleet</a></h3>
		<p>20-vessel holonomic autonomous surface-vehicle fleet with dual-Pi control architecture, custom electronics, and hardware safety systems.</p>
		<p class="project-status"><strong>Deployed</strong> | Program: 2020–Present · My role: 2024–2026</p>
		<p><a href="/projects/surfer-fleet/">View project →</a></p>
	</div>
	<div class="project-card">
		<img src="/media/sentry/sentry-reveal-poster.webp" alt="SENTRY Autonomous Turret" class="project-image" width="412" height="232" loading="lazy">
		<h3><a href="/projects/sentry-v3/">SENTRY Autonomous Turret</a></h3>
		<p>Integrated electromechanical system combining embedded control, computer vision, and custom PCB design.</p>
		<p class="project-status"><strong>Deployed</strong> | 2023–2025</p>
		<p><a href="/projects/sentry-v3/">View project →</a></p>
	</div>
	<div class="project-card">
		<img src="/assets/images/projects/fusion-system-blocks/system-diagram.webp" alt="Fusion System Blocks" class="project-image" width="3032" height="1040" loading="lazy">
		<h3><a href="/projects/fusion-system-blocks/">Fusion System Blocks</a></h3>
		<p>Autodesk Fusion add-in embedding structured system-architecture diagrams inside Fusion designs — typed connections, rule checks, CAD links, and engineering exports.</p>
		<p class="project-status"><strong>Public Beta</strong> | 2025–Present</p>
		<p><a href="/projects/fusion-system-blocks/">View project →</a></p>
	</div>
	<div class="project-card">
		<img src="/assets/images/projects/stlink-v3mods/spark-board-perspective.webp" alt="SPARK Programming Board" class="project-image" width="1046" height="697" loading="lazy">
		<h3><a href="/projects/stlink-v3mods/">SPARK Programming Board</a></h3>
		<p>Custom development tool providing breakout access to JTAG/SWD, UART, SPI, I²C, and CAN interfaces. Beta hardware in bring-up.</p>
		<p class="project-status"><strong>Prototype</strong> | May 2025–Present</p>
		<p><a href="/projects/stlink-v3mods/">View project →</a></p>
	</div>
</div>

## Roadmaps & Concepts

Planned work and design direction — not deployed systems.

<div class="project-grid">
	<div class="project-card">
		<div class="placeholder-img">SENTRY V4 — layered perception, control, and safety architecture</div>
		<h3><a href="/projects/sentry-v4/">SENTRY V4 Roadmap</a></h3>
		<p>Planned ground-up redesign of the SENTRY platform with dedicated compute, control, and hardware-safety domains.</p>
		<p class="project-status"><strong>Concept</strong></p>
		<p><a href="/projects/sentry-v4/">View roadmap →</a></p>
	</div>
</div>

## Additional Engineering Work

Smaller tools, hardware, and infrastructure — compact summaries, linked where they live publicly.

### Engineering Tools

<div class="project-grid">
	<div class="project-card">
		<h3><a href="https://zcohen-nerd.github.io/connector-engineering-field-guide/">Connector Engineering Field Guide</a></h3>
		<p>Open-source reference for connector selection and interface engineering — professional/industrial and hobby guides covering selection workflow, datasheet interpretation, MIL-DTL-38999, M8/M12, checklists, comparison matrices, and connector ICDs.</p>
		<p class="project-status"><strong>Beta</strong> | <a href="https://github.com/zcohen-nerd/connector-engineering-field-guide">Source on GitHub</a></p>
	</div>
	<div class="project-card">
		<h3><a href="https://github.com/zcohen-nerd/PinmapGen">PinmapGen</a></h3>
		<p>Generates firmware pin-map code from Fusion 360 Electronics schematics — removing the error-prone manual step of transcribing pin assignments from the schematic into code every time the design changes.</p>
	</div>
	<div class="project-card">
		<h3><a href="https://github.com/zcohen-nerd/FusionToGitHub">FusionToGitHub</a></h3>
		<p>Fusion 360 add-in that backs up designs to GitHub with one click, keeping a complete version history of every save.</p>
	</div>
</div>

### Test & Educational Hardware

<div class="project-grid">
	<div class="project-card">
		<h3>PID Hover Rig</h3>
		<p>Ping-pong-ball levitation demonstrator designed end to end — mechanical, electrical, and hardware — as a hands-on PID controls teaching platform. Students implement the control loop on the real hardware as the core exercise.</p>
	</div>
	<div class="project-card">
		<h3><a href="/documentation/scholarship/">GNSS Flight-Controller Test Hardware</a></h3>
		<p>Experimental hardware and test campaigns behind the peer-reviewed ICUAS 2025 publication on GNSS emulation for flight-controller test and evaluation.</p>
	</div>
</div>

### Personal Engineering Infrastructure

<div class="project-grid">
	<div class="project-card">
		<h3>Home Automation &amp; Digital Twin Platform</h3>
		<p>Home Assistant–based residential controls and monitoring integrating HVAC, energy, solar, water, lighting, cameras, presence, network health, and ESP32/ESPHome sensors — with system-health dashboards, watchdogs, and resilient local automations.</p>
	</div>
	<div class="project-card">
		<h3>Nomad Offline Knowledge Node</h3>
		<p>Self-contained local knowledge and AI platform on compact hardware with redundant storage — preserving documentation and providing search and inference without cloud connectivity.</p>
	</div>
</div>
