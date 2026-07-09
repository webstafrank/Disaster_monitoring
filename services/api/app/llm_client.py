"""Client for the local narrative service (services/llm).

Per project rule, narrative text comes from the local LLM service, never a hosted
API. This client only speaks to services/llm over HTTP. If that service is down, it
degrades to a deterministic templated narrative (generated=False) so the API still
returns a usable insight instead of failing.
"""

from __future__ import annotations

import httpx

from . import config
from .schemas import Analytics, Indicator, Location, Narrative


def _fallback(location: Location, indicator: Indicator, analytics: Analytics) -> Narrative:
    sev = analytics.severity.cls
    trend = analytics.trend.direction
    summary = (
        f"{indicator.name} for {location.name} is {sev} "
        f"(latest {analytics.latest_value}, {trend} over the window)."
    )
    rec = {
        "emergency": "Trigger emergency response and prioritize this county.",
        "severe": "Escalate monitoring and pre-position resources.",
        "warning": "Increase monitoring cadence and alert county officers.",
        "watch": "Keep under routine watch; no action required yet.",
        "normal": "Conditions are within the normal range.",
    }.get(sev, "Review the data with a county officer.")
    return Narrative(summary=summary, recommendation=rec, generated=False, model="fallback-template")


def build_narrative(
    location: Location, indicator: Indicator, analytics: Analytics
) -> Narrative:
    payload = {
        "location": location.model_dump(),
        "indicator": indicator.model_dump(),
        "analytics": analytics.model_dump(by_alias=True),
    }
    try:
        resp = httpx.post(
            f"{config.LLM_URL}/narrative", json=payload, timeout=config.LLM_TIMEOUT_S
        )
        resp.raise_for_status()
        data = resp.json()
        return Narrative(**data)
    except (httpx.HTTPError, ValueError, TypeError):
        return _fallback(location, indicator, analytics)
