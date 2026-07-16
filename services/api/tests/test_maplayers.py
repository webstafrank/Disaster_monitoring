"""Gate tests for the GeoServer map-layer catalog.

Deterministic and free: capabilities parsing runs against a canned WMS document
and the catalog is exercised with an injected fetcher, so nothing touches the
network. The live GeoServer is checked in the (out-of-gate) manual/eval lane.
"""

import os

os.environ.setdefault("DATA_SOURCE", "stub")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app import config, geoserver_layers  # noqa: E402
from app.main import app  # noqa: E402

client = TestClient(app)

# WMS 1.3.0 GetCapabilities: a root container <Layer> (no <Name>, skipped) wrapping
# two published layers. One carries a geographic bbox and is queryable.
CAPS = b"""<?xml version="1.0" encoding="UTF-8"?>
<WMS_Capabilities version="1.3.0" xmlns="http://www.opengis.net/wms">
  <Capability>
    <Layer>
      <Title>GeoServer Web Map Service</Title>
      <Layer queryable="1">
        <Name>asal:ndvi_2024</Name>
        <Title>NDVI 2024</Title>
        <EX_GeographicBoundingBox>
          <westBoundLongitude>33.9</westBoundLongitude>
          <eastBoundLongitude>41.9</eastBoundLongitude>
          <southBoundLatitude>-4.7</southBoundLatitude>
          <northBoundLatitude>5.0</northBoundLatitude>
        </EX_GeographicBoundingBox>
      </Layer>
      <Layer queryable="0">
        <Name>asal:counties</Name>
        <Title>ASAL County Boundaries</Title>
      </Layer>
    </Layer>
  </Capability>
</WMS_Capabilities>"""

EMPTY_CAPS = b"""<?xml version="1.0" encoding="UTF-8"?>
<WMS_Capabilities version="1.3.0" xmlns="http://www.opengis.net/wms">
  <Capability>
    <Layer><Title>GeoServer Web Map Service</Title></Layer>
  </Capability>
</WMS_Capabilities>"""


def test_parse_capabilities_extracts_named_layers():
    layers = geoserver_layers.parse_capabilities(CAPS, workspace="asal")
    assert [ly.name for ly in layers] == ["asal:ndvi_2024", "asal:counties"]
    ndvi = layers[0]
    assert ndvi.title == "NDVI 2024"
    assert ndvi.workspace == "asal"
    assert ndvi.queryable is True
    assert ndvi.bbox == [33.9, -4.7, 41.9, 5.0]  # [minLon, minLat, maxLon, maxLat]
    assert layers[1].queryable is False
    assert layers[1].bbox is None


def test_parse_capabilities_skips_container_and_handles_junk():
    assert geoserver_layers.parse_capabilities(EMPTY_CAPS) == []
    assert geoserver_layers.parse_capabilities(b"not xml at all") == []


def test_wms_endpoint_workspace_scoping():
    base = "https://gs.example/geoserver"
    assert geoserver_layers.wms_endpoint(base, "") == "https://gs.example/geoserver/wms"
    assert geoserver_layers.wms_endpoint(base, "asal") == "https://gs.example/geoserver/asal/wms"
    assert geoserver_layers.wms_endpoint("", "asal") == ""


def test_url_normalization_adds_scheme_and_strips_slash():
    assert config._normalize_url("geoserver-service-ksa.ksa.go.ke/geoserver/") == (
        "https://geoserver-service-ksa.ksa.go.ke/geoserver"
    )
    assert config._normalize_url("http://internal:8080/geoserver") == "http://internal:8080/geoserver"
    assert config._normalize_url("  ") == ""


def test_get_catalog_reachable(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "https://gs.example/geoserver")
    monkeypatch.setattr(config, "GEOSERVER_PUBLIC_URL", "https://gs.example/geoserver")
    monkeypatch.setattr(config, "GEOSERVER_WORKSPACE", "asal")
    cat = geoserver_layers.get_catalog(fetcher=lambda url, t: CAPS)
    assert cat.available is True
    assert cat.wms_base_url == "https://gs.example/geoserver/asal/wms"
    assert cat.workspace == "asal"
    assert {ly.name for ly in cat.layers} == {"asal:ndvi_2024", "asal:counties"}


def test_get_catalog_unreachable_is_soft(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "https://gs.example/geoserver")
    monkeypatch.setattr(config, "GEOSERVER_PUBLIC_URL", "https://gs.example/geoserver")
    monkeypatch.setattr(config, "GEOSERVER_WORKSPACE", "")
    cat = geoserver_layers.get_catalog(fetcher=lambda url, t: None)
    assert cat.available is False
    assert cat.layers == []
    assert cat.wms_base_url == "https://gs.example/geoserver/wms"  # URL still reported


def test_get_catalog_unconfigured(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_URL", "")
    monkeypatch.setattr(config, "GEOSERVER_PUBLIC_URL", "")

    def _boom(url, t):  # fetcher must never be called when unconfigured
        raise AssertionError("fetcher called despite no GEOSERVER_URL")

    cat = geoserver_layers.get_catalog(fetcher=_boom)
    assert cat.available is False
    assert cat.wms_base_url == ""
    assert cat.layers == []


def test_endpoint_returns_catalog(monkeypatch):
    # Force the no-network path so the gate test is deterministic regardless of env.
    monkeypatch.setattr(config, "GEOSERVER_URL", "")
    monkeypatch.setattr(config, "GEOSERVER_PUBLIC_URL", "")
    r = client.get("/map/layers")
    assert r.status_code == 200
    body = r.json()
    assert body["available"] is False
    assert body["layers"] == []
    assert "wms_base_url" in body


class _FakeResp:
    def __init__(self, status_code, content=b""):
        self.status_code = status_code
        self.content = content

    def raise_for_status(self):
        if self.status_code >= 400:
            raise geoserver_layers.httpx.HTTPStatusError(
                "err", request=None, response=None
            )


def test_http_fetch_retries_with_auth_on_401(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_USER", "admin")
    monkeypatch.setattr(config, "GEOSERVER_PASSWORD", "s3cret")
    calls = []

    def fake_get(url, timeout, auth=None):
        calls.append(auth)
        # Anonymous is rejected; the authenticated retry succeeds.
        return _FakeResp(200, CAPS) if auth is not None else _FakeResp(401)

    monkeypatch.setattr(geoserver_layers.httpx, "get", fake_get)
    out = geoserver_layers._http_fetch("https://gs.example/geoserver/wms?x", 5.0)
    assert out == CAPS
    assert calls == [None, ("admin", "s3cret")]  # tried anonymous, then auth


def test_http_fetch_no_retry_when_creds_unset(monkeypatch):
    monkeypatch.setattr(config, "GEOSERVER_USER", "")
    monkeypatch.setattr(config, "GEOSERVER_PASSWORD", "")
    calls = []

    def fake_get(url, timeout, auth=None):
        calls.append(auth)
        return _FakeResp(401)

    monkeypatch.setattr(geoserver_layers.httpx, "get", fake_get)
    assert geoserver_layers._http_fetch("https://gs.example/geoserver/wms?x", 5.0) is None
    assert calls == [None]  # no auth configured, no retry


@pytest.fixture(autouse=True)
def _clear_cache():
    # Isolate tests from the module-level TTL cache (only used on the default fetcher path).
    geoserver_layers._cache.clear()
    yield
    geoserver_layers._cache.clear()
