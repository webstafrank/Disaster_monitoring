"""Runtime config from environment. No secrets in code."""

from __future__ import annotations

import os

VERSION = "0.1.0"

# Data source: "stub" (default, placeholder) or "geoserver" (real, when wired).
DATA_SOURCE = os.getenv("DATA_SOURCE", "stub")

# LLM narrative service (services/llm). Reached over HTTP on the physical server.
LLM_URL = os.getenv("LLM_URL", "http://127.0.0.1:8100")
LLM_TIMEOUT_S = float(os.getenv("LLM_TIMEOUT_S", "60"))

# Forecast service (services/forecast). Projects the indicator forward.
FORECAST_URL = os.getenv("FORECAST_URL", "http://127.0.0.1:8200")
FORECAST_TIMEOUT_S = float(os.getenv("FORECAST_TIMEOUT_S", "30"))
FORECAST_HORIZON = int(os.getenv("FORECAST_HORIZON", "6"))
FORECAST_SEASON = int(os.getenv("FORECAST_SEASON", "12"))

# GeoServer WMS map layers for the map view. GEOSERVER_URL is what the API reads
# server-side to discover layers (WMS GetCapabilities); it may be an internal
# address (e.g. the docker service). GEOSERVER_PUBLIC_URL is the browser-facing
# base the map tiles from and defaults to GEOSERVER_URL. The scheme is optional in
# the env value (https:// is assumed) so a bare host still works.


def _normalize_url(raw: str) -> str:
    raw = raw.strip().rstrip("/")
    if raw and not raw.startswith(("http://", "https://")):
        raw = "https://" + raw
    return raw


GEOSERVER_URL = _normalize_url(os.getenv("GEOSERVER_URL", ""))
GEOSERVER_PUBLIC_URL = _normalize_url(os.getenv("GEOSERVER_PUBLIC_URL", "")) or GEOSERVER_URL
GEOSERVER_WORKSPACE = os.getenv("GEOSERVER_WORKSPACE", "").strip()
GEOSERVER_TIMEOUT_S = float(os.getenv("GEOSERVER_TIMEOUT_S", "10"))

# CORS: the Next.js frontend origin(s), comma-separated.
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]
