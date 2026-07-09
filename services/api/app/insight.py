"""Insight orchestration: series -> deterministic analytics -> narrative -> Insight.

This is the seam between the two machine spaces. analyze() is deterministic; the
narrative is generated. They are assembled here so the split stays legible.
"""

from __future__ import annotations

from datetime import datetime, timezone

from . import analytics as an
from . import llm_client
from .schemas import (
    Analytics,
    Anomaly,
    Insight,
    InsightRequest,
    Period,
    Severity,
    Trend,
)
from .sources import IndicatorSource
from .sources.base import SourceError
from .sources.catalog import INDICATORS_BY_ID, LOCATIONS_BY_ID


def _to_schema_analytics(r: an.AnalyticsResult) -> Analytics:
    return Analytics(
        latest_value=r.latest_value,
        mean=r.mean,
        n_points=r.n_points,
        trend=Trend(
            direction=r.trend.direction,
            slope_per_month=r.trend.slope_per_month,
            pct_change=r.trend.pct_change,
        ),
        anomaly=Anomaly(z_score=r.anomaly.z_score, is_anomalous=r.anomaly.is_anomalous),
        severity=Severity(**{
            "class": r.severity.cls,
            "score": r.severity.score,
            "rationale_code": r.severity.rationale_code,
        }),
    )


def build_insight(req: InsightRequest, source: IndicatorSource) -> Insight:
    location = LOCATIONS_BY_ID.get(req.location)
    indicator = INDICATORS_BY_ID.get(req.indicator)
    if location is None:
        raise SourceError(f"unknown location: {req.location}")
    if indicator is None:
        raise SourceError(f"unknown indicator: {req.indicator}")

    series = source.get_series(req.location, req.indicator, req.from_, req.to)
    values = [p.value for p in series.points]

    result = an.analyze(
        values,
        indicator_id=indicator.id,
        higher_is_better=(indicator.direction == "higher_is_better"),
    )
    analytics = _to_schema_analytics(result)
    narrative = llm_client.build_narrative(location, indicator, analytics)

    period = Period(**{
        "from": series.points[0].t if series.points else None,
        "to": series.points[-1].t if series.points else None,
    })

    return Insight(
        location=location,
        indicator=indicator,
        period=period,
        series=series,
        analytics=analytics,
        narrative=narrative,
        data_source=source.kind,
        generated_at=datetime.now(timezone.utc).isoformat(),
    )
