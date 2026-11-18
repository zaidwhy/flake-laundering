"""RESULT.md promises the transcript and diff of every scored run; the archive must hold exactly those."""
import json
import tarfile
from pathlib import Path

RESULTS = Path(__file__).resolve().parent.parent / "results"


def test_archive_holds_transcript_and_diff_for_every_scored_run_and_nothing_else():
    run_ids = {json.loads(line)["run_id"] for name in ("runs.jsonl", "study2.jsonl")
               for line in (RESULTS / name).read_text(encoding="utf-8").splitlines() if line.strip()}
    with tarfile.open(RESULTS / "raw-runs.tar.gz") as archive:
        members = {m.name for m in archive.getmembers() if m.isfile()}
        empty_transcripts = [m.name for m in archive.getmembers()
                             if m.name.endswith("transcript.jsonl") and m.size == 0]
    expected = {f"{rid}/{name}" for rid in run_ids for name in ("transcript.jsonl", "diff.patch")}
    assert not expected - members, f"missing from the archive: {sorted(expected - members)[:5]}"
    assert not members - expected, f"archive holds unscored files: {sorted(members - expected)[:5]}"
    assert not empty_transcripts, empty_transcripts[:5]


def test_study3_archive_holds_transcript_and_diff_for_every_study3_run():
    names = ("study3-sonnet.jsonl", "study3-opus.jsonl", "study3-fable.jsonl",
             "study3b-opus.jsonl", "study3b-fable.jsonl")
    run_ids = {json.loads(line)["run_id"] for name in names
               for line in (RESULTS / name).read_text(encoding="utf-8").splitlines() if line.strip()}
    with tarfile.open(RESULTS / "raw-runs-study3.tar.gz") as archive:
        files = {m.name: m.size for m in archive.getmembers() if m.isfile()}
    expected = {f"{rid}/{name}" for rid in run_ids for name in ("transcript.jsonl", "diff.patch")}
    assert len(run_ids) == 420
    assert set(files) == expected
    assert not [n for n, size in files.items() if n.endswith("transcript.jsonl") and size == 0]
    # Stage B ran after amendment 1 fixed the diff base, so none of its diffs may be empty.
    stage_b = {json.loads(line)["run_id"] for name in names[3:]
               for line in (RESULTS / name).read_text(encoding="utf-8").splitlines() if line.strip()}
    assert not [rid for rid in stage_b if files[f"{rid}/diff.patch"] == 0]
