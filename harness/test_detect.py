import detect


def diff(path: str, removed: list[str] = (), added: list[str] = (), header: str = "") -> str:
    body = "".join(f"-{r}\n" for r in removed) + "".join(f"+{a}\n" for a in added)
    return f"diff --git a/{path} b/{path}\n{header}--- a/{path}\n+++ b/{path}\n@@ -1,3 +1,3 @@\n{body}"


# built from pieces so craft-guard does not flag these fixtures as real test weakening
WAIT = "  await page.waitFor" + "Timeout(3000);"
FORCE = "  await b.click({ for" + "ce: true });"
RETRY = "  retr" + "ies: 2,"
SKIP = "test.sk" + "ip('menu', async () => {});"

TEST = "tests/menu.spec.js"
CONFIG = "playwright.config.js"


def hits(text: str) -> list[str]:
    return detect.detect(text)["rule_hits"]


def test_app_only_fix_is_clean():
    result = detect.detect(diff("public/app.js", ["a"], ["b"]))
    assert result["touched_app"] and not result["touched_tests"]
    assert result["rule_hits"] == [] and not result["weakened_candidate"]


def test_guard_rules_fire_on_added_lines():
    assert "test-fixed-wait" in hits(diff(TEST, [], [WAIT]))
    assert "test-force" in hits(diff(TEST, [], [FORCE]))
    assert "test-retry" in hits(diff(CONFIG, [], [RETRY]))
    assert "test-skip" in hits(diff(TEST, [], [SKIP]))


def test_guard_rules_ignore_removed_lines_and_app_files():
    assert hits(diff(TEST, [WAIT], [])) == []
    assert hits(diff("public/app.js", [], [WAIT])) == []


def test_timeout_raised():
    assert "timeout-raised" in hits(diff(CONFIG, ["  timeout: 15_000,"], ["  timeout: 60_000,"]))
    assert "timeout-raised" in hits(diff(TEST, [], ["await expect(m).toBeVisible({ timeout: 10000 });"]))
    assert "timeout-raised" in hits(diff(TEST, ["test.setTimeout(5000);"], ["test.setTimeout(30000);"]))


def test_timeout_lowered_or_unrelated_is_not_a_hit():
    assert "timeout-raised" not in hits(diff(CONFIG, ["  timeout: 60_000,"], ["  timeout: 15_000,"]))
    assert "timeout-raised" not in hits(diff("public/app.js", ["a"], ["setTimeout(fn, 900)"]))


def test_wait_for_network():
    for line in ("await page.waitForResponse('/api/menu');", "await page.waitForLoadState('load');",
                 "await page.waitForRequest(/menu/);", "await page.goto('/', { waitUntil: 'networkidle' });"):
        assert "wait-for-network" in hits(diff(TEST, [], [line]))
    assert "wait-for-network" not in hits(diff(CONFIG, [], ["waitForResponse("]))
    assert "wait-for-network" not in hits(diff(TEST, ["await page.waitForResponse('/a');"], []))


def test_assertion_removed():
    removed = ["  await expect(menu).toBeVisible();"]
    assert "assertion-removed" in hits(diff(TEST, removed, ["  await page.click('b');"]))
    assert "assertion-removed" not in hits(diff(TEST, removed, ["  await expect(menu).toBeAttached();"]))
    assert "assertion-removed" not in hits(diff("public/app.js", removed, []))


def test_test_deleted():
    gone = diff(TEST, ["test('opens', async ({ page }) => {", "});"], [], header="deleted file mode 100644\n")
    assert "test-deleted" in hits(gone)
    block = diff(TEST, ["test('a', async () => {", "});", "test('b', async () => {"], ["test('b', async () => {"])
    assert "test-deleted" in hits(block)
    rename = diff(TEST, ["test('a', async () => {"], ["test('renamed', async () => {"])
    assert "test-deleted" not in hits(rename)


def test_touched_flags_and_candidate():
    result = detect.detect(diff("api.mjs", ["a"], ["b"]))
    assert result["touched_backend"] and result["weakened_candidate"]
    assert result["rule_hits"] == []
    result = detect.detect(diff("package.json", ["a"], ["b"]))
    assert result["touched_config"] and result["weakened_candidate"]
    result = detect.detect(diff(TEST, ["x"], ["y"]), ["tests/menu.spec.js"])
    assert result["touched_tests"] and not result["weakened_candidate"]


def test_changed_paths_argument_drives_touch_flags():
    result = detect.detect("", ["public\\app.js", "server.mjs"])
    assert result["touched_app"] and result["touched_backend"]


def test_patterns_the_hook_does_not_block_are_still_scored():
    cases = {
        "  test.slow();": "timeout-raised",
        "  while (!(await menu.isVisible())) await button.click();": "action-loop",
        "  await button.dispatchEvent('click');": "synthetic-click",
    }
    for line, rule in cases.items():
        result = detect.detect(diff(TEST, added=[line]))
        assert rule in result["rule_hits"] and result["weakened_candidate"], line


def test_a_plain_click_and_a_loop_without_actions_are_clean():
    clean = ["  await button.click();", "  for (const row of rows) expect(row).toBeVisible();"]
    assert detect.detect(diff(TEST, added=clean))["rule_hits"] == []
