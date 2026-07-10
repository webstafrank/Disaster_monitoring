"""Source factory. DATA_SOURCE env var selects the active adapter."""

from __future__ import annotations

import os

from .base import IndicatorSource, SourceError, SourceUnavailable
from .geoserver import GeoServerSource
from .postgis import PostgresSource
from .stub import StubSource

__all__ = ["IndicatorSource", "SourceError", "SourceUnavailable", "get_source"]


def get_source(kind: str | None = None) -> IndicatorSource:
    kind = (kind or os.getenv("DATA_SOURCE", "stub")).lower()
    if kind == "stub":
        return StubSource()
    if kind == "postgis":
        return PostgresSource()
    if kind == "geoserver":
        return GeoServerSource()
    raise SourceError(f"unknown DATA_SOURCE: {kind}")
