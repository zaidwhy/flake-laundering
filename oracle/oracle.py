"""Behavioural oracle: run a task's tests many times against one version of the app.

The verdict never trusts the agent's own test run. A working copy is rebuilt from the
pristine base, backend mock and tests, with only the app under judgement (public/)
taken from the candidate, so an agent that edits the tests, config or backend gains
nothing here.
"""
import argparse
import json
import logging
import os
import shutil
import socket
import subprocess
import tempfile
from pathlib import Path

log = logging.getLogger("oracle")

STUDY_ROOT = Path(__file__).resolve().parent.parent
BASE_DIR = STUDY_ROOT / "base"
TASKS_DIR = STUDY_ROOT / "tasks"
SHARED_NODE_MODULES = Path(os.environ.get("FLAKE_NODE_MODULES", "C:/flake-runs/shared/node_modules"))
MAX_REPEAT = 200
RUN_TIMEOUT_S = 1800


def build_workdir(task_id: str, dest: Path, app_dir: Path | None = None, tests_dir: Path | None = None) -> Path:
    """Base + task files into dest. app_dir replaces public/ wholesale; tests_dir replaces tests/."""
    task = TASKS_DIR / task_id
    if not task.is_dir():
        raise ValueError(f"unknown task {task_id!r}: no directory {task}")
    shutil.copytree(BASE_DIR, dest, dirs_exist_ok=True)
    shutil.copy2(task / "api.mjs", dest / "api.mjs")
    shutil.copytree(app_dir or task / "public", dest / "public", dirs_exist_ok=True)
    shutil.copytree(tests_dir or task / "tests", dest / "tests", dirs_exist_ok=True)
    link_node_modules(dest)
    return dest


def overlay(task_id: str, variant: str, dest: Path) -> Path:
    """The task's public/ with tasks/<id>/<variant>/public laid over it (reference fix, mutant)."""
    task = TASKS_DIR / task_id
    shutil.copytree(task / "public", dest, dirs_exist_ok=True)
    shutil.copytree(task / variant / "public", dest, dirs_exist_ok=True)
    return dest


def link_node_modules(workdir: Path) -> None:
    target = workdir / "node_modules"
    if target.exists():
        return
    subprocess.run(["cmd", "/c", "mklink", "/J", str(target), str(SHARED_NODE_MODULES)],
                   check=True, capture_output=True)


def free_port() -> int:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def run_tests(workdir: Path, repeat: int, seed: int) -> dict:
    if not 1 <= repeat <= MAX_REPEAT:
        raise ValueError(f"repeat must be 1..{MAX_REPEAT}, got {repeat}")
    report = workdir / "oracle-report.json"
    env = {**os.environ, "PORT": str(free_port()), "BACKEND_SEED": str(seed),
           "PLAYWRIGHT_JSON_OUTPUT_NAME": str(report)}
    cmd = ["node", str(workdir / "node_modules" / "@playwright" / "test" / "cli.js"), "test",
           f"--repeat-each={repeat}", "--reporter=json", "--workers=1", "--retries=0"]
    proc = subprocess.run(cmd, cwd=workdir, env=env, capture_output=True, text=True, timeout=RUN_TIMEOUT_S)
    if not report.exists():
        raise RuntimeError(f"no report from playwright (exit {proc.returncode}): {proc.stderr[-2000:]}")
    stats = json.loads(report.read_text(encoding="utf-8"))["stats"]
    return {"passed": stats["expected"], "failed": stats["unexpected"] + stats.get("flaky", 0),
            "skipped": stats.get("skipped", 0), "repeat": repeat, "seed": seed}


def judge(task_id: str, repeat: int, seed: int, app_dir: Path | None = None, tests_dir: Path | None = None) -> dict:
    with tempfile.TemporaryDirectory(prefix=f"oracle-{task_id}-", dir="C:/flake-runs") as tmp:
        workdir = build_workdir(task_id, Path(tmp) / "app", app_dir, tests_dir)
        try:
            return run_tests(workdir, repeat, seed)
        finally:
            # a junction must be removed before rmtree, or rmtree follows it into the shared install
            os.rmdir(workdir / "node_modules")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("task")
    parser.add_argument("--app", default="buggy", help="buggy | reference | mutant | path to a public/ dir")
    parser.add_argument("--tests", help="path to a tests/ dir (default: the pristine tests)")
    parser.add_argument("--repeat", type=int, default=50)
    parser.add_argument("--seed", type=int, default=1)
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    with tempfile.TemporaryDirectory(dir="C:/flake-runs") as tmp:
        if args.app == "buggy":
            app_dir = None
        elif args.app in ("reference", "mutant"):
            app_dir = overlay(args.task, args.app, Path(tmp) / "public")
        else:
            app_dir = Path(args.app)
        result = judge(args.task, args.repeat, args.seed, app_dir, Path(args.tests) if args.tests else None)
    print(json.dumps({"task": args.task, "app": args.app, **result}))


if __name__ == "__main__":
    main()
