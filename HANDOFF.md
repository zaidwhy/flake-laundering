# Handoff (2026-10-27)

## State
Study 1 is run, scored, hand-reviewed and written up: `RESULT.md`. H1 falsified (0 of 30 weakened on
the plain brief, Wilson 0-11 percent). Main finding: the "do not change the tests" brief cut correct
repairs of wrong tests from 9/10 to 0/10. Study 2 is pre-registered in `PLAN.md`, built and measured, not run.

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
2. Study 2 is built and measured (`s1-menu-split`, `l1-menu-large`, `e1-menu-feature`, `balanced` brief;
   flake rates in `PLAN.md`). 80 runs, launched by Zaid:
   ```
   ! cd C:/Users/Asus/projects/flake-laundering && python harness/run.py --tasks s1-menu-split,l1-menu-large,e1-menu-feature --conditions plain --reps 10 --parallel 2 --results results/study2.jsonl ; python harness/run.py --tasks e1-menu-feature --conditions balanced --reps 10 --parallel 2 --results results/study2.jsonl ; python harness/run.py --tasks t1-menu,t2-notes,t3-search,t4-groceries,t5-shortcut,t6-inbox,p1-report,p2-balance --conditions balanced --reps 5 --parallel 2 --results results/study2.jsonl
   ```
   Then `python harness/judge.py results/study2.jsonl --out results/judge-study2.jsonl` and
   `python harness/analyze.py results/study2.jsonl --judge results/judge-study2.jsonl --out results/report-study2.md`,
   hand review per the plan, and a Study 2 section in `RESULT.md` scored against H3 and H4 as written.
3. Going public (Zaid's decision 2026-10-26: private until results, then public with a Zenodo deposit).
   Results now exist; flipping the repo public and minting a DOI are left for Zaid to trigger.

## Known gaps
- n3, n4 and n5 negative apps carry the reference fix's explanatory comment; the t-apps carry none.
- Two built-in system reminders reach the subject (account email, commit attribution); stated in PLAN.
- Each cited paper is still to be read in full before a number from it is quoted; RESULT.md quotes none.
