"""Placeholder data source. NOT REAL DATA.

Every series it returns is tagged source="stub" so it can never be mistaken for a
real feed. It exists only so the full select -> API -> analytics -> narrative loop
runs end-to-end before GeoServer is wired. Values are deterministic (seeded by
location+indicator), so gate tests are stable and the same request always returns
the same series.
"""

from __future__ import annotations

import hashlib
import math
from typing import Optional

from ..schemas import Indicator, Location, ObservationPoint, ObservationSeries
from .base import SourceError
from .catalog import INDICATORS, INDICATORS_BY_ID, LOCATIONS, LOCATIONS_BY_ID

# Default coverage window: 48 monthly steps, 2022-01 .. 2025-12.
_START_YEAR = 2022
_N_MONTHS = 48


def _months(n: int = _N_MONTHS, start_year: int = _START_YEAR) -> list[str]:
    out = []
    for i in range(n):
        y = start_year + i // 12
        m = i % 12 + 1
        out.append(f"{y}-{m:02d}")
    return out


def _seed(location_id: str, indicator_id: str) -> float:
    h = hashlib.sha256(f"{location_id}:{indicator_id}".encode()).hexdigest()
    return int(h[:8], 16) / 0xFFFFFFFF  # 0..1


def _synth(indicator: Indicator, seed: float, i: int, n: int) -> float:
    """Deterministic base + seasonal + slow trend, scaled to the indicator range."""
    lo = indicator.value_range.min if indicator.value_range else 0.0
    hi = indicator.value_range.max if indicator.value_range else 1.0
    # NDVI/SPI realistically sit in a sub-band of their full range.
    if indicator.id == "ndvi":
        lo, hi = 0.15, 0.75
    elif indicator.id == "spi":
        lo, hi = -2.2, 1.8
    elif indicator.id == "flood":
        lo, hi = 0.0, 40.0
    span = hi - lo
    base = lo + span * (0.35 + 0.3 * seed)
    seasonal = span * 0.18 * math.sin(2 * math.pi * (i % 12) / 12 + seed * 6.28)
    # Trend direction/strength varies by seed; drought indicators tend to drift worse.
    trend = span * (0.25 * (seed - 0.5)) * (i / max(n - 1, 1))
    val = base + seasonal + trend
    val = max(lo, min(hi, val))
    return round(val, 3 if indicator.id in ("ndvi", "spi") else 1)


class StubSource:
    kind = "stub"

    def list_locations(self) -> list[Location]:
        return list(LOCATIONS)

    def list_indicators(self) -> list[Indicator]:
        return list(INDICATORS)

    def get_series(
        self,
        location_id: str,
        indicator_id: str,
        frm: Optional[str] = None,
        to: Optional[str] = None,
    ) -> ObservationSeries:
        if location_id not in LOCATIONS_BY_ID:
            raise SourceError(f"unknown location: {location_id}")
        indicator = INDICATORS_BY_ID.get(indicator_id)
        if indicator is None:
            raise SourceError(f"unknown indicator: {indicator_id}")

        months = _months()
        seed = _seed(location_id, indicator_id)
        points = [
            ObservationPoint(t=t, value=_synth(indicator, seed, i, len(months)))
            for i, t in enumerate(months)
        ]
        if frm:
            points = [p for p in points if p.t >= frm]
        if to:
            points = [p for p in points if p.t <= to]

        return ObservationSeries(
            location=location_id,
            indicator=indicator_id,
            unit=indicator.unit,
            source=self.kind,
            points=points,
        )
