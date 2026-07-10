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

# CORS: the Next.js frontend origin(s), comma-separated.
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]
