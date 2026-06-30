# Controlled Random Experience Engine

A consent-first, safety-focused planning tool that generates randomized sessions only from pre-approved activities.

The engine uses:

- safety filters for approval, hard limits, excluded tags, max intensity, category repetition, cooldown, and aftercare
- weighted randomness using state, novelty, feedback, and intensity-curve modifiers
- Monte Carlo simulation metrics for duration, intensity, category frequency, violations, cooldown compliance, repetition, novelty, and entropy
- optional pandas/matplotlib analytics charts and openpyxl Excel export

## Quick Start

From the repository root:

```powershell
python project/src/cli.py validate
python project/src/cli.py generate --seed 7
python project/src/cli.py simulate --runs 10000
python project/src/cli.py analytics --runs 1000
python project/src/cli.py export-session --output-prefix project/session_output --excel
```

If `python` is not on PATH, use your virtual environment or another Python executable.

## Tests

```powershell
python -m pytest project/tests -q
```

The test suite covers approval filters, hard-limit exclusion, max intensity, cooldown insertion, impossible-session errors, and Monte Carlo metric shape.
