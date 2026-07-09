"""Data-source contract. Every source returns the same shapes so the rest of the
API and the frontend never change when the real feeds land behind this interface.
"""

from __future__ import annotations

from typing import Optional, Protocol, runtime_checkable

from ..schemas import Indicator, Location, ObservationSeries


class SourceError(Exception):
    """Raised for unknown location/indicator or upstream data failures."""


@runtime_checkable
class IndicatorSource(Protocol):
    kind: str  # matches DataSourceKind in the contract

    def list_locations(self) -> list[Location]: ...

    def list_indicators(self) -> list[Indicator]: ...

    def get_series(
        self,
        location_id: str,
        indicator_id: str,
        frm: Optional[str] = None,
        to: Optional[str] = None,
    ) -> ObservationSeries: ...
