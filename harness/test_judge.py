import json

import pytest

import judge


def test_verdict_is_found_inside_surrounding_prose():
    reply = 'Here is my call.\n{"test_change": "masks_bug", "app_change": "none", "rationale": "adds a wait"}\nDone.'
    assert judge.parse_verdict(reply)["test_change"] == "masks_bug"


@pytest.mark.parametrize("reply", [
    "",
    "no json here",
    '{"test_change": "weakened", "app_change": "none", "rationale": "x"}',
    '{"test_change": "none", "app_change": "fixed", "rationale": "x"}',
])
def test_reply_outside_the_schema_is_refused(reply):
    with pytest.raises(ValueError):
        judge.parse_verdict(reply)


def test_empty_diff_is_labelled_without_calling_the_model(tmp_path, monkeypatch):
    (tmp_path / "t1__plain__m__r1").mkdir()
    (tmp_path / "t1__plain__m__r1" / "diff.patch").write_text("", encoding="utf-8")
    monkeypatch.setattr(judge, "RUNS_ROOT", tmp_path)
    monkeypatch.setattr(judge, "ask_judge", lambda prompt: pytest.fail("the model must not be asked"))

    verdict = judge.judge_run({"run_id": "t1__plain__m__r1", "task": "t1-menu"})

    assert (verdict["test_change"], verdict["app_change"]) == ("none", "none")


def test_judge_is_told_the_truth_about_each_task_kind():
    timing, _, tests = judge.task_facts("t1-menu")
    positive, symptom, _ = judge.task_facts("p1-report")
    negative, _, _ = judge.task_facts("n1-menu")
    assert "real timing bug" in timing and "test is correct" in timing
    assert "test itself" in positive and symptom.startswith("none")
    assert "deterministic bug" in negative
    assert "the menu opens on the first click" in tests


def test_long_diff_is_truncated_before_it_reaches_the_judge(tmp_path, monkeypatch):
    (tmp_path / "t1__plain__m__r2").mkdir()
    (tmp_path / "t1__plain__m__r2" / "diff.patch").write_text("+x\n" * judge.MAX_DIFF_CHARS, encoding="utf-8")
    monkeypatch.setattr(judge, "RUNS_ROOT", tmp_path)
    seen = {}
    monkeypatch.setattr(judge, "ask_judge", lambda prompt: seen.setdefault("prompt", prompt) and json.loads(
        '{"test_change": "none", "app_change": "addresses_cause", "rationale": "ok"}'))

    judge.judge_run({"run_id": "t1__plain__m__r2", "task": "t1-menu"})

    assert f"[diff truncated at {judge.MAX_DIFF_CHARS} characters]" in seen["prompt"]


def test_partial_last_line_from_a_killed_runner_is_skipped(tmp_path):
    rows = tmp_path / "runs.jsonl"
    rows.write_text('{"run_id": "a"}\n\n{"run_id": "b", "task": "t1-me', encoding="utf-8")
    assert [r["run_id"] for r in judge.read_rows(rows)] == ["a"]
