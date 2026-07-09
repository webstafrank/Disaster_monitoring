"""Gate tests for the narrative service, stub mode only. No model call, < 1s."""

import os

os.environ["LLM_MODE"] = "stub"

from fastapi.testclient import TestClient  # noqa: E402

from app.claude_runner import _strip_fences  # noqa: E402
from app.main import app  # noqa: E402
from app.prompt import build_prompt  # noqa: E402

client = TestClient(app)

LOC = {"name": "Turkana", "id": "turkana"}
IND = {"name": "VCI", "full_name": "Vegetation Condition Index", "unit": "percent"}
ANALYTICS = {
    "latest_value": 28.0,
    "mean": 35.0,
    "trend": {"direction": "declining", "pct_change": -20.0},
    "anomaly": {"z_score": -1.4},
    "severity": {"class": "warning", "score": 5.5},
}


def test_health_reports_mode():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["llm_mode"] == "stub"


def test_narrative_stub():
    r = client.post("/narrative", json={"location": LOC, "indicator": IND, "analytics": ANALYTICS})
    assert r.status_code == 200
    body = r.json()
    assert body["generated"] is False
    assert "Turkana" in body["summary"]
    assert len(body["recommendation"]) > 0
    assert body["model"] == "stub-template"


def test_prompt_contains_facts():
    p = build_prompt(LOC, IND, ANALYTICS)
    assert "Turkana" in p
    assert "Vegetation Condition Index" in p
    assert "STRICT JSON" in p
    # never leak raw internal keys the model should not echo
    assert "28.0" in p


def test_strip_fences():
    assert _strip_fences('```json\n{"a":1}\n```') == '{"a":1}'
    assert _strip_fences('{"a":1}') == '{"a":1}'
