"""Command-line interface for the Controlled Random Experience Engine."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    from .analytics import generate_charts
    from .generator import SessionGenerationError, export_session, format_session, generate_session
    from .models import StateInput
    from .simulator import run_simulations
    from .validators import load_activities, load_feedback, load_rules, validate_activity_database
except ImportError:  # pragma: no cover - supports direct script execution
    from analytics import generate_charts
    from generator import SessionGenerationError, export_session, format_session, generate_session
    from models import StateInput
    from simulator import run_simulations
    from validators import load_activities, load_feedback, load_rules, validate_activity_database


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ACTIVITIES = PROJECT_ROOT / "activities.csv"
DEFAULT_RULES = PROJECT_ROOT / "rules.yaml"
DEFAULT_FEEDBACK = PROJECT_ROOT / "feedback.csv"


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except (SessionGenerationError, ValueError, RuntimeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        if isinstance(exc, SessionGenerationError):
            for error in exc.errors:
                print(f"- {error}", file=sys.stderr)
        return 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Controlled Random Experience Engine")
    parser.add_argument("--activities", type=Path, default=DEFAULT_ACTIVITIES, help="Path to activities.csv")
    parser.add_argument("--rules", type=Path, default=DEFAULT_RULES, help="Path to rules.yaml")
    parser.add_argument("--feedback", type=Path, default=DEFAULT_FEEDBACK, help="Path to feedback.csv")

    subparsers = parser.add_subparsers(dest="command", required=True)

    generate = subparsers.add_parser("generate", help="Generate and export a session")
    _add_state_args(generate)
    generate.add_argument("--seed", type=int, default=None)
    generate.add_argument("--excel", action="store_true", help="Also write session_output.xlsx")
    generate.set_defaults(func=_generate_command)

    simulate = subparsers.add_parser("simulate", help="Run Monte Carlo simulations")
    _add_state_args(simulate)
    simulate.add_argument("--runs", type=int, default=10_000)
    simulate.add_argument("--seed", type=int, default=None)
    simulate.set_defaults(func=_simulate_command)

    validate = subparsers.add_parser("validate", help="Validate activities and rules")
    validate.set_defaults(func=_validate_command)

    export_session_parser = subparsers.add_parser("export-session", help="Generate a session with custom output paths")
    _add_state_args(export_session_parser)
    export_session_parser.add_argument("--seed", type=int, default=None)
    export_session_parser.add_argument("--output-prefix", type=Path, default=PROJECT_ROOT / "session_output")
    export_session_parser.add_argument("--excel", action="store_true")
    export_session_parser.set_defaults(func=_export_session_command)

    analytics = subparsers.add_parser("analytics", help="Generate analytics charts")
    _add_state_args(analytics)
    analytics.add_argument("--runs", type=int, default=1_000)
    analytics.add_argument("--seed", type=int, default=None)
    analytics.add_argument("--output-dir", type=Path, default=PROJECT_ROOT / "analytics_output")
    analytics.set_defaults(func=_analytics_command)

    return parser


def _add_state_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--energy-level", type=int, default=3)
    parser.add_argument("--stress-level", type=int, default=3)
    parser.add_argument("--desired-intensity", type=int, default=3)
    parser.add_argument("--novelty-preference", type=int, default=3)
    parser.add_argument("--emotional-focus", type=int, default=3)
    parser.add_argument("--time-available-min", type=int, default=60)


def _load_inputs(args: argparse.Namespace):
    activities = load_activities(args.activities)
    rules = load_rules(args.rules)
    feedback = load_feedback(args.feedback)
    return activities, rules, feedback


def _state_from_args(args: argparse.Namespace) -> StateInput:
    return StateInput(
        energy_level=args.energy_level,
        stress_level=args.stress_level,
        desired_intensity=args.desired_intensity,
        novelty_preference=args.novelty_preference,
        emotional_focus=args.emotional_focus,
        time_available_min=args.time_available_min,
    )


def _generate_command(args: argparse.Namespace) -> int:
    activities, rules, feedback = _load_inputs(args)
    session = generate_session(activities, rules, _state_from_args(args), feedback, _rng(args.seed))
    export_session(
        session,
        PROJECT_ROOT / "session_output.csv",
        PROJECT_ROOT / "session_output.json",
        PROJECT_ROOT / "session_output.xlsx" if args.excel else None,
    )
    print(format_session(session))
    return 0


def _simulate_command(args: argparse.Namespace) -> int:
    activities, rules, feedback = _load_inputs(args)
    metrics = run_simulations(activities, rules, _state_from_args(args), feedback, runs=args.runs, seed=args.seed)
    print(json.dumps(metrics, indent=2))
    return 0


def _validate_command(args: argparse.Namespace) -> int:
    activities, rules, _feedback = _load_inputs(args)
    result = validate_activity_database(activities, rules)
    if result.ok:
        print("Validation passed.")
        return 0
    print("Validation failed:")
    for error in result.errors:
        print(f"- {error}")
    return 1


def _export_session_command(args: argparse.Namespace) -> int:
    activities, rules, feedback = _load_inputs(args)
    session = generate_session(activities, rules, _state_from_args(args), feedback, _rng(args.seed))
    prefix: Path = args.output_prefix
    export_session(
        session,
        prefix.with_suffix(".csv"),
        prefix.with_suffix(".json"),
        prefix.with_suffix(".xlsx") if args.excel else None,
    )
    print(format_session(session))
    return 0


def _analytics_command(args: argparse.Namespace) -> int:
    activities, rules, feedback = _load_inputs(args)
    paths = generate_charts(
        activities,
        rules,
        _state_from_args(args),
        feedback,
        runs=args.runs,
        output_dir=args.output_dir,
        seed=args.seed,
    )
    print("Charts written:")
    for path in paths:
        print(f"- {path}")
    return 0


def _rng(seed: int | None):
    if seed is None:
        return None
    import random

    return random.Random(seed)


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
