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

`python -m pytest harness -q` -> 27 passed (CI runs the same on every push).

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

## Known gaps
- n3, n4 and n5 negative apps carry the reference fix's explanatory comment; the t-apps carry none.
- Two built-in system reminders reach the subject (account email, commit attribution); stated in PLAN.
