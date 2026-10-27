import json

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
                          (["--tasks", "t1-menu", "--reps", "0"], "--reps must be 1..20, got 0")):
        monkeypatch.setattr("sys.argv", ["run.py", *argv])
        monkeypatch.setattr(run, "execute", lambda *a, **k: (_ for _ in ()).throw(AssertionError("no run may start")))
        with pytest.raises(SystemExit) as stop:
            run.main()
        assert stop.value.code == 2
        assert message in capsys.readouterr().err
