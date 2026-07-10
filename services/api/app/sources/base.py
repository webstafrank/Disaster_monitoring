"""Data-source contract. Every source returns the same shapes so the rest of the
API and the frontend never change when the real feeds land behind this interface.
"""

from __future__ import annotations

from typing import Optional, Protocol, runtime_checkable

from ..schemas import Indicator, Location, ObservationSeries


class SourceError(Exception):
    """Raised for a bad request against a source: unknown location or indicator."""


class SourceUnavailable(SourceError):
    """Raised when the upstream data store cannot be reached or queried.

    Distinct from SourceError so the API can answer 503 (infrastructure) instead of
    404 (not found): a database outage is not the same as an unknown county.
    """


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
