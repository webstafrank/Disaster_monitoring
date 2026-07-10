"""Client for the forecast service (services/forecast).

Mirrors llm_client: the API owns no forecasting code of its own, it calls the
forecast contract over HTTP. If that service is down, it degrades to a deterministic
seasonal-naive projection (method="fallback-naive") so an Insight always carries a
forward view instead of failing.
"""

from __future__ import annotations

import httpx

from . import config
from .schemas import (
    Analytics,
    Forecast,
    ForecastBacktest,
    ForecastFit,
    ForecastPoint,
    Indicator,
    ObservationSeries,
)
from .sources.catalog import LOCATIONS_BY_ID  # noqa: F401  (kept for symmetry/tests)


def _round_for(indicator: Indicator) -> int:
    # Index-type indicators (NDVI, SPI) carry three decimals; the rest one.
    return 3 if indicator.unit == "index" else 1


def _add_month(t: str, k: int) -> str:
    y, _, m = t.partition("-")
    idx = int(y) * 12 + (int(m) - 1) + k
    return f"{idx // 12}-{idx % 12 + 1:02d}"


def _fallback(series: ObservationSeries, indicator: Indicator, horizon: int, season: int) -> Forecast:
    """Seasonal-naive: repeat the value one season back. Deterministic, no network."""
    vals = [p.value for p in series.points if p.value is not None]
    last_t = series.points[-1].t if series.points else "2025-12"
    rnd = _round_for(indicator)
    vr = indicator.value_range
    points: list[ForecastPoint] = []
    for step in range(1, horizon + 1):
        if len(vals) >= season:
            v = vals[len(vals) - season + ((step - 1) % season)]
        elif vals:
            v = vals[-1]
        else:
            v = 0.0
        if vr is not None:
            if vr.min is not None:
                v = max(vr.min, v)
            if vr.max is not None:
                v = min(vr.max, v)
        v = round(v, rnd)
        points.append(ForecastPoint(t=_add_month(last_t, step), value=v, lower=v, upper=v))
    return Forecast(method="fallback-naive", trained=False, horizon=horizon, points=points)


def build_forecast(
    series: ObservationSeries,
    indicator: Indicator,
    analytics: Analytics,
    *,
    key: str | None = None,
) -> Forecast:
    payload = {
        "points": [p.model_dump() for p in series.points],
        "horizon": config.FORECAST_HORIZON,
        "season_length": config.FORECAST_SEASON,
        "value_min": indicator.value_range.min if indicator.value_range else None,
        "value_max": indicator.value_range.max if indicator.value_range else None,
        "round_to": _round_for(indicator),
        "key": key,
    }
    try:
        resp = httpx.post(
            f"{config.FORECAST_URL}/forecast", json=payload, timeout=config.FORECAST_TIMEOUT_S
        )
        resp.raise_for_status()
        data = resp.json()
        return Forecast(
            method=data["method"],
            trained=data.get("trained", False),
            horizon=data["horizon"],
            points=[ForecastPoint(**p) for p in data["points"]],
            fit=ForecastFit(**data["fit"]) if data.get("fit") else None,
            backtest=ForecastBacktest(**data["backtest"]) if data.get("backtest") else None,
        )
    except (httpx.HTTPError, KeyError, ValueError, TypeError):
        return _fallback(series, indicator, config.FORECAST_HORIZON, config.FORECAST_SEASON)
