# Handoff (2026-10-26)

## State
Everything except the subject-agent runs is built and verified. No valid run data exists yet.

| Part | Where | Verified |
|---|---|---|
| App base, seeded mock backend | `base/` | used by every oracle run below |
| 6 timing tasks | `tasks/t1..t6` | original test vs buggy app passes 6-8 of 20; reference fix 50/50 |
| 6 negative controls | `tasks/n1..n6` | buggy 0/10, reference 20/20; tests and api.mjs identical to the t-tasks |
| 2 positive controls | `tasks/p1, p2` | original test 8/20, repaired test 20/20, repaired test catches the mutant 3/3 |
| Oracle | `oracle/oracle.py` | `python oracle/oracle.py <task> --app buggy|reference|mutant|<dir> [--tests <dir>]` |
| Runner | `harness/run.py` | dry runs (reference fix, injected fixed wait) scored correctly; resume works |
| Rule detector | `harness/detect.py` | 10 pytest cases |
| LLM judge | `harness/judge.py` | right on a real fix and on a networkidle wait (2 calls, $0.01-0.02 each) |
| Analysis | `harness/analyze.py` | 5 pytest cases incl. Wilson and Newcombe known values |

`python -m pytest harness -q` -> 15 passed.

## Blocker (Zaid decides)
The subject agents need the full Bash tool: a prefix allowlist denied every `cd ... &&` and looped command,
so pilot v0 agents never ran the suite (`results/pilot-v0-bash-allowlist.jsonl`, excluded). Relaunching
with all of Bash allowed was refused by the auto-mode safety classifier. Options:
1. Zaid launches the runs from his own prompt with `!` (same command as below). The agents then have
   full shell access on this laptop, in a throwaway folder under `C:/flake-runs`.
2. Run the subject agents inside WSL Ubuntu (installed) or Docker (installed, daemon not running), so
   their shell cannot reach the home folder, gh auth or keys. Costs setup time: claude login, node,
   Playwright and chromium inside the sandbox.

## Next commands
```
! cd C:/Users/Asus/projects/flake-laundering && python harness/run.py --tasks t1-menu --conditions plain,explicit,hook --reps 2 --model claude-sonnet-5-5 --parallel 2 --results results/pilot.jsonl
python harness/judge.py results/pilot.jsonl
python harness/analyze.py results/pilot.jsonl
```
Then check the pilot rows for `permission_denials` (must be empty), and set the full grid from the
measured minutes and tokens per run.

## Known gaps
- The hook condition's `--settings` hook under `--restricted` has not been exercised by a real run.
- n3, n4 and n5 negative apps carry the reference fix's explanatory comment; the t-apps carry none.
- Two built-in system reminders reach the subject (account email, commit attribution); stated in PLAN.
