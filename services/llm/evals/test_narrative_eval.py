"""Paid eval lane for narrative quality. Runs the real model (LLM_MODE=claude) and
scores output against a threshold. Skips when Claude Code is not available so it
never blocks a commit.

    LLM_MODE=claude pytest services/llm/evals -q

Threshold: >= 4 of 5 must be generated (not fallback), name the county, produce a
non-empty recommendation, and avoid banned filler words.
"""

import os

import pytest

os.environ.setdefault("LLM_MODE", "claude")
from app.claude_runner import generate, llm_mode  # noqa: E402

BANNED = ["delve", "crucial", "robust", "comprehensive", "furthermore", "moreover", "—"]

CASES = [
    ({"name": "Turkana"}, {"name": "VCI", "full_name": "Vegetation Condition Index", "unit": "percent"},
     {"latest_value": 12.0, "mean": 30.0, "trend": {"direction": "declining", "pct_change": -40.0},
      "anomaly": {"z_score": -2.1}, "severity": {"class": "severe", "score": 7.5}}),
    ({"name": "Marsabit"}, {"name": "NDVI", "full_name": "Normalized Difference Vegetation Index", "unit": "index"},
     {"latest_value": 0.18, "mean": 0.3, "trend": {"direction": "declining", "pct_change": -25.0},
      "anomaly": {"z_score": -1.8}, "severity": {"class": "emergency", "score": 9.0}}),
    ({"name": "Garissa"}, {"name": "Flood Extent", "full_name": "Flood-Affected Area", "unit": "percent"},
     {"latest_value": 22.0, "mean": 8.0, "trend": {"direction": "declining", "pct_change": 60.0},
      "anomaly": {"z_score": 2.3}, "severity": {"class": "severe", "score": 7.5}}),
    ({"name": "Wajir"}, {"name": "SPI", "full_name": "Standardized Precipitation Index", "unit": "index"},
     {"latest_value": -1.6, "mean": -0.5, "trend": {"direction": "declining", "pct_change": -30.0},
      "anomaly": {"z_score": -1.5}, "severity": {"class": "severe", "score": 7.5}}),
    ({"name": "Makueni"}, {"name": "Rainfall", "full_name": "Monthly Rainfall", "unit": "mm"},
     {"latest_value": 120.0, "mean": 90.0, "trend": {"direction": "improving", "pct_change": 30.0},
      "anomaly": {"z_score": 1.1}, "severity": {"class": "normal", "score": 1.0}}),
]


@pytest.mark.skipif(llm_mode() != "claude", reason="LLM_MODE != claude")
def test_narrative_quality_threshold():
    passed = 0
    for loc, ind, analytics in CASES:
        out = generate(loc, ind, analytics)
        text = (out["summary"] + " " + out["recommendation"]).lower()
        ok = (
            out["generated"] is True
            and loc["name"].lower() in text
            and len(out["recommendation"].strip()) > 0
            and not any(b in text for b in BANNED)
        )
        passed += int(ok)
    assert passed >= 4, f"only {passed}/5 narratives met the quality bar"
