"""GeoServer / real EO data source. WIRING PENDING.

This adapter is the plug point for the real feeds. It reuses the shared catalog
(same counties, same indicators) and only needs its get_series filled in once the
GeoServer details arrive:

  - GEOSERVER_URL         base URL, e.g. http://10.0.0.5:8080/geoserver
  - GEOSERVER_WORKSPACE   workspace holding the layers
  - GEOSERVER_USER / _PASSWORD   read credentials (omit if open on the LAN)
  - a mapping from indicator id -> layer name / coverage

Until then it raises SourceError so the API fails loud instead of serving fake data
under a real label. Select the stub source (DATA_SOURCE=stub) for the working demo.

Implementation sketch for get_series (fill when creds land):
  1. Resolve the WFS/WMS layer for indicator_id.
  2. Query the layer for location_id's geometry over [frm, to] (WFS GetFeature with a
     CQL time + bbox/intersects filter, or a WCS/zonal stat for rasters).
  3. Aggregate to monthly points, return ObservationSeries(source="geoserver", ...).
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
        self.user = os.getenv("GEOSERVER_USER") or None
        self.password = os.getenv("GEOSERVER_PASSWORD") or None

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
            "GeoServer source not wired yet. Set DATA_SOURCE=stub for the demo, or "
            "provide GEOSERVER_URL/WORKSPACE/credentials and implement get_series."
        )
