"""Deterministic analytics for indicator time-series.

This is the deterministic machine space: same series in, same numbers out, no LLM.
Every function is pure and unit-tested in tests/test_analytics.py. Severity classes
use published drought thresholds (VCI, SPI) where they exist and fall back to an
anomaly-based classifier otherwise.
"""

from __future__ import annotations

from dataclasses import dataclass
from statistics import fmean, pstdev

# --- severity scaffolding ---------------------------------------------------

SEVERITY_ORDER = ["normal", "watch", "warning", "severe", "emergency"]
# 0 (best) .. 10 (worst); midpoint of each class, used for the numeric score.
_CLASS_SCORE = {"normal": 1.0, "watch": 3.0, "warning": 5.5, "severe": 7.5, "emergency": 9.0}


@dataclass
class Trend:
    direction: str  # improving | stable | declining
    slope_per_month: float
    pct_change: float


@dataclass
class Anomaly:
    z_score: float
    is_anomalous: bool


@dataclass
class Severity:
    cls: str  # normal | watch | warning | severe | emergency
    score: float
    rationale_code: str


# --- primitives -------------------------------------------------------------

def _clean(values: list[float | None]) -> list[float]:
    return [v for v in values if v is not None]


def linreg_slope(ys: list[float]) -> float:
    """Least-squares slope over x = 0..n-1. Slope is per one step (one month)."""
    n = len(ys)
    if n < 2:
        return 0.0
    xs = list(range(n))
    mx = fmean(xs)
    my = fmean(ys)
    denom = sum((x - mx) ** 2 for x in xs)
    if denom == 0:
        return 0.0
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    return num / denom


def pct_change(first: float, last: float) -> float:
    if first == 0:
        return 0.0
    return (last - first) / abs(first) * 100.0


def zscore(latest: float, values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    sd = pstdev(values)
    if sd == 0:
        return 0.0
    return (latest - fmean(values)) / sd


# --- trend / anomaly --------------------------------------------------------

def compute_trend(values: list[float | None], *, higher_is_better: bool) -> Trend:
    xs = _clean(values)
    if len(xs) < 2:
        return Trend(direction="stable", slope_per_month=0.0, pct_change=0.0)
    slope = linreg_slope(xs)
    change = pct_change(xs[0], xs[-1])
    if abs(change) < 5.0:
        direction = "stable"
    else:
        rising = change > 0
        better = rising if higher_is_better else not rising
        direction = "improving" if better else "declining"
    return Trend(direction=direction, slope_per_month=round(slope, 5), pct_change=round(change, 2))


def compute_anomaly(values: list[float | None]) -> Anomaly:
    xs = _clean(values)
    if not xs:
        return Anomaly(z_score=0.0, is_anomalous=False)
    z = zscore(xs[-1], xs)
    return Anomaly(z_score=round(z, 3), is_anomalous=abs(z) >= 2.0)


# --- severity ---------------------------------------------------------------

# Absolute-threshold classifiers. Each row is (predicate on latest -> class, code).
# Evaluated worst-first; first match wins.

def _vci_severity(latest: float) -> Severity:
    # Standard Vegetation Condition Index drought classes (0..100, lower is worse).
    if latest < 10:
        return Severity("emergency", _CLASS_SCORE["emergency"], "vci_below_10")
    if latest < 20:
        return Severity("severe", _CLASS_SCORE["severe"], "vci_below_20")
    if latest < 35:
        return Severity("warning", _CLASS_SCORE["warning"], "vci_below_35")
    if latest < 50:
        return Severity("watch", _CLASS_SCORE["watch"], "vci_below_50")
    return Severity("normal", _CLASS_SCORE["normal"], "vci_normal")


def _spi_severity(latest: float) -> Severity:
    # Standardized Precipitation Index (McKee classes, lower is worse).
    if latest <= -2.0:
        return Severity("emergency", _CLASS_SCORE["emergency"], "spi_extreme_dry")
    if latest <= -1.5:
        return Severity("severe", _CLASS_SCORE["severe"], "spi_severe_dry")
    if latest <= -1.0:
        return Severity("warning", _CLASS_SCORE["warning"], "spi_moderate_dry")
    if latest <= -0.5:
        return Severity("watch", _CLASS_SCORE["watch"], "spi_mild_dry")
    return Severity("normal", _CLASS_SCORE["normal"], "spi_normal")


def _ndvi_severity(latest: float) -> Severity:
    # Absolute NDVI bands tuned for ASAL rangeland (0..1, lower is worse).
    if latest < 0.20:
        return Severity("emergency", _CLASS_SCORE["emergency"], "ndvi_below_0.20")
    if latest < 0.30:
        return Severity("severe", _CLASS_SCORE["severe"], "ndvi_below_0.30")
    if latest < 0.40:
        return Severity("warning", _CLASS_SCORE["warning"], "ndvi_below_0.40")
    if latest < 0.50:
        return Severity("watch", _CLASS_SCORE["watch"], "ndvi_below_0.50")
    return Severity("normal", _CLASS_SCORE["normal"], "ndvi_normal")


_ABSOLUTE = {"vci": _vci_severity, "spi": _spi_severity, "ndvi": _ndvi_severity}


def _anomaly_severity(z: float, *, higher_is_better: bool) -> Severity:
    """Fallback for indicators without a published absolute scale (rainfall, flood).

    Uses the deviation from the location's own history. A worsening deviation is a
    negative z when higher_is_better, a positive z otherwise.
    """
    worsening = -z if higher_is_better else z  # positive => worse than normal
    if worsening >= 2.0:
        return Severity("emergency", _CLASS_SCORE["emergency"], "anomaly_ge_2sd")
    if worsening >= 1.5:
        return Severity("severe", _CLASS_SCORE["severe"], "anomaly_ge_1.5sd")
    if worsening >= 1.0:
        return Severity("warning", _CLASS_SCORE["warning"], "anomaly_ge_1sd")
    if worsening >= 0.5:
        return Severity("watch", _CLASS_SCORE["watch"], "anomaly_ge_0.5sd")
    return Severity("normal", _CLASS_SCORE["normal"], "anomaly_within_0.5sd")


def classify_severity(
    indicator_id: str,
    values: list[float | None],
    *,
    higher_is_better: bool,
) -> Severity:
    xs = _clean(values)
    if not xs:
        return Severity("normal", 0.0, "no_data")
    latest = xs[-1]
    fn = _ABSOLUTE.get(indicator_id)
    if fn is not None:
        return fn(latest)
    return _anomaly_severity(zscore(latest, xs), higher_is_better=higher_is_better)


# --- top-level --------------------------------------------------------------

@dataclass
class AnalyticsResult:
    latest_value: float | None
    mean: float | None
    n_points: int
    trend: Trend
    anomaly: Anomaly
    severity: Severity


def analyze(
    values: list[float | None],
    *,
    indicator_id: str,
    higher_is_better: bool,
) -> AnalyticsResult:
    xs = _clean(values)
    return AnalyticsResult(
        latest_value=xs[-1] if xs else None,
        mean=round(fmean(xs), 4) if xs else None,
        n_points=len(xs),
        trend=compute_trend(values, higher_is_better=higher_is_better),
        anomaly=compute_anomaly(values),
        severity=classify_severity(indicator_id, values, higher_is_better=higher_is_better),
    )
