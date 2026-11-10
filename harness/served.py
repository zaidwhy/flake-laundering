"""List runs the CLI served with a model other than the one requested, so they are set aside unscored.

An overloaded model can be swapped for another without the run failing. A row whose transcript
bills any other model is not evidence about the model named in its run id.
"""
import argparse
import json
import sys
from pathlib import Path

import run


def billed_models(transcript: Path) -> set[str]:
    models: set[str] = set()
    if not transcript.is_file():
        return models
    for line in transcript.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            event = json.loads(line)
        except ValueError:
            continue
        if isinstance(event, dict) and event.get("type") == "result":
            models.update(event.get("modelUsage") or {})
    return models


def wrongly_served(rows: list[dict], runs_root: Path) -> list[tuple[str, list[str]]]:
    """Each (run id, models billed) where the bill is not exactly the requested model; no bill counts."""
    suspects = []
    for row in rows:
        if row.get("dry_run"):
            continue
        billed = billed_models(runs_root / row["run_id"] / "transcript.jsonl")
        if billed != {row["model"]}:
            suspects.append((row["run_id"], sorted(billed)))
    return suspects


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("results", help="a results .jsonl written by run.py")
    args = parser.parse_args()
    rows = [json.loads(line) for line in Path(args.results).read_text(encoding="utf-8").splitlines()
            if line.strip()]
    suspects = wrongly_served(rows, run.RUNS_ROOT)
    for run_id, billed in suspects:
        print(f"{run_id}: billed {billed or 'nothing'}")
    print(f"{len(rows)} rows, {len(suspects)} not served by the requested model alone")
    return 1 if suspects else 0


if __name__ == "__main__":
    sys.exit(main())
