"""Builds the prompt handed to local Claude Code. Deterministic given its inputs, so
the prompt itself is unit-testable even though the model output is not.
"""

from __future__ import annotations

import json
from typing import Any

INSTRUCTION = (
    "You are a disaster-monitoring analyst for Kenya's arid and semi-arid counties. "
    "Given one indicator's computed statistics for one county, write a briefing for a "
    "county officer. Be concrete and plain. No jargon, no em dashes, no filler. "
    "Name the county. State what the number means for people and livestock. "
    "Base every claim only on the data given; do not invent figures.\n\n"
    "Return STRICT JSON only, no markdown, with exactly these keys:\n"
    '  "summary": 2-3 sentences on the current condition and trend.\n'
    '  "recommendation": 1-2 sentences on what the county should do next.\n'
)


def build_prompt(location: dict[str, Any], indicator: dict[str, Any], analytics: dict[str, Any]) -> str:
    facts = {
        "county": location.get("name"),
        "indicator": indicator.get("full_name"),
        "unit": indicator.get("unit"),
        "meaning": indicator.get("description"),
        "latest_value": analytics.get("latest_value"),
        "mean_over_window": analytics.get("mean"),
        "trend": analytics.get("trend", {}).get("direction"),
        "pct_change_over_window": analytics.get("trend", {}).get("pct_change"),
        "anomaly_z_score": analytics.get("anomaly", {}).get("z_score"),
        "severity_class": analytics.get("severity", {}).get("class"),
        "severity_score_0_to_10": analytics.get("severity", {}).get("score"),
    }
    return f"{INSTRUCTION}\nDATA:\n{json.dumps(facts, indent=2)}\n"
