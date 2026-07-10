"""Gate tests for the forecast HTTP endpoints."""

import math
import os
import tempfile

# Isolate persisted params to a temp dir so tests never touch real artifacts.
os.environ["FORECAST_ARTIFACTS"] = tempfile.mkdtemp(prefix="forecast-test-")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def _series(n=48):
    return [
        {"t": f"{2022 + i // 12}-{i % 12 + 1:02d}",
         "value": round(50 + 0.2 * i + 12 * math.sin(2 * math.pi * (i % 12) / 12), 3)}
        for i in range(n)
    ]


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["service"] == "forecast"


def test_forecast_shape_and_labels():
    r = client.post("/forecast", json={"points": _series(), "horizon": 6, "season_length": 12})
    assert r.status_code == 200
    body = r.json()
    assert body["horizon"] == 6
    assert len(body["points"]) == 6
    assert body["trained"] is False  # cold fit, no persisted key
    assert body["method"] in {"holt-winters-additive", "holt-linear", "naive"}
    # Last training month is 2025-12 -> forecast starts 2026-01.
    assert body["points"][0]["t"] == "2026-01"
    for p in body["points"]:
        assert p["lower"] <= p["value"] <= p["upper"]
    assert body["backtest"]["beats_naive"] is True


def test_forecast_clamps_to_range():
    pts = [{"t": f"2022-{i + 1:02d}" if i < 12 else f"{2022 + i // 12}-{i % 12 + 1:02d}",
            "value": max(-1.0, 0.9 - 0.05 * i)} for i in range(48)]
    r = client.post("/forecast", json={
        "points": pts, "horizon": 6, "value_min": 0.0, "value_max": 1.0, "round_to": 3,
    })
    assert r.status_code == 200
    assert all(0.0 <= p["value"] <= 1.0 for p in r.json()["points"])


def test_forecast_empty_values_422():
    r = client.post("/forecast", json={"points": [{"t": "2024-01", "value": None}]})
    assert r.status_code == 422


def test_train_then_forecast_reuses_params():
    key = "turkana:vci"
    tr = client.post("/train", json={"key": key, "points": _series(), "horizon": 6})
    assert tr.status_code == 200
    assert tr.json()["persisted"] is True

    r = client.post("/forecast", json={"points": _series(), "horizon": 6, "key": key})
    assert r.status_code == 200
    assert r.json()["trained"] is True  # served from persisted params

    h = client.get("/health").json()
    assert h["trained_keys"] >= 1


def test_forecast_deterministic_over_http():
    body = {"points": _series(), "horizon": 12}
    a = client.post("/forecast", json=body).json()["points"]
    b = client.post("/forecast", json=body).json()["points"]
    assert a == b
