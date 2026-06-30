"""Charting utilities for simulation outputs."""

from __future__ import annotations

import random
from collections import Counter
from dataclasses import replace
from pathlib import Path
from typing import Iterable

try:
    from .generator import SessionGenerationError, generate_session
    from .models import Activity, FeedbackEntry, Rules, StateInput
    from .simulator import run_simulations
    from .validators import validate_session
except ImportError:  # pragma: no cover - supports direct script execution
    from generator import SessionGenerationError, generate_session
    from models import Activity, FeedbackEntry, Rules, StateInput
    from simulator import run_simulations
    from validators import validate_session


def generate_charts(
    activities: Iterable[Activity],
    rules: Rules,
    state: StateInput,
    feedback: Iterable[FeedbackEntry] | None = None,
    runs: int = 1_000,
    output_dir: str | Path = "analytics_output",
    seed: int | None = None,
) -> list[Path]:
    """Generate analytics charts and return written file paths."""

    pd, plt = _load_charting_dependencies()
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    records = _simulation_records(list(activities), rules, state, list(feedback or []), runs, seed)
    if not records:
        raise RuntimeError("no successful sessions were generated for analytics")

    frame = pd.DataFrame(records)
    chart_paths: list[Path] = []

    chart_paths.append(_intensity_histogram(frame, plt, output_path))
    chart_paths.append(_category_usage(frame, plt, output_path))
    chart_paths.append(_duration_distribution(frame, plt, output_path))
    chart_paths.append(_constraint_summary(frame, plt, output_path))
    chart_paths.append(_activity_heatmap(frame, plt, output_path))
    chart_paths.append(_curve_comparison(list(activities), rules, state, list(feedback or []), runs, seed, pd, plt, output_path))
    return chart_paths


def _simulation_records(
    activities: list[Activity],
    rules: Rules,
    state: StateInput,
    feedback: list[FeedbackEntry],
    runs: int,
    seed: int | None,
) -> list[dict[str, object]]:
    rng = random.Random(seed)
    rows: list[dict[str, object]] = []
    for run_index in range(1, runs + 1):
        try:
            session = generate_session(activities, rules, state, feedback, rng)
            validation = validate_session(session, rules)
        except SessionGenerationError:
            rows.append({"run": run_index, "constraint_status": "failed_generation"})
            continue

        for step in session.steps:
            rows.append(
                {
                    "run": run_index,
                    "constraint_status": "valid" if validation.ok else "invalid",
                    "duration": session.total_duration_min,
                    "activity_id": step.activity.id,
                    "activity_name": step.activity.name,
                    "category": step.activity.category,
                    "intensity": step.activity.intensity,
                    "order": step.order,
                }
            )
    return rows


def _intensity_histogram(frame, plt, output_path: Path) -> Path:
    valid = frame.dropna(subset=["intensity"])
    path = output_path / "intensity_histogram.png"
    plt.figure(figsize=(8, 5))
    valid["intensity"].astype(int).hist(bins=[0.5, 1.5, 2.5, 3.5, 4.5, 5.5], rwidth=0.85)
    plt.title("Intensity Histogram")
    plt.xlabel("Intensity")
    plt.ylabel("Activity Count")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()
    return path


def _category_usage(frame, plt, output_path: Path) -> Path:
    path = output_path / "category_usage.png"
    counts = frame.dropna(subset=["category"])["category"].value_counts()
    plt.figure(figsize=(9, 5))
    counts.plot(kind="bar")
    plt.title("Category Usage")
    plt.xlabel("Category")
    plt.ylabel("Activity Count")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()
    return path


def _duration_distribution(frame, plt, output_path: Path) -> Path:
    path = output_path / "session_duration_distribution.png"
    durations = frame.dropna(subset=["duration"]).drop_duplicates("run")["duration"]
    plt.figure(figsize=(8, 5))
    durations.hist(bins=15)
    plt.title("Session Duration Distribution")
    plt.xlabel("Duration (min)")
    plt.ylabel("Session Count")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()
    return path


def _constraint_summary(frame, plt, output_path: Path) -> Path:
    path = output_path / "constraint_violation_summary.png"
    counts = frame["constraint_status"].value_counts()
    plt.figure(figsize=(7, 5))
    counts.plot(kind="bar")
    plt.title("Constraint Violation Summary")
    plt.xlabel("Status")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()
    return path


def _activity_heatmap(frame, plt, output_path: Path) -> Path:
    path = output_path / "activity_frequency_heatmap.png"
    valid = frame.dropna(subset=["activity_id", "category"])
    pivot = valid.pivot_table(index="category", columns="activity_name", values="run", aggfunc="count", fill_value=0)
    plt.figure(figsize=(max(9, len(pivot.columns) * 0.8), max(4, len(pivot.index) * 0.7)))
    plt.imshow(pivot.values, aspect="auto", cmap="viridis")
    plt.colorbar(label="Count")
    plt.xticks(range(len(pivot.columns)), pivot.columns, rotation=45, ha="right")
    plt.yticks(range(len(pivot.index)), pivot.index)
    plt.title("Activity Frequency Heatmap")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()
    return path


def _curve_comparison(
    activities: list[Activity],
    rules: Rules,
    state: StateInput,
    feedback: list[FeedbackEntry],
    runs: int,
    seed: int | None,
    pd,
    plt,
    output_path: Path,
) -> Path:
    path = output_path / "curve_comparison.png"
    comparison_runs = max(25, min(250, runs // 4 or runs))
    rows = []
    for curve in ("ramp", "wave", "peak_cooldown", "gentle"):
        curve_rules = replace(rules, preferred_intensity_curve=curve)
        metrics = run_simulations(activities, curve_rules, state, feedback, comparison_runs, seed)
        rows.append(
            {
                "curve": curve,
                "average_intensity": metrics["average_intensity"],
                "average_duration": metrics["average_duration"],
                "entropy": metrics["entropy_unpredictability_score"],
            }
        )
    comparison = pd.DataFrame(rows).set_index("curve")
    plt.figure(figsize=(9, 5))
    comparison[["average_intensity", "entropy"]].plot(kind="bar", ax=plt.gca())
    plt.title("Curve Comparison")
    plt.xlabel("Curve")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()
    return path


def _load_charting_dependencies():
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        import pandas as pd
    except ModuleNotFoundError as exc:
        raise RuntimeError("pandas and matplotlib are required for analytics charts") from exc
    return pd, plt
