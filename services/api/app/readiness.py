"""Deep readiness probe for GET /ready.

/health says the API process is up. /ready says the whole stack works: it probes
the active data source, the llm and forecast services, and GeoServer, and reports a
per-dependency status. Every probe is injectable so gate tests stay offline.

GeoServer is treated as optional: the map view degrades to basemap + boundaries when
it is down, so an unreachable GeoServer does not flip overall readiness to false.
"""

from __future__ import annotations

from typing import Callable, Optional

import httpx

from . import config, geoserver_layers
from .schemas import DependencyStatus, Readiness
from .sources import SourceUnavailable

# An http prober takes a base URL and returns (ok, detail).
HttpProber = Callable[[str], tuple[bool, Optional[str]]]


def _http_health(base_url: str) -> tuple[bool, Optional[str]]:
    """GET {base_url}/health with a short timeout."""
    try:
        r = httpx.get(f"{base_url}/health", timeout=3.0)
        r.raise_for_status()
        return True, None
    except httpx.HTTPError as e:
        return False, str(e) or e.__class__.__name__


def _check_data_source(source) -> DependencyStatus:
    probe = getattr(source, "probe", None)
    if probe is None:  # in-process source (stub): nothing external to reach
        return DependencyStatus(name="data_source", ok=True, detail=source.kind)
    try:
        probe()
        return DependencyStatus(name="data_source", ok=True, detail=source.kind)
    except SourceUnavailable as e:
        return DependencyStatus(name="data_source", ok=False, detail=str(e))


def build_readiness(source, http: Optional[HttpProber] = None) -> Readiness:
    http = http or _http_health

    data = _check_data_source(source)

    llm_ok, llm_detail = http(config.LLM_URL)
    llm = DependencyStatus(name="llm", ok=llm_ok, detail=llm_detail)

    fc_ok, fc_detail = http(config.FORECAST_URL)
    forecast = DependencyStatus(name="forecast", ok=fc_ok, detail=fc_detail)

    # GeoServer is optional (map degrades gracefully); reported, but never blocks.
    if config.GEOSERVER_URL:
        cat = geoserver_layers.get_catalog()
        geo = DependencyStatus(
            name="geoserver",
            ok=cat.available,
            detail=None if cat.available else "unreachable or unconfigured",
        )
    else:
        geo = DependencyStatus(name="geoserver", ok=True, detail="not configured (optional)")

    deps = [data, llm, forecast, geo]
    # Required for readiness: data source, llm, forecast. GeoServer is best-effort.
    ready = data.ok and llm.ok and forecast.ok
    return Readiness(ready=ready, version=config.VERSION, dependencies=deps)
