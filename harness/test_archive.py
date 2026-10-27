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
