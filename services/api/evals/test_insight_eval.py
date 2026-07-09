"""Paid eval lane (periodic, not per-commit). Requires the llm service running with
LLM_MODE=claude. Skips cleanly when the service is unreachable so it never blocks a
commit. Run before ship and nightly:

    DATA_SOURCE=stub LLM_URL=http://127.0.0.1:8100 pytest services/api/evals -q

Threshold: at least 4 of 5 scenarios must produce a generated (not fallback)
narrative that names the county and yields a non-empty recommendation.
"""

import os

import httpx
import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("DATA_SOURCE", "stub")
from app.main import app  # noqa: E402

client = TestClient(app)

SCENARIOS = [
    {"location": "turkana", "indicator": "vci"},
    {"location": "marsabit", "indicator": "ndvi"},
    {"location": "garissa", "indicator": "flood"},
    {"location": "wajir", "indicator": "spi"},
    {"location": "makueni", "indicator": "rainfall"},
]


def _llm_up() -> bool:
    url = os.getenv("LLM_URL", "http://127.0.0.1:8100")
    try:
        return httpx.get(f"{url}/health", timeout=3).status_code == 200
    except httpx.HTTPError:
        return False


@pytest.mark.skipif(not _llm_up(), reason="llm service not running")
def test_generated_narrative_quality():
    passed = 0
    for s in SCENARIOS:
        body = client.post("/insight", json=s).json()
        n = body["narrative"]
        county = body["location"]["name"]
        ok = (
            n["generated"] is True
            and county.lower() in n["summary"].lower()
            and len(n["recommendation"].strip()) > 0
        )
        passed += int(ok)
    assert passed >= 4, f"only {passed}/5 scenarios produced a quality generated narrative"
