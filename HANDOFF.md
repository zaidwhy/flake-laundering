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
2. Repo is PUBLIC since 2026-10-28 (description and topics set). Remaining for the DOI:
   On zenodo.org/account/settings/github switch flake-laundering ON (Zenodo only archives a release
   made after the toggle), then:
   ```
   ! cd C:/Users/Asus/projects/flake-laundering && git tag -s v1.0.0 -m "v1.0.0: two studies, 229 runs" && git push origin v1.0.0 && gh release create v1.0.0 --title "v1.0.0: two pre-registered studies, 229 runs" --notes-file RESULT.md
   ```
   Confirm the DOI: `curl -s "https://zenodo.org/api/records?q=flake-laundering&sort=mostrecent"`.
   Then add the DOI to CITATION.cff, README and RESULT.
3. GitHub profile: FLAKE LAUNDERING section and Plate 08 are live on github.com/zaidwhy (commit a99870c).
   Add the DOI badge once minted.
4. LinkedIn: post, first comment, Projects entry and a headline option drafted in
   `projects/weekend-profile-update/rewrites/2026-10-28-flake-laundering.md`. Post after the repo is public.
5. Interactive results page (private claude.ai artifact, Zaid can share it): https://claude.ai/artifact/RtaNoUPEic7sweptywLFr9
   (source `site/results.html`).

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
