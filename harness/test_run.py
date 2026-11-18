import json
import shutil

import pytest

import run


def write_rows(path, run_ids):
    path.write_text("".join(json.dumps({"run_id": r}) + "\n" for r in run_ids), encoding="utf-8")


def test_run_recorded_in_another_results_file_is_not_treated_as_leftover(tmp_path):
    results_dir, runs_root = tmp_path / "results", tmp_path / "runs"
    results_dir.mkdir()
    write_rows(results_dir / "pilot.jsonl", ["t1__plain__m__r1"])
    write_rows(results_dir / "runs.jsonl", [])
    (runs_root / "t1__plain__m__r1").mkdir(parents=True)
    (runs_root / "t1__plain__m__r2").mkdir()

    clashes = run.clashing_runs(["t1__plain__m__r1", "t1__plain__m__r2"], results_dir / "runs.jsonl", runs_root)

    assert clashes == ["t1__plain__m__r1"]


def test_run_in_another_file_without_a_dir_is_free_to_run(tmp_path):
    (tmp_path / "pilot.jsonl").write_text(json.dumps({"run_id": "t1__plain__m__r1"}) + "\n", encoding="utf-8")

    assert run.clashing_runs(["t1__plain__m__r1"], tmp_path / "runs.jsonl", tmp_path / "runs") == []


def test_bad_grid_arguments_stop_before_any_run(monkeypatch, capsys):
    for argv, message in ((["--tasks", "t1-mnu"], "unknown tasks ['t1-mnu']"),
                          (["--tasks", "t1-menu", "--reps", "0"], "--reps must be 1..20, got 0"),
                          (["--tasks", "t1-menu", "--reps", "10", "--first-rep", "12"], "ends at r21")):
        monkeypatch.setattr("sys.argv", ["run.py", *argv])
        monkeypatch.setattr(run, "execute", lambda *a, **k: (_ for _ in ()).throw(AssertionError("no run may start")))
        with pytest.raises(SystemExit) as stop:
            run.main()
        assert stop.value.code == 2
        assert message in capsys.readouterr().err


def test_first_rep_numbers_the_grid_past_reps_recorded_elsewhere(monkeypatch, tmp_path):
    started = []

    def scored_row(task, condition, rep, *_rest):
        started.append(rep)
        return {"run_id": f"{task}__{condition}__m__r{rep}", "fixed_app": True,
                "weakened_candidate": False, "rule_hits": []}

    monkeypatch.setattr(run, "execute", scored_row)
    monkeypatch.setattr(run, "RUNS_ROOT", tmp_path / "runs")
    anchor = tmp_path / "anchor.jsonl"
    monkeypatch.setattr("sys.argv", ["run.py", "--tasks", "t1-menu", "--conditions", "plain", "--reps", "3",
                                     "--first-rep", "6", "--results", str(anchor)])

    assert run.main() == 0
    assert sorted(started) == [6, 7, 8]
    assert len(anchor.read_text(encoding="utf-8").splitlines()) == 3


def test_scripted_agents_do_their_job_on_every_task(tmp_path):
    import detect
    for task_dir in sorted(p for p in run.oracle.TASKS_DIR.iterdir() if p.is_dir()):
        for kind in ("reference", "weaken"):
            workdir = tmp_path / task_dir.name / kind
            for part in ("public", "tests"):
                shutil.copytree(task_dir / part, workdir / part)
            before = {p: p.read_bytes() for p in workdir.rglob("*") if p.is_file()}
            run.fake_agent(kind, task_dir.name, workdir)
            changed = [p for p in workdir.rglob("*") if p.is_file() and before.get(p) != p.read_bytes()]
            assert changed, f"{kind} agent changed nothing in {task_dir.name}"
            if kind == "weaken":
                added = [line for p in changed for line in p.read_text(encoding="utf-8").splitlines()
                         if "waitFor" + "Timeout(3000)" in line]
                assert added, f"weaken agent added no fixed wait in {task_dir.name}"


def test_diff_survives_an_agent_that_commits_its_change(monkeypatch, tmp_path):
    """Stage A: 13 Opus runs ran `git commit`, HEAD moved, and diff.patch came out empty."""
    scripted = run.fake_agent

    def committing_agent(kind, task, workdir):
        scripted("weaken", task, workdir)
        (workdir / "notes-by-agent.txt").write_text("untracked file\n", encoding="utf-8")
        run.git(workdir, "add", "tests")
        run.git(workdir, "commit", "-q", "-m", "agent change")  # HEAD moves past the baseline

    monkeypatch.setattr(run, "fake_agent", committing_agent)
    monkeypatch.setattr(run.oracle, "judge", lambda *a, **k: {"passed": 0, "failed": 1})
    monkeypatch.setattr(run.oracle, "run_tests",
                        lambda *a, **k: {"passed": 0, "failed": 0, "flaky": 0, "unexpected": 0})
    briefs = json.loads((run.REPO_ROOT / "harness" / "briefs.json").read_text(encoding="utf-8"))

    row = run.execute("t1-menu", "plain", 1, "test-model", briefs, "weaken", tmp_path)

    patch = (tmp_path / "t1-menu__plain__test-model__r1" / "diff.patch").read_text(encoding="utf-8")
    assert "waitFor" + "Timeout(3000)" in patch
    assert "notes-by-agent.txt" in patch
    assert any(p.startswith("tests/") for p in row["changed_paths"])
    assert "notes-by-agent.txt" in row["changed_paths"]
