# Handoff (2026-10-27)

## State
Study 1 is run, scored, hand-reviewed and written up: `RESULT.md`. H1 falsified (0 of 30 weakened on
the plain brief, Wilson 0-11 percent). Main finding: the "do not change the tests" brief cut correct
repairs of wrong tests from 9/10 to 0/10. Study 2 is pre-registered in `PLAN.md`, not built.

| Artifact | Where |
|---|---|
| Scored runs (148) | `results/runs.jsonl` |
| Judge verdicts | `results/judge-grid.jsonl` (pilot's own in `results/judge.jsonl`) |
| Tables | `results/report.md` (`python harness/analyze.py results/runs.jsonl --judge results/judge-grid.jsonl --out results/report.md`) |
| Hand review | `results/hand-review.md` |
| API-outage runs, not scored | `results/infra-errors.jsonl`; folders in `C:/flake-runs/infra-errors/` |

`python -m pytest harness -q` -> 18 passed.

## Open
1. Rerun the two p1 hook runs that hit `ENOTFOUND` (needs Zaid's `!`; the classifier refuses agent launches from Claude):
   ```
   ! cd C:/Users/Asus/projects/flake-laundering && python harness/run.py --tasks p1-report --conditions hook --reps 5 --results results/runs.jsonl
   ```
   then `python harness/judge.py results/runs.jsonl --out results/judge-grid.jsonl`, regenerate the
   report, and update the positive-control hook row in `RESULT.md` (now n = 8).
2. Study 2: build the `split`, `large`, `embedded` tasks and the `balanced` brief per `PLAN.md`, measure
   flake rates, then Zaid launches the grid.
3. Going public (Zaid's decision 2026-10-26: private until results, then public with a Zenodo deposit).
   Results now exist; flipping the repo public and minting a DOI are left for Zaid to trigger.

## Known gaps
- n3, n4 and n5 negative apps carry the reference fix's explanatory comment; the t-apps carry none.
- Two built-in system reminders reach the subject (account email, commit attribution); stated in PLAN.
- Each cited paper is still to be read in full before a number from it is quoted; RESULT.md quotes none.
