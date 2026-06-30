from __future__ import annotations

import random
import sys
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from generator import SessionGenerationError, generate_session
from models import Activity, Rules, StateInput
from simulator import run_simulations
from validators import is_cooldown_activity, load_activities, load_feedback, load_rules, needs_cooldown_after


def _default_inputs():
    activities = load_activities(PROJECT_ROOT / "activities.csv")
    rules = load_rules(PROJECT_ROOT / "rules.yaml")
    feedback = load_feedback(PROJECT_ROOT / "feedback.csv")
    state = StateInput(time_available_min=60)
    return activities, rules, feedback, state


def test_generated_session_uses_only_approved_activities() -> None:
    activities, rules, feedback, state = _default_inputs()
    session = generate_session(activities, rules, state, feedback, random.Random(3))

    assert session.steps
    assert all(step.activity.approved for step in session.steps)


def test_generated_session_never_uses_hard_limits() -> None:
    activities, rules, feedback, state = _default_inputs()
    session = generate_session(activities, rules, state, feedback, random.Random(4))

    assert all(not step.activity.hard_limit_flag for step in session.steps)


def test_max_intensity_is_respected() -> None:
    activities, rules, feedback, state = _default_inputs()
    session = generate_session(activities, rules, state, feedback, random.Random(5))

    assert max(step.activity.intensity for step in session.steps) <= rules.max_intensity_allowed


def test_cooldown_inserted_after_high_intensity() -> None:
    activities = [
        Activity(
            id="high",
            name="High Activity",
            category="challenge",
            description="Bounded high-intensity activity",
            intensity=4,
            duration_min=10,
            approved=True,
            base_weight=1.0,
            cooldown_required=True,
            anticipation_score=7,
            adrenaline_score=8,
            comfort_score=7,
            novelty_score=6,
            emotional_closeness_score=5,
            tags=("challenge",),
            hard_limit_flag=False,
        ),
        Activity(
            id="cooldown",
            name="Cooldown",
            category="cooldown",
            description="Grounding cooldown",
            intensity=1,
            duration_min=5,
            approved=True,
            base_weight=1.0,
            cooldown_required=False,
            anticipation_score=1,
            adrenaline_score=1,
            comfort_score=10,
            novelty_score=2,
            emotional_closeness_score=5,
            tags=("cooldown",),
            hard_limit_flag=False,
        ),
        Activity(
            id="low",
            name="Low Activity",
            category="reflection",
            description="Low-intensity reflection",
            intensity=1,
            duration_min=5,
            approved=True,
            base_weight=0.2,
            cooldown_required=False,
            anticipation_score=1,
            adrenaline_score=1,
            comfort_score=9,
            novelty_score=2,
            emotional_closeness_score=8,
            tags=("comfort",),
            hard_limit_flag=False,
        ),
    ]
    rules = Rules(
        max_intensity_allowed=4,
        max_consecutive_high=1,
        high_intensity_threshold=4,
        require_cooldown_after_high=True,
        prevent_same_category_repeat=True,
        target_duration_min=20,
        strict_mode=True,
        required_aftercare_at_end=False,
        excluded_tags=(),
        preferred_intensity_curve="ramp",
    )
    state = StateInput(energy_level=5, desired_intensity=4, time_available_min=30)

    session = generate_session(activities, rules, state, rng=random.Random(1))

    for index, step in enumerate(session.steps[:-1]):
        if needs_cooldown_after(step.activity, rules):
            assert is_cooldown_activity(session.steps[index + 1].activity)


def test_impossible_session_raises_clear_error() -> None:
    activities = [
        Activity(
            id="high_only",
            name="High Only",
            category="challenge",
            description="High activity without cooldown support",
            intensity=4,
            duration_min=10,
            approved=True,
            base_weight=1.0,
            cooldown_required=True,
            anticipation_score=7,
            adrenaline_score=8,
            comfort_score=6,
            novelty_score=6,
            emotional_closeness_score=4,
            tags=("challenge",),
            hard_limit_flag=False,
        )
    ]
    rules = Rules(
        max_intensity_allowed=4,
        max_consecutive_high=1,
        high_intensity_threshold=4,
        require_cooldown_after_high=True,
        prevent_same_category_repeat=True,
        target_duration_min=20,
        strict_mode=True,
        required_aftercare_at_end=False,
        excluded_tags=(),
        preferred_intensity_curve="ramp",
    )

    with pytest.raises(SessionGenerationError) as exc_info:
        generate_session(activities, rules, StateInput(time_available_min=20), rng=random.Random(1))

    assert "cooldown" in str(exc_info.value).lower()


def test_monte_carlo_returns_valid_metrics() -> None:
    activities, rules, feedback, state = _default_inputs()
    metrics = run_simulations(activities, rules, state, feedback, runs=25, seed=9)

    assert metrics["runs"] == 25
    assert metrics["successful_runs"] > 0
    assert 0 <= metrics["constraint_violation_rate"] <= 1
    assert 0 <= metrics["cooldown_compliance_rate"] <= 1
    assert 0 <= metrics["entropy_unpredictability_score"] <= 1
    assert isinstance(metrics["peak_intensity_distribution"], dict)
