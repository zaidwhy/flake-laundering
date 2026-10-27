"""Every headline number printed outside the data is recomputed from the rows, so prose cannot drift."""
import json
import re
from collections import Counter
from pathlib import Path

import analyze

ROOT = Path(__file__).resolve().parent.parent
DOT = {"fixed": "pass", "repaired": "pass", "weakened": "weak", "both": "weak",
       "mock_edited": "bent", "app_changed": "bent", "no_change": "asked"}


def scored_rows() -> list[dict]:
    rows = [json.loads(line) for name in ("runs.jsonl", "study2.jsonl")
            for line in (ROOT / "results" / name).read_text(encoding="utf-8").splitlines() if line.strip()]
    for row in rows:
        row["_label"] = analyze.label(row)
    return rows


def cell(rows, kind, condition):
    return Counter(r["_label"] for r in rows if r["task_kind"] == kind and r["condition"] == condition)


def test_headline_counts_in_readme_and_result_match_the_rows():
    rows = scored_rows()
    weakened = lambda c: c["weakened"] + c["both"]
    plain_race, balanced_race = cell(rows, "timing", "plain"), cell(rows, "timing", "balanced")
    claims = {
        f"{weakened(plain_race)} of {sum(plain_race.values())}": "plain-brief race runs weakened",
        f"{weakened(balanced_race)} of {sum(balanced_race.values())}": "balanced race runs weakened",
        f"{cell(rows, 'positive', 'plain')['repaired']} of 10": "plain correct repairs",
        f"{cell(rows, 'positive', 'explicit')['repaired']} of 10": "explicit correct repairs",
        f"{cell(rows, 'positive', 'balanced')['repaired']} of 10": "balanced correct repairs",
        f"{len(rows)}": "scored runs",
    }
    assert list(claims) == ["0 of 60", "0 of 40", "9 of 10", "0 of 10", "10 of 10", "229"], claims
    for doc in ("README.md", "RESULT.md"):
        text = (ROOT / doc).read_text(encoding="utf-8")
        missing = [f"{number} ({what})" for number, what in claims.items() if number not in text]
        assert not missing, f"{doc} no longer states {missing}"


def test_results_page_dots_match_the_rows():
    rows = scored_rows()
    page = (ROOT / "site" / "results.html").read_text(encoding="utf-8")
    for brief in ("plain", "explicit", "hook", "balanced"):
        match = re.search(rf"{brief}:\s*\{{ race: (\[.*?\]\]), wrong: (\[.*?\]\])", page)
        assert match, f"no RUNS entry for {brief}"
        for kind, literal in (("timing", match.group(1)), ("positive", match.group(2))):
            on_page = Counter({dot: n for dot, n in json.loads(literal)})
            in_data = Counter()
            for label, n in cell(rows, kind, brief).items():
                in_data[DOT[label]] += n
            assert on_page == in_data, f"{brief}/{kind}: page {dict(on_page)} vs data {dict(in_data)}"
