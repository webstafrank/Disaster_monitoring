"""Pydantic mirror of contracts/openapi.yaml. Keep in lockstep with the spec."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field

DataSourceKind = Literal["stub", "postgis", "geoserver"]
IndicatorCategory = Literal["vegetation", "drought", "hydrology", "hazard"]
Direction = Literal["higher_is_better", "lower_is_better"]
SeverityClass = Literal["normal", "watch", "warning", "severe", "emergency"]
TrendDirection = Literal["improving", "stable", "declining"]


class Health(BaseModel):
    status: Literal["ok"] = "ok"
    data_source: DataSourceKind
    llm_mode: Literal["claude", "stub"]
    version: Optional[str] = None


class LatLon(BaseModel):
    lat: float
    lon: float


class Location(BaseModel):
    id: str
    name: str
    type: Literal["county"] = "county"
    centroid: LatLon
    bbox: Optional[list[float]] = None


class ValueRange(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None


class Indicator(BaseModel):
    id: str
    name: str
    full_name: str
    unit: str
    category: IndicatorCategory
    direction: Direction
    description: Optional[str] = None
    value_range: Optional[ValueRange] = None


class ObservationPoint(BaseModel):
    t: str
    value: Optional[float] = None


class ObservationSeries(BaseModel):
    location: str
    indicator: str
    unit: str
    source: DataSourceKind
    points: list[ObservationPoint]


class Trend(BaseModel):
    direction: TrendDirection
    slope_per_month: float
    pct_change: float


class Anomaly(BaseModel):
    z_score: float
    is_anomalous: bool


class Severity(BaseModel):
    # `class` is a Python keyword; expose it over the wire via alias.
    cls: SeverityClass = Field(serialization_alias="class", validation_alias="class")
    score: float
    rationale_code: str


class Analytics(BaseModel):
    latest_value: Optional[float] = None
    mean: Optional[float] = None
    n_points: int
    trend: Trend
    anomaly: Anomaly
    severity: Severity


class Narrative(BaseModel):
    summary: str
    recommendation: str
    generated: bool
    model: str


class ForecastPoint(BaseModel):
    t: str
    value: float
    lower: float
    upper: float


class ForecastFit(BaseModel):
    alpha: float
    beta: float
    gamma: float
    season_length: int
    sigma: float
    n_train: int


class ForecastBacktest(BaseModel):
    mae: float
    rmse: float
    mase: float
    naive_mae: float
    horizon: int
    beats_naive: bool


class Forecast(BaseModel):
    method: str  # holt-winters-additive | holt-linear | naive | fallback-naive
    trained: bool
    horizon: int
    points: list[ForecastPoint]
    fit: Optional[ForecastFit] = None
    backtest: Optional[ForecastBacktest] = None


class InsightRequest(BaseModel):
    location: str
    indicator: str
    from_: Optional[str] = Field(default=None, alias="from")
    to: Optional[str] = None


class Period(BaseModel):
    from_: Optional[str] = Field(default=None, serialization_alias="from", validation_alias="from")
    to: Optional[str] = None


class Insight(BaseModel):
    location: Location
    indicator: Indicator
    period: Period
    series: ObservationSeries
    analytics: Analytics
    narrative: Narrative
    forecast: Optional[Forecast] = None
    data_source: DataSourceKind
    generated_at: Optional[str] = None


class MapLayer(BaseModel):
    name: str  # WMS layer identifier, e.g. "asal:ndvi_2024"
    title: str
    workspace: Optional[str] = None
    bbox: Optional[list[float]] = None  # [minLon, minLat, maxLon, maxLat], geographic
    queryable: bool = False


class MapLayerCatalog(BaseModel):
    wms_base_url: str  # browser-facing WMS GetMap endpoint ("" when unconfigured)
    workspace: Optional[str] = None
    available: bool  # GeoServer reachable and its capabilities parsed
    layers: list[MapLayer]


class ApiError(BaseModel):
    error: str
    detail: str
