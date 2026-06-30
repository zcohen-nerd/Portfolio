"""Weighted random session generator with consent-first safety constraints."""

from __future__ import annotations

import csv
import json
import math
import random
from collections import defaultdict
from pathlib import Path
from typing import Iterable

try:
    from .models import Activity, FeedbackEntry, Rules, Session, SessionStep, StateInput
    from .validators import (
        activity_safety_errors,
        is_aftercare_activity,
        is_cooldown_activity,
        is_high_intensity,
        needs_cooldown_after,
        validate_activity_database,
        validate_session,
        validate_state,
    )
except ImportError:  # pragma: no cover - supports direct script execution
    from models import Activity, FeedbackEntry, Rules, Session, SessionStep, StateInput
    from validators import (
        activity_safety_errors,
        is_aftercare_activity,
        is_cooldown_activity,
        is_high_intensity,
        needs_cooldown_after,
        validate_activity_database,
        validate_session,
        validate_state,
    )


class SessionGenerationError(ValueError):
    """Raised when no valid session can be generated without violating rules."""

    def __init__(self, errors: Iterable[str]) -> None:
        self.errors = tuple(errors)
        super().__init__("; ".join(self.errors))


def generate_session(
    activities: Iterable[Activity],
    rules: Rules,
    state: StateInput,
    feedback: Iterable[FeedbackEntry] | None = None,
    rng: random.Random | None = None,
) -> Session:
    """Generate a valid weighted-random session sequence.

    Safety rules are applied before weights are considered. Feedback can only
    move eligible activities up or down; it cannot make an unsafe activity
    selectable.
    """

    random_source = rng or random.Random()
    activity_list = list(activities)
    feedback_list = list(feedback or [])
    _raise_if_invalid(validate_state(state).errors)
    _raise_if_invalid(validate_activity_database(activity_list, rules).errors)

    safe_pool = [activity for activity in activity_list if not activity_safety_errors(activity, rules)]
    cooldown_pool = [activity for activity in safe_pool if is_cooldown_activity(activity)]
    aftercare_pool = [activity for activity in safe_pool if is_aftercare_activity(activity)]
    if rules.require_cooldown_after_high and not cooldown_pool:
        raise SessionGenerationError(["rules require cooldowns, but no eligible cooldown activity exists"])
    if rules.required_aftercare_at_end and not aftercare_pool:
        raise SessionGenerationError(["rules require aftercare at the end, but no eligible aftercare activity exists"])

    feedback_modifiers = build_feedback_modifiers(feedback_list)
    target_duration = min(rules.target_duration_min, state.time_available_min)
    steps: list[SessionStep] = []
    high_run = 0
    max_steps = 100

    while _current_duration(steps) < target_duration and len(steps) < max_steps:
        if steps and needs_cooldown_after(steps[-1].activity, rules):
            added = _append_forced_activity(
                steps,
                cooldown_pool,
                rules,
                state,
                feedback_modifiers,
                target_duration,
                random_source,
                "Cooldown after high intensity",
            )
            if not added:
                raise SessionGenerationError(["unable to insert required cooldown within available time"])
            high_run = 0
            continue

        candidates = _eligible_candidates(
            safe_pool,
            steps,
            rules,
            state,
            high_run,
            target_duration,
            normal_selection=True,
        )
        if not candidates:
            break

        selected = _weighted_choice(
            candidates,
            rules,
            state,
            feedback_modifiers,
            target_duration,
            _current_duration(steps),
            random_source,
        )
        steps.append(SessionStep(order=len(steps) + 1, activity=selected, reason="Weighted activity selection"))
        high_run = high_run + 1 if is_high_intensity(selected, rules) else 0

    if steps and needs_cooldown_after(steps[-1].activity, rules):
        added = _append_forced_activity(
            steps,
            cooldown_pool,
            rules,
            state,
            feedback_modifiers,
            target_duration,
            random_source,
            "Cooldown after high intensity",
        )
        if not added:
            raise SessionGenerationError(["unable to insert required cooldown at the end of the session"])

    if rules.required_aftercare_at_end and (not steps or not is_aftercare_activity(steps[-1].activity)):
        added = _append_forced_activity(
            steps,
            aftercare_pool,
            rules,
            state,
            feedback_modifiers,
            target_duration,
            random_source,
            "Required closing aftercare",
        )
        if not added:
            raise SessionGenerationError(["unable to insert required aftercare within available time"])

    session = Session(steps=tuple(_renumber_steps(steps)), state=state, rules=rules)
    validation = validate_session(session, rules)
    if not validation.ok:
        raise SessionGenerationError(validation.errors)
    return session


def build_feedback_modifiers(feedback: Iterable[FeedbackEntry]) -> dict[str, float]:
    """Convert feedback history into bounded weight modifiers by activity."""

    deltas: dict[str, list[float]] = defaultdict(list)
    for entry in feedback:
        outcome_delta = {"positive": 0.12, "neutral": -0.03, "negative": -0.25}[entry.outcome]
        rating_delta = (entry.rating - 3) * 0.04
        deltas[entry.activity_id].append(outcome_delta + rating_delta)

    modifiers: dict[str, float] = {}
    for activity_id, values in deltas.items():
        average_delta = sum(values) / len(values)
        modifiers[activity_id] = _clamp(1.0 + average_delta, 0.25, 1.75)
    return modifiers


def adjusted_weight(
    activity: Activity,
    rules: Rules,
    state: StateInput,
    feedback_modifiers: dict[str, float],
    target_duration: int,
    elapsed_duration: int,
) -> float:
    """Calculate the adjusted selection weight for an eligible activity."""

    if activity.base_weight <= 0:
        return 0.0
    return (
        activity.base_weight
        * state_modifier(activity, state)
        * novelty_modifier(activity, state)
        * feedback_modifiers.get(activity.id, 1.0)
        * intensity_curve_modifier(activity, rules, target_duration, elapsed_duration)
    )


def state_modifier(activity: Activity, state: StateInput) -> float:
    desired_alignment = 1.0 / (1.0 + 0.35 * abs(activity.intensity - state.desired_intensity))
    energy_factor = 1.0 + ((state.energy_level - 3) * (activity.intensity - 3) * 0.06)
    stress_penalty = max(0, state.stress_level - 3) * max(0, activity.intensity - 3) * 0.12
    comfort_bonus = max(0, state.stress_level - 3) * (activity.comfort_score - 5) * 0.025
    emotional_bonus = (state.emotional_focus - 3) * (activity.emotional_closeness_score - 5) * 0.025
    return _clamp(desired_alignment * (energy_factor - stress_penalty + comfort_bonus + emotional_bonus), 0.1, 3.0)


def novelty_modifier(activity: Activity, state: StateInput) -> float:
    preference = (state.novelty_preference - 3) / 2
    novelty_offset = (activity.novelty_score - 5) / 8
    return _clamp(1.0 + preference * novelty_offset, 0.35, 1.75)


def intensity_curve_modifier(activity: Activity, rules: Rules, target_duration: int, elapsed_duration: int) -> float:
    if target_duration <= 0:
        progress = 0.0
    else:
        progress = _clamp(elapsed_duration / target_duration, 0.0, 1.0)

    if rules.preferred_intensity_curve == "ramp":
        expected = 1.0 + 3.0 * progress
    elif rules.preferred_intensity_curve == "wave":
        expected = 2.5 + 1.4 * math.sin(progress * math.tau)
    elif rules.preferred_intensity_curve == "peak_cooldown":
        expected = 1.5 + 2.8 * max(0.0, 1.0 - abs(progress - 0.6) / 0.6)
        if progress > 0.75:
            expected = max(1.2, expected - 2.0 * (progress - 0.75) / 0.25)
    else:  # gentle
        expected = 2.0

    return _clamp(1.35 / (1.0 + 0.45 * abs(activity.intensity - expected)), 0.3, 1.6)


def export_session(
    session: Session,
    csv_path: str | Path = "session_output.csv",
    json_path: str | Path = "session_output.json",
    xlsx_path: str | Path | None = None,
) -> None:
    """Export a generated session to CSV, JSON, and optionally Excel."""

    records = session.to_records()
    csv_target = Path(csv_path)
    json_target = Path(json_path)
    csv_target.parent.mkdir(parents=True, exist_ok=True)
    json_target.parent.mkdir(parents=True, exist_ok=True)

    with csv_target.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0].keys()) if records else ["session_id"])
        writer.writeheader()
        writer.writerows(records)

    json_target.write_text(json.dumps(session.to_json_record(), indent=2), encoding="utf-8")

    if xlsx_path is not None:
        _export_excel(records, Path(xlsx_path))


def format_session(session: Session) -> str:
    """Format a generated session for console output."""

    lines = [
        f"Session: {session.session_id}",
        f"Duration: {session.total_duration_min} min",
        f"Average intensity: {session.average_intensity:.2f}",
        "",
    ]
    for step in session.steps:
        lines.append(
            f"{step.order}. {step.activity.name} "
            f"({step.activity.category}, intensity {step.activity.intensity}, "
            f"{step.activity.duration_min} min) - {step.reason}"
        )
    return "\n".join(lines)


def _eligible_candidates(
    pool: Iterable[Activity],
    steps: list[SessionStep],
    rules: Rules,
    state: StateInput,
    high_run: int,
    target_duration: int,
    normal_selection: bool,
) -> list[Activity]:
    candidates: list[Activity] = []
    pool_list = list(pool)
    elapsed = _current_duration(steps)
    for activity in pool_list:
        if normal_selection and is_aftercare_activity(activity):
            continue
        if not _fits_remaining_time(activity, steps, rules, state, target_duration):
            continue
        if steps and rules.prevent_same_category_repeat and steps[-1].activity.category == activity.category:
            continue
        if is_high_intensity(activity, rules) and high_run + 1 > rules.max_consecutive_high:
            continue
        if normal_selection and rules.required_aftercare_at_end and not is_aftercare_activity(activity):
            remaining_after = state.time_available_min - elapsed - activity.duration_min
            if not _has_followup_candidate(pool_list, remaining_after, activity.category, rules, is_aftercare_activity):
                continue
        if needs_cooldown_after(activity, rules):
            remaining_after = state.time_available_min - elapsed - activity.duration_min
            if not _has_followup_candidate(pool_list, remaining_after, activity.category, rules, is_cooldown_activity):
                continue
        candidates.append(activity)
    return candidates


def _append_forced_activity(
    steps: list[SessionStep],
    pool: Iterable[Activity],
    rules: Rules,
    state: StateInput,
    feedback_modifiers: dict[str, float],
    target_duration: int,
    rng: random.Random,
    reason: str,
) -> bool:
    elapsed = _current_duration(steps)
    pool_list = list(pool)
    candidates = [
        activity
        for activity in pool_list
        if _fits_remaining_time(activity, steps, rules, state, target_duration, reserve_aftercare=False)
        and not (steps and rules.prevent_same_category_repeat and steps[-1].activity.category == activity.category)
        and (
            is_aftercare_activity(activity)
            or not rules.required_aftercare_at_end
            or _has_followup_candidate(
                pool_list,
                state.time_available_min - elapsed - activity.duration_min,
                activity.category,
                rules,
                is_aftercare_activity,
            )
        )
    ]
    if not candidates:
        return False
    selected = _weighted_choice(candidates, rules, state, feedback_modifiers, target_duration, elapsed, rng)
    steps.append(SessionStep(order=len(steps) + 1, activity=selected, reason=reason))
    return True


def _weighted_choice(
    candidates: list[Activity],
    rules: Rules,
    state: StateInput,
    feedback_modifiers: dict[str, float],
    target_duration: int,
    elapsed_duration: int,
    rng: random.Random,
) -> Activity:
    weights = [
        adjusted_weight(candidate, rules, state, feedback_modifiers, target_duration, elapsed_duration)
        for candidate in candidates
    ]
    total = sum(weights)
    if total <= 0:
        return rng.choice(candidates)
    threshold = rng.uniform(0, total)
    running = 0.0
    for candidate, weight in zip(candidates, weights):
        running += weight
        if running >= threshold:
            return candidate
    return candidates[-1]


def _fits_remaining_time(
    activity: Activity,
    steps: list[SessionStep],
    rules: Rules,
    state: StateInput,
    target_duration: int,
    reserve_aftercare: bool = True,
) -> bool:
    elapsed = _current_duration(steps)
    remaining = state.time_available_min - elapsed
    if activity.duration_min > remaining:
        return False
    return True


def _minimum_duration(activities: Iterable[Activity]) -> int | None:
    durations = [activity.duration_min for activity in activities]
    return min(durations) if durations else None


def _has_followup_candidate(
    activities: Iterable[Activity],
    remaining_duration: int,
    previous_category: str,
    rules: Rules,
    predicate,
) -> bool:
    for activity in activities:
        if not predicate(activity):
            continue
        if activity.duration_min > remaining_duration:
            continue
        if rules.prevent_same_category_repeat and activity.category == previous_category:
            continue
        return True
    return False


def _current_duration(steps: Iterable[SessionStep]) -> int:
    return sum(step.activity.duration_min for step in steps)


def _renumber_steps(steps: Iterable[SessionStep]) -> list[SessionStep]:
    return [SessionStep(order=index, activity=step.activity, reason=step.reason) for index, step in enumerate(steps, start=1)]


def _raise_if_invalid(errors: Iterable[str]) -> None:
    errors_tuple = tuple(errors)
    if errors_tuple:
        raise SessionGenerationError(errors_tuple)


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def _export_excel(records: list[dict[str, object]], path: Path) -> None:
    try:
        from openpyxl import Workbook
    except ModuleNotFoundError as exc:
        raise RuntimeError("openpyxl is required for Excel export") from exc

    path.parent.mkdir(parents=True, exist_ok=True)
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Session"
    if not records:
        sheet.append(["session_id"])
    else:
        headers = list(records[0].keys())
        sheet.append(headers)
        for record in records:
            sheet.append([record.get(header) for header in headers])
    workbook.save(path)
