import json
import re
from pathlib import Path

RESULTS = Path(__file__).resolve().parent.parent / "results"


def documented_fields() -> set[str]:
    rows = [line for line in (RESULTS / "README.md").read_text(encoding="utf-8").splitlines() if line.startswith("| `")]
    return {name for line in rows for name in re.findall(r"`([a-z_]+)`", line.split("|")[1])}


def fields_in(*names: str) -> set[str]:
    return {key for name in names for line in (RESULTS / name).read_text(encoding="utf-8").splitlines()
            if line.strip() for key in json.loads(line)}


def test_every_published_field_is_documented():
    missing = fields_in("runs.jsonl", "study2.jsonl", "judge-grid.jsonl", "judge-study2.jsonl") - documented_fields()
    assert not missing, f"document these fields in results/README.md: {sorted(missing)}"


def test_row_counts_in_the_doc_match_the_files():
    text = (RESULTS / "README.md").read_text(encoding="utf-8")
    for name in ("runs.jsonl", "study2.jsonl", "infra-errors.jsonl"):
        count = sum(1 for line in (RESULTS / name).read_text(encoding="utf-8").splitlines() if line.strip())
        assert re.search(rf"\| `{re.escape(name)}` \| {count} \|", text), name
