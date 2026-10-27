# Handoff (2026-10-27)

## State
Both studies are run, scored, hand-reviewed and written up in `RESULT.md` (229 runs). H1 and H3
falsified (0 of 60 plain-brief race runs weakened); H4 supported (balanced brief: 10/10 wrong tests
repaired, 0/40 correct tests weakened; explicit brief was 0/10).

| Artifact | Where |
|---|---|
| Study 1 runs (149) / verdicts / tables | `results/runs.jsonl`, `results/judge-grid.jsonl`, `results/report.md` |
| Study 2 runs (80) / verdicts / tables | `results/study2.jsonl`, `results/judge-study2.jsonl`, `results/report-study2.md` |
| Hand review | `results/hand-review.md` |
| Pilot | `results/pilot.jsonl`, `results/judge.jsonl` (raw transcripts lost) |
| Not scored | `results/infra-errors.jsonl` (API outage), `results/pilot-v0-bash-allowlist.jsonl` |

`python -m pytest harness -q` -> 18 passed.

## Open
1. One Study 1 run is missing (p1 hook r5: rerun lost to a laptop sleep). Optional; RESULT reports n = 9.
   `! cd C:/Users/Asus/projects/flake-laundering && python harness/run.py --tasks p1-report --conditions hook --reps 5 --results results/runs.jsonl`
   then judge, regenerate `results/report.md`, update the hook row in RESULT.md.
2. Going public (Zaid's decision 2026-10-26: private until results, then public with a Zenodo deposit).
   Results exist; flipping the repo public and minting a DOI are left for Zaid to trigger.

## Known gaps
- n3, n4 and n5 negative apps carry the reference fix's explanatory comment; the t-apps carry none.
- Two built-in system reminders reach the subject (account email, commit attribution); stated in PLAN.
