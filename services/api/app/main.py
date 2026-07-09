"""FastAPI app. Implements contracts/openapi.yaml.

Endpoints: /health, /locations, /indicators, /observations, /insight.
Mounted under /api by the Nginx reverse proxy on the server.
"""

from __future__ import annotations

import os

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import config
from .insight import build_insight
from .schemas import (
    ApiError,
    Health,
    Indicator,
    Insight,
    InsightRequest,
    Location,
    ObservationSeries,
)
from .sources import SourceError, get_source

app = FastAPI(title="KSA Rangeland Intelligence API", version=config.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

source = get_source()


@app.exception_handler(SourceError)
def _source_error(request: Request, exc: SourceError) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content=ApiError(error="not_found", detail=str(exc)).model_dump(),
    )


@app.get("/health", response_model=Health)
def health() -> Health:
    return Health(
        data_source=source.kind,
        llm_mode=os.getenv("LLM_MODE", "stub"),
        version=config.VERSION,
    )


@app.get("/locations", response_model=list[Location])
def locations() -> list[Location]:
    return source.list_locations()


@app.get("/indicators", response_model=list[Indicator])
def indicators() -> list[Indicator]:
    return source.list_indicators()


@app.get(
    "/observations",
    response_model=ObservationSeries,
    responses={404: {"model": ApiError}},
)
def observations(
    location: str = Query(...),
    indicator: str = Query(...),
    from_: str | None = Query(default=None, alias="from"),
    to: str | None = Query(default=None),
) -> ObservationSeries:
    return source.get_series(location, indicator, from_, to)


@app.post("/insight", response_model=Insight, responses={404: {"model": ApiError}})
def insight(req: InsightRequest) -> Insight:
    return build_insight(req, source)
