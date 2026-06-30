"""Data models for the Controlled Random Experience Engine.

The engine is intentionally consent-first: the models carry safety fields
directly so validation and generation never need to infer them from prose.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Literal
from uuid import uuid4


IntensityCurve = Literal["ramp", "wave", "peak_cooldown", "gentle"]
FeedbackOutcome = Literal["positive", "neutral", "negative"]


@dataclass(frozen=True)
class Activity:
    """A single pre-approved activity candidate."""

    id: str
    name: str
    category: str
    description: str
    intensity: int
    duration_min: int
    approved: bool
    base_weight: float
    cooldown_required: bool
    anticipation_score: int
    adrenaline_score: int
    comfort_score: int
    novelty_score: int
    emotional_closeness_score: int
    tags: tuple[str, ...] = field(default_factory=tuple)
    hard_limit_flag: bool = False

    def has_tag(self, tag: str) -> bool:
        return tag.strip().lower() in self.tags

    def to_record(self) -> dict[str, Any]:
        record = asdict(self)
        record["tags"] = ";".join(self.tags)
        return record


@dataclass(frozen=True)
class Rules:
    """Safety and shape constraints loaded from rules.yaml."""

    max_intensity_allowed: int = 5
    max_consecutive_high: int = 1
    high_intensity_threshold: int = 4
    require_cooldown_after_high: bool = True
    prevent_same_category_repeat: bool = True
    target_duration_min: int = 60
    strict_mode: bool = True
    required_aftercare_at_end: bool = True
    excluded_tags: tuple[str, ...] = field(default_factory=tuple)
    preferred_intensity_curve: IntensityCurve = "wave"

    def to_record(self) -> dict[str, Any]:
        record = asdict(self)
        record["excluded_tags"] = list(self.excluded_tags)
        return record


@dataclass(frozen=True)
class StateInput:
    """Current participant/session state used to bias random selection."""

    energy_level: int = 3
    stress_level: int = 3
    desired_intensity: int = 3
    novelty_preference: int = 3
    emotional_focus: int = 3
    time_available_min: int = 60


@dataclass(frozen=True)
class FeedbackEntry:
    """A single activity feedback row."""

    activity_id: str
    session_id: str
    outcome: FeedbackOutcome
    notes: str
    rating: int


@dataclass(frozen=True)
class SessionStep:
    """One ordered activity in a generated session."""

    order: int
    activity: Activity
    reason: str = ""

    def to_record(self) -> dict[str, Any]:
        return {
            "order": self.order,
            "activity_id": self.activity.id,
            "name": self.activity.name,
            "category": self.activity.category,
            "description": self.activity.description,
            "intensity": self.activity.intensity,
            "duration_min": self.activity.duration_min,
            "reason": self.reason,
            "tags": ";".join(self.activity.tags),
        }


@dataclass(frozen=True)
class Session:
    """A generated activity sequence and the inputs that produced it."""

    steps: tuple[SessionStep, ...]
    state: StateInput
    rules: Rules
    session_id: str = field(default_factory=lambda: f"session-{uuid4().hex[:12]}")

    @property
    def total_duration_min(self) -> int:
        return sum(step.activity.duration_min for step in self.steps)

    @property
    def average_intensity(self) -> float:
        if not self.steps:
            return 0.0
        return sum(step.activity.intensity for step in self.steps) / len(self.steps)

    @property
    def peak_intensity(self) -> int:
        if not self.steps:
            return 0
        return max(step.activity.intensity for step in self.steps)

    @property
    def average_novelty(self) -> float:
        if not self.steps:
            return 0.0
        return sum(step.activity.novelty_score for step in self.steps) / len(self.steps)

    def to_records(self) -> list[dict[str, Any]]:
        return [
            {
                "session_id": self.session_id,
                "total_duration_min": self.total_duration_min,
                **step.to_record(),
            }
            for step in self.steps
        ]

    def to_json_record(self) -> dict[str, Any]:
        return {
            "session_id": self.session_id,
            "state": asdict(self.state),
            "rules": self.rules.to_record(),
            "total_duration_min": self.total_duration_min,
            "average_intensity": self.average_intensity,
            "peak_intensity": self.peak_intensity,
            "steps": self.to_records(),
        }


@dataclass(frozen=True)
class ValidationResult:
    """Validation outcome with explicit human-readable errors."""

    ok: bool
    errors: tuple[str, ...] = field(default_factory=tuple)

    @classmethod
    def valid(cls) -> "ValidationResult":
        return cls(ok=True, errors=())

    @classmethod
    def invalid(cls, errors: list[str]) -> "ValidationResult":
        return cls(ok=False, errors=tuple(errors))
