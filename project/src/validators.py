"""Loading and validation helpers for activities, rules, state, and sessions."""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Any, Iterable

try:
    from .models import Activity, FeedbackEntry, FeedbackOutcome, Rules, Session, StateInput, ValidationResult
except ImportError:  # pragma: no cover - supports direct script execution
    from models import Activity, FeedbackEntry, FeedbackOutcome, Rules, Session, StateInput, ValidationResult


VALID_CURVES = {"ramp", "wave", "peak_cooldown", "gentle"}
VALID_OUTCOMES = {"positive", "neutral", "negative"}
COOLDOWN_CATEGORIES = {"cooldown", "aftercare", "recovery", "grounding"}
COOLDOWN_TAGS = {"cooldown", "aftercare", "recovery", "grounding", "comfort"}
AFTERCARE_CATEGORIES = {"aftercare"}
AFTERCARE_TAGS = {"aftercare", "closing"}


def load_activities(path: str | Path) -> list[Activity]:
    """Load and validate activities from a CSV file."""

    csv_path = Path(path)
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        required = {
            "id",
            "name",
            "category",
            "description",
            "intensity",
            "duration_min",
            "approved",
            "base_weight",
            "cooldown_required",
            "anticipation_score",
            "adrenaline_score",
            "comfort_score",
            "novelty_score",
            "emotional_closeness_score",
            "tags",
            "hard_limit_flag",
        }
        missing = required.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"activities.csv missing required columns: {sorted(missing)}")

        activities: list[Activity] = []
        seen_ids: set[str] = set()
        for line_number, row in enumerate(reader, start=2):
            activity = _row_to_activity(row, line_number)
            if activity.id in seen_ids:
                raise ValueError(f"activities.csv line {line_number}: duplicate id '{activity.id}'")
            seen_ids.add(activity.id)
            activities.append(activity)
    return activities


def load_feedback(path: str | Path) -> list[FeedbackEntry]:
    """Load optional feedback entries from CSV."""

    feedback_path = Path(path)
    if not feedback_path.exists():
        return []

    with feedback_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        required = {"activity_id", "session_id", "outcome", "notes", "rating"}
        missing = required.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"feedback.csv missing required columns: {sorted(missing)}")

        entries: list[FeedbackEntry] = []
        for line_number, row in enumerate(reader, start=2):
            outcome = str(row["outcome"]).strip().lower()
            if outcome not in VALID_OUTCOMES:
                raise ValueError(f"feedback.csv line {line_number}: invalid outcome '{outcome}'")
            entries.append(
                FeedbackEntry(
                    activity_id=str(row["activity_id"]).strip(),
                    session_id=str(row["session_id"]).strip(),
                    outcome=outcome,  # type: ignore[arg-type]
                    notes=str(row.get("notes", "")).strip(),
                    rating=_int_in_range(row["rating"], "rating", line_number, 1, 5),
                )
            )
    return entries


def load_rules(path: str | Path) -> Rules:
    """Load rules from YAML, with a small built-in parser as a safe fallback."""

    data = _load_yaml_mapping(Path(path))
    curve = str(data.get("preferred_intensity_curve", "wave")).strip().lower()
    if curve not in VALID_CURVES:
        raise ValueError(f"rules.yaml: preferred_intensity_curve must be one of {sorted(VALID_CURVES)}")

    return Rules(
        max_intensity_allowed=_coerce_int(data.get("max_intensity_allowed", 5), "max_intensity_allowed", 1, 5),
        max_consecutive_high=_coerce_int(data.get("max_consecutive_high", 1), "max_consecutive_high", 0, 20),
        high_intensity_threshold=_coerce_int(data.get("high_intensity_threshold", 4), "high_intensity_threshold", 1, 5),
        require_cooldown_after_high=_parse_bool(data.get("require_cooldown_after_high", True)),
        prevent_same_category_repeat=_parse_bool(data.get("prevent_same_category_repeat", True)),
        target_duration_min=_coerce_int(data.get("target_duration_min", 60), "target_duration_min", 1, 24 * 60),
        strict_mode=_parse_bool(data.get("strict_mode", True)),
        required_aftercare_at_end=_parse_bool(data.get("required_aftercare_at_end", True)),
        excluded_tags=tuple(_normalize_tag(tag) for tag in _coerce_list(data.get("excluded_tags", []))),
        preferred_intensity_curve=curve,  # type: ignore[arg-type]
    )


def validate_state(state: StateInput) -> ValidationResult:
    errors: list[str] = []
    for field_name in ("energy_level", "stress_level", "desired_intensity", "novelty_preference", "emotional_focus"):
        value = getattr(state, field_name)
        if not 1 <= value <= 5:
            errors.append(f"{field_name} must be between 1 and 5")
    if state.time_available_min <= 0:
        errors.append("time_available_min must be positive")
    return ValidationResult.invalid(errors) if errors else ValidationResult.valid()


def validate_activity_database(activities: Iterable[Activity], rules: Rules) -> ValidationResult:
    """Validate the database shape and safety support needed by the rules."""

    activity_list = list(activities)
    errors: list[str] = []
    ids = [activity.id for activity in activity_list]
    if len(ids) != len(set(ids)):
        errors.append("activity ids must be unique")

    safe_pool = [activity for activity in activity_list if not activity_safety_errors(activity, rules)]
    if not safe_pool:
        errors.append("no activities are eligible after safety filters")
    if rules.require_cooldown_after_high and not any(is_cooldown_activity(activity) for activity in safe_pool):
        errors.append("rules require cooldowns, but no eligible cooldown or aftercare activity exists")
    if rules.required_aftercare_at_end and not any(is_aftercare_activity(activity) for activity in safe_pool):
        errors.append("rules require aftercare at the end, but no eligible aftercare activity exists")

    for activity in activity_list:
        if not 1 <= activity.intensity <= 5:
            errors.append(f"{activity.id}: intensity must be between 1 and 5")
        if activity.duration_min <= 0:
            errors.append(f"{activity.id}: duration_min must be positive")
        if activity.base_weight < 0:
            errors.append(f"{activity.id}: base_weight cannot be negative")
        for score_name in (
            "anticipation_score",
            "adrenaline_score",
            "comfort_score",
            "novelty_score",
            "emotional_closeness_score",
        ):
            score = getattr(activity, score_name)
            if not 1 <= score <= 10:
                errors.append(f"{activity.id}: {score_name} must be between 1 and 10")

    return ValidationResult.invalid(errors) if errors else ValidationResult.valid()


def activity_safety_errors(activity: Activity, rules: Rules) -> list[str]:
    """Return safety errors that make an activity ineligible."""

    errors: list[str] = []
    if not activity.approved:
        errors.append(f"{activity.id}: not approved")
    if activity.hard_limit_flag:
        errors.append(f"{activity.id}: hard limit")
    if activity.intensity > rules.max_intensity_allowed:
        errors.append(f"{activity.id}: intensity exceeds max_intensity_allowed")
    excluded = set(rules.excluded_tags).intersection(activity.tags)
    if excluded:
        errors.append(f"{activity.id}: excluded tags present: {sorted(excluded)}")
    return errors


def is_high_intensity(activity: Activity, rules: Rules) -> bool:
    return activity.intensity >= rules.high_intensity_threshold


def needs_cooldown_after(activity: Activity, rules: Rules) -> bool:
    return rules.require_cooldown_after_high and (activity.cooldown_required or is_high_intensity(activity, rules))


def is_cooldown_activity(activity: Activity) -> bool:
    return activity.category.lower() in COOLDOWN_CATEGORIES or bool(set(activity.tags).intersection(COOLDOWN_TAGS))


def is_aftercare_activity(activity: Activity) -> bool:
    return activity.category.lower() in AFTERCARE_CATEGORIES or bool(set(activity.tags).intersection(AFTERCARE_TAGS))


def validate_session(session: Session, rules: Rules | None = None) -> ValidationResult:
    """Validate a generated session against all safety rules."""

    active_rules = rules or session.rules
    errors: list[str] = []
    if not session.steps:
        errors.append("session has no activities")

    high_run = 0
    for index, step in enumerate(session.steps):
        activity = step.activity
        errors.extend(activity_safety_errors(activity, active_rules))

        if is_high_intensity(activity, active_rules):
            high_run += 1
            if high_run > active_rules.max_consecutive_high:
                errors.append(
                    f"steps {index} and {index + 1}: more than "
                    f"{active_rules.max_consecutive_high} consecutive high-intensity activities"
                )
        else:
            high_run = 0

        if index > 0 and active_rules.prevent_same_category_repeat:
            previous = session.steps[index - 1].activity
            if previous.category == activity.category:
                errors.append(f"steps {index} and {index + 1}: repeated category '{activity.category}'")

    for index, step in enumerate(session.steps[:-1]):
        if needs_cooldown_after(step.activity, active_rules):
            following = session.steps[index + 1].activity
            if not is_cooldown_activity(following):
                errors.append(f"step {index + 1}: high-intensity activity is not followed by cooldown or aftercare")

    if session.steps and needs_cooldown_after(session.steps[-1].activity, active_rules):
        errors.append("last activity requires cooldown but none follows it")

    if active_rules.required_aftercare_at_end and session.steps and not is_aftercare_activity(session.steps[-1].activity):
        errors.append("session must end with aftercare")

    if session.total_duration_min > session.state.time_available_min:
        errors.append(
            f"session duration {session.total_duration_min} exceeds available time "
            f"{session.state.time_available_min}"
        )

    return ValidationResult.invalid(errors) if errors else ValidationResult.valid()


def _row_to_activity(row: dict[str, str], line_number: int) -> Activity:
    return Activity(
        id=_required_text(row, "id", line_number),
        name=_required_text(row, "name", line_number),
        category=_required_text(row, "category", line_number).lower(),
        description=_required_text(row, "description", line_number),
        intensity=_int_in_range(row["intensity"], "intensity", line_number, 1, 5),
        duration_min=_int_in_range(row["duration_min"], "duration_min", line_number, 1, 24 * 60),
        approved=_parse_bool(row["approved"]),
        base_weight=_float_at_least(row["base_weight"], "base_weight", line_number, 0.0),
        cooldown_required=_parse_bool(row["cooldown_required"]),
        anticipation_score=_int_in_range(row["anticipation_score"], "anticipation_score", line_number, 1, 10),
        adrenaline_score=_int_in_range(row["adrenaline_score"], "adrenaline_score", line_number, 1, 10),
        comfort_score=_int_in_range(row["comfort_score"], "comfort_score", line_number, 1, 10),
        novelty_score=_int_in_range(row["novelty_score"], "novelty_score", line_number, 1, 10),
        emotional_closeness_score=_int_in_range(row["emotional_closeness_score"], "emotional_closeness_score", line_number, 1, 10),
        tags=tuple(_normalize_tag(tag) for tag in _split_tags(row.get("tags", ""))),
        hard_limit_flag=_parse_bool(row["hard_limit_flag"]),
    )


def _load_yaml_mapping(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    try:
        import yaml  # type: ignore[import-not-found]

        data = yaml.safe_load(text) or {}
        if not isinstance(data, dict):
            raise ValueError("rules.yaml must contain a mapping")
        return data
    except ModuleNotFoundError:
        return _parse_simple_yaml(text)


def _parse_simple_yaml(text: str) -> dict[str, Any]:
    data: dict[str, Any] = {}
    current_list_key: str | None = None
    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].rstrip()
        if not line.strip():
            continue
        stripped = line.strip()
        if stripped.startswith("-"):
            if current_list_key is None:
                raise ValueError("rules.yaml list item found without a key")
            data[current_list_key].append(_parse_scalar(stripped[1:].strip()))
            continue
        if ":" not in stripped:
            raise ValueError(f"rules.yaml cannot parse line: {raw_line}")
        key, value = stripped.split(":", 1)
        key = key.strip()
        value = value.strip()
        if not value:
            data[key] = []
            current_list_key = key
        else:
            data[key] = _parse_scalar(value)
            current_list_key = None
    return data


def _parse_scalar(value: str) -> Any:
    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()
        if not inner:
            return []
        return [_parse_scalar(part.strip()) for part in inner.split(",")]
    lower = value.lower()
    if lower in {"true", "false"}:
        return lower == "true"
    try:
        return int(value)
    except ValueError:
        pass
    try:
        return float(value)
    except ValueError:
        return value.strip("'\"")


def _parse_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    normalized = str(value).strip().lower()
    if normalized in {"true", "1", "yes", "y"}:
        return True
    if normalized in {"false", "0", "no", "n"}:
        return False
    raise ValueError(f"invalid boolean value '{value}'")


def _coerce_int(value: Any, name: str, minimum: int, maximum: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"rules.yaml: {name} must be an integer") from exc
    if not minimum <= number <= maximum:
        raise ValueError(f"rules.yaml: {name} must be between {minimum} and {maximum}")
    return number


def _coerce_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    return [value]


def _required_text(row: dict[str, str], name: str, line_number: int) -> str:
    value = str(row.get(name, "")).strip()
    if not value:
        raise ValueError(f"activities.csv line {line_number}: {name} is required")
    return value


def _int_in_range(value: Any, name: str, line_number: int, minimum: int, maximum: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"CSV line {line_number}: {name} must be an integer") from exc
    if not minimum <= number <= maximum:
        raise ValueError(f"CSV line {line_number}: {name} must be between {minimum} and {maximum}")
    return number


def _float_at_least(value: Any, name: str, line_number: int, minimum: float) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"CSV line {line_number}: {name} must be a number") from exc
    if number < minimum:
        raise ValueError(f"CSV line {line_number}: {name} must be at least {minimum}")
    return number


def _split_tags(value: str) -> list[str]:
    return [tag for tag in (part.strip() for part in value.replace(",", ";").split(";")) if tag]


def _normalize_tag(value: Any) -> str:
    return str(value).strip().lower().replace(" ", "_")
