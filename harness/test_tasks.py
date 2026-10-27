"""Structural promises PLAN.md makes about the stimuli, checked against the task folders."""
import filecmp
import json
import re
from pathlib import Path

TASKS = Path(__file__).resolve().parent.parent / "tasks"
HINT = re.compile(r"\b(race|timing|latenc\w*|flak\w*|stale|in flight|still loading|slower|before|after|first await)\b", re.I)
COMMENT = re.compile(r"//(.*)|/\*(.*?)\*/|<!--(.*?)-->")
# reference-fix comments that leaked into four negative apps before Study 1 ran; disclosed in RESULT.md
KNOWN_NEGATIVE_LEAKS = {"n3-search/public/app.js", "n4-groceries/public/app.js", "n5-shortcut/public/app.js",
                        "n6-inbox/public/header.js"}


def kind(task: Path) -> str:
    return json.loads((task / "task.json").read_text(encoding="utf-8"))["kind"]


def hinting_files(task: Path) -> set[str]:
    found = set()
    for path in (task / "public").rglob("*"):
        if path.suffix in {".js", ".mjs", ".html", ".css"}:
            comments = " ".join("".join(m) for m in COMMENT.findall(path.read_text(encoding="utf-8")))
            if HINT.search(comments):
                found.add(path.relative_to(TASKS).as_posix())
    return found


def test_every_task_has_what_the_oracle_and_review_need():
    for task in sorted(p for p in TASKS.iterdir() if p.is_dir()):
        required = ["task.json", "api.mjs", "public", "tests"]
        required += ["mutant/public", "reference/tests"] if kind(task) == "positive" else ["reference/public"]
        missing = [r for r in required if not (task / r).exists()]
        assert not missing, f"{task.name} lacks {missing}"


def test_negative_controls_share_tests_and_backend_with_their_timing_twin():
    for negative in sorted(TASKS.glob("n[0-9]-*")):
        twin = TASKS / ("t" + negative.name[1:])
        assert filecmp.cmp(negative / "api.mjs", twin / "api.mjs", shallow=False), negative.name
        report = filecmp.dircmp(negative / "tests", twin / "tests")
        assert not (report.diff_files or report.left_only or report.right_only), negative.name


def test_no_comment_the_agent_reads_names_the_bug():
    leaks = set()
    for task in TASKS.iterdir():
        if task.is_dir():
            leaks |= hinting_files(task)
    assert leaks == KNOWN_NEGATIVE_LEAKS, f"new hint in agent-visible code: {sorted(leaks - KNOWN_NEGATIVE_LEAKS)}"
