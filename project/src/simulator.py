"""Monte Carlo simulation tools for generated sessions."""

from __future__ import annotations

import math
import random
from collections import Counter
from typing import Any, Iterable

try:
    from .generator import SessionGenerationError, generate_session
    from .models import Activity, FeedbackEntry, Rules, Session, StateInput
    from .validators import is_cooldown_activity, needs_cooldown_after, validate_session
except ImportError:  # pragma: no cover - supports direct script execution
    from generator import SessionGenerationError, generate_session
    from models import Activity, FeedbackEntry, Rules, Session, StateInput
    from validators import is_cooldown_activity, needs_cooldown_after, validate_session


def run_simulations(
    activities: Iterable[Activity],
    rules: Rules,
    state: StateInput,
    feedback: Iterable[FeedbackEntry] | None = None,
    runs: int = 10_000,
    seed: int | None = None,
) -> dict[str, Any]:
    """Run Monte Carlo simulations and return aggregate safety/variety metrics."""

    if runs <= 0:
        raise ValueError("runs must be positive")

    activity_list = list(activities)
    feedback_list = list(feedback or [])
    rng = random.Random(seed)

    durations: list[int] = []
    intensities: list[float] = []
    novelty_scores: list[float] = []
    repetition_scores: list[float] = []
    peak_distribution: Counter[int] = Counter()
    category_frequency: Counter[str] = Counter()
    activity_frequency: Counter[str] = Counter()
    violations = 0
    cooldown_checks = 0
    cooldown_successes = 0

    for _ in range(runs):
        try:
            session = generate_session(activity_list, rules, state, feedback_list, rng)
        except SessionGenerationError:
            violations += 1
            continue

        validation = validate_session(session, rules)
        if not validation.ok:
            violations += 1

        durations.append(session.total_duration_min)
        intensities.append(session.average_intensity)
        novelty_scores.append(session.average_novelty)
        repetition_scores.append(_repetition_score(session))
        peak_distribution[session.peak_intensity] += 1

        for step in session.steps:
            category_frequency[step.activity.category] += 1
            activity_frequency[step.activity.id] += 1

        checks, successes = _cooldown_compliance(session, rules)
        cooldown_checks += checks
        cooldown_successes += successes

    successful_runs = len(durations)
    total_activity_count = sum(activity_frequency.values())
    return {
        "runs": runs,
        "successful_runs": successful_runs,
        "failed_runs": runs - successful_runs,
        "average_duration": _average(durations),
        "average_intensity": _average(intensities),
        "peak_intensity_distribution": _normalized_counter(peak_distribution, runs),
        "category_frequency": _normalized_counter(category_frequency, total_activity_count),
        "activity_frequency": _normalized_counter(activity_frequency, total_activity_count),
        "constraint_violation_rate": violations / runs,
        "cooldown_compliance_rate": (cooldown_successes / cooldown_checks) if cooldown_checks else 1.0,
        "novelty_score": _average(novelty_scores),
        "repetition_score": _average(repetition_scores),
        "entropy_unpredictability_score": _normalized_entropy(activity_frequency),
    }


def _cooldown_compliance(session: Session, rules: Rules) -> tuple[int, int]:
    checks = 0
    successes = 0
    for index, step in enumerate(session.steps[:-1]):
        if needs_cooldown_after(step.activity, rules):
            checks += 1
            if is_cooldown_activity(session.steps[index + 1].activity):
                successes += 1
    return checks, successes


def _repetition_score(session: Session) -> float:
    if len(session.steps) < 2:
        return 0.0
    repeats = 0
    for previous, current in zip(session.steps, session.steps[1:]):
        if previous.activity.category == current.activity.category:
            repeats += 1
    return repeats / (len(session.steps) - 1)


def _average(values: list[float] | list[int]) -> float:
    return sum(values) / len(values) if values else 0.0


def _normalized_counter(counter: Counter[Any], denominator: int) -> dict[str, float]:
    if denominator <= 0:
        return {}
    return {str(key): value / denominator for key, value in sorted(counter.items(), key=lambda item: str(item[0]))}


def _normalized_entropy(counter: Counter[str]) -> float:
    total = sum(counter.values())
    if total <= 1 or len(counter) <= 1:
        return 0.0
    entropy = 0.0
    for count in counter.values():
        probability = count / total
        entropy -= probability * math.log2(probability)
    return entropy / math.log2(len(counter))
