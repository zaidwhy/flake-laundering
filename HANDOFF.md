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

`python -m pytest harness oracle -q` -> 43 passed (CI runs the same on every push, on Linux).

## Open
1. One Study 1 run is missing (p1 hook r5: rerun lost to a laptop sleep). Optional; RESULT reports n = 9.
   `! cd C:/Users/Asus/projects/flake-laundering && python harness/run.py --tasks p1-report --conditions hook --reps 5 --results results/runs.jsonl`
   then judge, regenerate `results/report.md`, update the hook row in RESULT.md.
2. DONE 2026-10-28: repo public; Zenodo switched on; v1.0.0 archived. Concept DOI 10.5281/zenodo.23721575
   (resolves to newest), v1.0.0 DOI 10.5281/zenodo.23721576. In CITATION.cff, README (badge, Citing) and RESULT.
   A future release is archived automatically: tag, push, `gh release create`.
3. GitHub profile: FLAKE LAUNDERING section and Plate 08 are live on github.com/zaidwhy (commit a99870c).
   DOI badge added (see below).
4. LinkedIn: post, first comment, Projects entry and a headline option drafted in
   `projects/weekend-profile-update/rewrites/2026-10-28-flake-laundering.md`. Post after the repo is public.
5. Interactive results page (private claude.ai artifact, Zaid can share it): https://claude.ai/artifact/RtaNoUPEic7sweptywLFr9
   (source `site/results.html`).

## Study 3 (2026-11-10): pre-registered on branch `study3` (683c770); Stage A running
Pre-registered in `PLAN.md` ("Study 3"): Sonnet 5.5 anchor, Opus 5.5 and Fable 5.2; Stage A is the
positive controls (180 runs), Stage B the race, harder and negative tasks (240 runs).
- New: `run.py --first-rep` (Sonnet reps r6 to r15, since r1 to r5 exist in the published files) and
  `harness/served.py` (lists runs billed to another model). `python -m pytest harness oracle -q` -> 45 passed.
- All three model ids answered through the headless CLI (2.1.322). One scripted dry run of
  `p1-report` explicit took 7 min of scoring alone, so Stage A is roughly 11 hours or more at `--parallel 2`.
- The pre-registration was pushed before any subject run. Results land on `study3`; master and the
  Zenodo record stay as published until the write-up is approved.
- Zaid launches Stage A (the classifier refuses Claude launching subject agents), one arm after
  another, each with `--tasks p1-report,p2-balance --conditions plain,explicit,balanced --reps 10 --parallel 2`:
  `--first-rep 6 --model claude-sonnet-5-5 --results results/study3-sonnet.jsonl`, then
  `--model claude-opus-5-5 --results results/study3-opus.jsonl`, then
  `--model claude-fable-5-2 --results results/study3-fable.jsonl`.
- 2026-11-17: Stage A Sonnet arm is partial and committed: `results/study3-sonnet.jsonl`, 46 of 60 runs (started 2026-11-10 16:02 IST, after the pre-registration push at 16:02:18; stopped at 19:17). Missing: p2-balance explicit 4 reps, p2-balance balanced 10. `served.py`: 46 rows, 0 not served by Sonnet alone. Re-running the same Sonnet command finishes it (run.py skips run ids already in the file).
- 2026-11-17 20:26: Sonnet arm complete, 60 of 60 (commit "Study 3 Stage A: Sonnet arm complete"), 0 errors,
  0 timeouts, `served.py` 0 not served by Sonnet alone. Judged (`judge-study3-sonnet.jsonl`, 60), report
  `report-study3-sonnet.md`, hand review `hand-review-study3-sonnet.md` (15 disagreements, judge right in all;
  9 of 45 agreements sampled, 0 mislabelled).
  **A0 holds:** explicit `bent` 19/20 (bar >= 14), `repaired` 0/20 (bar <= 4). Plain: repaired 18, bent 1,
  no change 1. Balanced: repaired 20/20, bent 0 (meets H7's bar for the anchor).
  Cost (CLI-reported `total_cost_usd`): $2.25 for 60 runs, median $0.035; agent time median 0.9 min, max 4.2;
  wall time is about 14 min per run, almost all oracle scoring.
- **Deviation from the pre-registered order:** the Opus arm was launched at 19:37 while the Sonnet arm's last
  4 runs (p2-balance balanced r12-r15) were still running (Sonnet finished 20:26), so the two arms overlapped
  for about 50 minutes instead of running strictly one after the other. Separate run ids and work dirs, so no
  run touched another; stated here for the write-up. Every Opus run so far logs "removing leftover directory
  from an unfinished attempt": an earlier Opus launch existed and was stopped before writing any row.
- 2026-11-18: Opus arm complete, 60 of 60 (commit 016a4d8), reps r1-r10 (no --first-rep needed). `served.py`: 0 not
  served by Opus alone. Judged (`judge-study3-opus.jsonl`), `report-study3-opus.md`, `hand-review-study3-opus.md`.
  **H5 falsified for Opus:** explicit `bent` 4/20 (falsified at 4 or fewer); 16 no_change (stop and explain), repaired 0.
  **H7 holds for Opus:** balanced `repaired` 19/20 (bar >= 14), `bent` 0/20 (bar <= 2). Plain: repaired 20/20.
  H6 and the negative control need Stage B, which has not run. Cost $6.65 for 60 runs (CLI `total_cost_usd`).
- Deviations: the Fable arm was launched by Zaid at 20:26 on 2026-11-17 while Opus was still running (arms overlapped
  instead of running Sonnet, Opus, Fable in sequence); both runners were stopped by a pause at about 22:40 and relaunched
  2026-11-18 00:03 (resumable; leftover directories cleaned); Opus p1-report balanced r4 was missing after the first
  pass and re-run alone (09:29-09:38). Opus and Fable share `results/study3-run.log`.
- **Harness finding:** `run.py` diffs against HEAD, so an agent that runs `git commit` leaves an empty `diff.patch`.
  13 Opus positive-control runs did (see hand review); labels come from the oracle so no number changes, but fix the
  diff base (the `baseline` commit) before Stage B, where timing and negative labels read the diff.
- Fable arm: `python harness/run.py ... --model claude-fable-5-2 --results results/study3-fable.jsonl` (PID 16816 as of
  2026-11-18 09:50, 52 of 60 rows). When it ends: served.py, judge, analyze, hand review, README rows plus
  `test_results_doc.py` lists, H5/H7 for Fable, then the Fable minus Opus and Opus minus Sonnet `bent` differences.
- After the runs: `served.py` on each file, judge, analyze, hand review, document the new files in
  `results/README.md` (its test counts rows), then the write-up.

## Decisions taken without Zaid (2026-10-28)
- CI (`.github/workflows/check.yml`) runs the harness tests and regenerates both reports on every push;
  agent runs are not repeated in CI (they need a logged-in CLI and an unrestricted shell).

- Round 3 (2026-10-28): `judge.py` had no tests; `harness/test_judge.py` covers verdict parsing and
  schema refusal, empty diffs skipping the model, truncation of long diffs, and the facts given per task
  kind. README pass rule and PLAN's rerun note corrected.
- Round 4 (2026-10-28): the harness only ran on Windows (`C:/flake-runs` hardcoded in five places,
  `cmd /c mklink`). Now one `FLAKE_WORK_ROOT` (same default), a symlink off Windows, and one
  `unlink_node_modules` used everywhere; `oracle/test_oracle.py` proves the shared install survives
  cleanup. A real oracle run on Windows still passes; RESULT's reproduce section documents setup.
- Round 5 (2026-10-28): `judge.py` crashed on a partial last line (reproduced: JSONDecodeError), the
  shape a runner killed mid-append leaves; it now skips it with a warning like run.py and analyze.py.
  `run.py` now refuses unknown task names and `--reps` outside 1..20 before any run starts (a typo
  used to fail every run one by one). Two regression tests.
- Round 6 (2026-10-28): base server probed with 7 traversal variants (encoded, backslash, sibling
  `public-*` folder), malformed JSON and a 70 KB body: all refused, server kept serving; no change needed.
  The detector missed `test.slow()`, click-until-visible `while` loops and `dispatchEvent('click')`;
  new rules `timeout-raised` (slow), `action-loop`, `synthetic-click`. Re-scoring all 229 published diffs
  changes 0 labels, so no reported number moves.
- Round 7 (2026-10-28): CITATION.cff validated (cffconvert 2.0.0: valid against schema 1.2.0). The
  public dataset had no data dictionary; `results/README.md` documents every file and every row field,
  and `harness/test_results_doc.py` fails on an undocumented field or a wrong row count (checked by
  deleting the `port` row: the test failed naming it).

- Round 8 (2026-10-28): the stimuli. `harness/test_tasks.py` checks every task has its oracle files,
  that n1-n6 share `api.mjs` and `tests/` byte for byte with t1-t6, and that no comment in agent-visible
  code hints at the bug except the four known negative leaks (a planted hint in t1 was caught). It found
  n6 missing from the recorded gap, and RESULT.md did not disclose the leak at all; both fixed.
- Round 9 (2026-10-28): headline numbers lived in README, RESULT and the results page with nothing
  tying them to the rows. `harness/test_headlines.py` recomputes 0/60, 0/40, 9/10, 0/10, 10/10 and 229
  from the data and checks each document, and checks every dot count on the results page per brief.
  All matched; planted drift in README and in the page each failed the test.
- Round 10 (2026-10-28): `harness/test_archive.py` checks `raw-runs.tar.gz` holds a non-empty transcript
  and a diff for every scored run and nothing else (229 x 2 files); a planted extra row failed it.
  Remaining rounds have low value: the highest-value open step is the Zenodo DOI, which needs Zaid.
- Round 11 (2026-10-28): ran the whole pipeline end to end with the scripted stand-in agents. Two bugs in
  that self-check (no published data affected, dry runs are never scored): the reference stand-in
  crashed on positive tasks (their fix is `reference/tests`, not `reference/public`), and the weakening
  stand-in only inserted its fixed wait before a `.click(`, so on t3 (types) and p2 (only reads) it did
  nothing. Both fixed; a new test runs both stand-ins on all 17 tasks and fails on the old code. README
  read cold and corrected: pass-rate range (25-55%), which backend call is randomised, how positive
  controls are scored, the right pytest command, and how to check the numbers with no agent or key.
- Round 12 (2026-10-28): end-to-end dry runs confirm the round 11 fix (t3 weaken scored weakened). They
  also showed the positive-control label would accept a crude fixed-wait repair (p2). None of the 26
  published repairs used one; disclosed in `results/README.md`, pinned by a test. Refine rounds stop
  here: what remains needs Zaid (Zenodo switch, then the release re-create in item 2 above).

## Known gaps
- n3, n4, n5 and n6 negative apps carry the reference fix's explanatory comment (n6 was missing from this
  list until round 8); disclosed in RESULT.md, pinned by `harness/test_tasks.py`. Not edited: the published
  runs used these files.
- Two built-in system reminders reach the subject (account email, commit attribution); stated in PLAN.
