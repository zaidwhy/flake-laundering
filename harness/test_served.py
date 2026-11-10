import json

import served


def save_transcript(runs_root, run_id, billed):
    run_dir = runs_root / run_id
    run_dir.mkdir(parents=True)
    events = [{"type": "system", "subtype": "init", "model": "fable"},
              {"type": "result", "modelUsage": {name: {"costUSD": 0.01} for name in billed}}]
    (run_dir / "transcript.jsonl").write_text("".join(json.dumps(e) + "\n" for e in events), encoding="utf-8")


def test_only_runs_billed_to_the_requested_model_alone_are_kept(tmp_path):
    save_transcript(tmp_path, "served", ["fable"])
    save_transcript(tmp_path, "swapped", ["opus"])
    save_transcript(tmp_path, "mixed", ["fable", "opus"])
    rows = [{"run_id": name, "model": "fable"} for name in ("served", "swapped", "mixed", "no-transcript")]
    rows.append({"run_id": "scripted", "model": "fable", "dry_run": True})

    assert served.wrongly_served(rows, tmp_path) == [
        ("swapped", ["opus"]), ("mixed", ["fable", "opus"]), ("no-transcript", [])]
