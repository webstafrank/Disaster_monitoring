"""Gate tests for the deep /ready probe. Deterministic: all downstream probes are
injected, nothing touches the network or a database."""

import os

os.environ.setdefault("DATA_SOURCE", "stub")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app import config, readiness  # noqa: E402
from app.main import app  # noqa: E402
from app.sources import SourceUnavailable  # noqa: E402
from app.sources.postgis import PostgresSource  # noqa: E402
from app.sources.stub import StubSource  # noqa: E402

client = TestClient(app)


def _up(_base):
    return True, None


def _down(_base):
    return False, "connection refused"


def test_stub_source_ready_when_downstreams_up(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "")  # optional, unconfigured
    r = readiness.build_readiness(StubSource(), http=_up)
    assert r.ready is True
    by_name = {d.name: d for d in r.dependencies}
    assert set(by_name) == {"data_source", "llm", "forecast", "geoserver"}
    assert by_name["data_source"].ok is True
    assert by_name["geoserver"].ok is True  # unconfigured -> optional, not a failure


def test_llm_down_flips_ready_false(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "")

    def http(base):
        return (False, "boom") if base == config.LLM_URL else (True, None)

    r = readiness.build_readiness(StubSource(), http=http)
    assert r.ready is False
    assert {d.name for d in r.dependencies if not d.ok} == {"llm"}


def test_geoserver_down_does_not_block(monkeypatch):
    # GeoServer configured but unreachable: reported ok=false, readiness still true.
    monkeypatch.setattr(config, "GEOSERVER_URL", "https://gs.example/geoserver")
    monkeypatch.setattr(readiness.geoserver_layers, "get_catalog", lambda: _Catalog(False))
    r = readiness.build_readiness(StubSource(), http=_up)
    assert r.ready is True
    assert next(d for d in r.dependencies if d.name == "geoserver").ok is False


class _Catalog:
    def __init__(self, available):
        self.available = available


def test_postgis_probe_maps_outage_to_not_ok():
    def boom(dsn, sql, params):
        raise SourceUnavailable("db down")

    src = PostgresSource(fetcher=boom)
    dep = readiness._check_data_source(src)
    assert dep.ok is False
    assert "db down" in dep.detail


def test_postgis_probe_ok_when_query_succeeds():
    src = PostgresSource(fetcher=lambda dsn, sql, params: [])
    dep = readiness._check_data_source(src)
    assert dep.ok is True
    assert dep.detail == "postgis"


def test_ready_endpoint_200_when_up(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "")
    monkeypatch.setattr(readiness, "_http_health", _up)
    r = client.get("/ready")
    assert r.status_code == 200
    assert r.json()["ready"] is True


def test_ready_endpoint_503_when_down(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "")
    monkeypatch.setattr(readiness, "_http_health", _down)
    r = client.get("/ready")
    assert r.status_code == 503
    body = r.json()
    assert body["ready"] is False
    assert {d["name"] for d in body["dependencies"] if not d["ok"]} == {"llm", "forecast"}
