"""GeoServer source: SUPERSEDED for the numeric time-series.

In this stack GeoServer serves WMS/WFS *map layers* for the map view; it is not the
source of the chart time-series. Those come straight from PostGIS (see postgis.py,
`DATA_SOURCE=postgis`). This adapter is kept so `DATA_SOURCE=geoserver` fails loud
with that redirect instead of silently doing the wrong thing.

If a future need arises to derive series from GeoServer directly (e.g. WFS GetFeature
against a published layer, or WCS zonal statistics over raster coverages), implement
get_series here. For now the real feed is PostGIS.
"""

from __future__ import annotations

import os
from typing import Optional

from ..schemas import Indicator, Location, ObservationSeries
from .base import SourceError
from .catalog import INDICATORS, LOCATIONS


class GeoServerSource:
    kind = "geoserver"

    def __init__(self) -> None:
        self.base_url = os.getenv("GEOSERVER_URL", "")
        self.workspace = os.getenv("GEOSERVER_WORKSPACE", "")

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
        raise SourceError(
            "GeoServer is not the numeric source in this stack (it serves map layers). "
            "Set DATA_SOURCE=postgis for the real time-series, or DATA_SOURCE=stub for the demo."
        )
