import oracle


def test_unlinking_node_modules_leaves_the_shared_install_intact(tmp_path, monkeypatch):
    shared = tmp_path / "shared" / "node_modules"
    (shared / "@playwright").mkdir(parents=True)
    (shared / "@playwright" / "marker.txt").write_text("keep me", encoding="utf-8")
    workdir = tmp_path / "app"
    workdir.mkdir()
    monkeypatch.setattr(oracle, "SHARED_NODE_MODULES", shared)

    oracle.link_node_modules(workdir)
    assert (workdir / "node_modules" / "@playwright" / "marker.txt").read_text(encoding="utf-8") == "keep me"
    oracle.unlink_node_modules(workdir)

    assert not (workdir / "node_modules").exists()
    assert (shared / "@playwright" / "marker.txt").read_text(encoding="utf-8") == "keep me"


def test_unlinking_without_a_link_is_a_no_op(tmp_path):
    oracle.unlink_node_modules(tmp_path)
