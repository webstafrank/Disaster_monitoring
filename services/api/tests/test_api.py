"""Gate tests for the HTTP endpoints, driven through the stub source.

The LLM service is not running in the gate lane, so /insight exercises the
llm_client fallback (generated=False). That is intentional: gate tests are free
and deterministic; narrative quality is checked in the paid eval lane.
"""

import os

os.environ.setdefault("DATA_SOURCE", "stub")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["data_source"] == "stub"


def test_locations():
    r = client.get("/locations")
    assert r.status_code == 200
    ids = [loc["id"] for loc in r.json()]
    assert "turkana" in ids
    assert len(ids) == 10


def test_indicators():
    r = client.get("/indicators")
    assert r.status_code == 200
    ids = [i["id"] for i in r.json()]
    assert {"ndvi", "vci", "spi", "rainfall", "flood"} <= set(ids)


def test_observations_ok():
    r = client.get("/observations", params={"location": "turkana", "indicator": "vci"})
    assert r.status_code == 200
    body = r.json()
    assert body["source"] == "stub"
    assert body["unit"] == "percent"
    assert len(body["points"]) == 48


def test_observations_date_filter():
    r = client.get(
        "/observations",
        params={"location": "turkana", "indicator": "vci", "from": "2024-01", "to": "2024-12"},
    )
    assert r.status_code == 200
    pts = r.json()["points"]
    assert len(pts) == 12
    assert pts[0]["t"] == "2024-01"
    assert pts[-1]["t"] == "2024-12"


def test_observations_deterministic():
    a = client.get("/observations", params={"location": "garissa", "indicator": "ndvi"}).json()
    b = client.get("/observations", params={"location": "garissa", "indicator": "ndvi"}).json()
    assert a == b


def test_observations_unknown_location():
    r = client.get("/observations", params={"location": "nope", "indicator": "vci"})
    assert r.status_code == 404
    assert r.json()["error"] == "not_found"


def test_insight_shape():
    r = client.post("/insight", json={"location": "marsabit", "indicator": "vci"})
    assert r.status_code == 200
    body = r.json()
    assert body["location"]["id"] == "marsabit"
    assert body["indicator"]["id"] == "vci"
    assert body["data_source"] == "stub"
    # deterministic analytics present with contract field name "class"
    assert "class" in body["analytics"]["severity"]
    assert body["analytics"]["severity"]["class"] in {
        "normal", "watch", "warning", "severe", "emergency",
    }
    # narrative present (fallback in gate lane -> generated False)
    assert "summary" in body["narrative"]
    assert body["narrative"]["generated"] is False
    # forecast present; forecast service is not running in the gate lane, so the
    # deterministic seasonal-naive fallback fills it in.
    assert body["forecast"]["method"] == "fallback-naive"
    assert body["forecast"]["trained"] is False
    assert len(body["forecast"]["points"]) == 6
    fp = body["forecast"]["points"][0]
    assert fp["t"] == "2026-01"  # series ends 2025-12
    assert fp["lower"] <= fp["value"] <= fp["upper"]
    assert body["generated_at"] is not None


def test_insight_unknown_indicator():
    r = client.post("/insight", json={"location": "marsabit", "indicator": "nope"})
    assert r.status_code == 404
    assert r.json()["error"] == "not_found"
