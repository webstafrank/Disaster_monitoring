"""Contract for the forecast service. Self-contained: the service speaks in plain
series of points, so it stays decoupled from the API's catalog and data sources.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class Health(BaseModel):
    status: str = "ok"
    service: str = "forecast"
    version: Optional[str] = None
    trained_keys: int = 0


class SeriesPoint(BaseModel):
    t: str  # YYYY-MM
    value: Optional[float] = None


class ForecastRequest(BaseModel):
    points: list[SeriesPoint]
    horizon: int = Field(default=6, ge=1, le=36)
    season_length: int = Field(default=12, ge=2, le=24)
    # Optional clamp to the indicator's valid range.
    value_min: Optional[float] = None
    value_max: Optional[float] = None
    round_to: Optional[int] = None
    # Optional key ("location:indicator"). If a trained parameter set exists for it,
    # the service reuses it instead of fitting cold.
    key: Optional[str] = None
    # If true and a key is given, persist the freshly fitted params under it.
    persist: bool = False


class ForecastPoint(BaseModel):
    t: str
    value: float
    lower: float
    upper: float


class FitInfo(BaseModel):
    alpha: float
    beta: float
    gamma: float
    season_length: int
    sigma: float
    n_train: int


class Backtest(BaseModel):
    mae: float
    rmse: float
    mase: float
    naive_mae: float
    horizon: int
    beats_naive: bool


class Forecast(BaseModel):
    method: str  # holt-winters-additive | holt-linear | naive
    trained: bool  # True if reused a persisted parameter set
    horizon: int
    points: list[ForecastPoint]
    fit: FitInfo
    backtest: Optional[Backtest] = None


class TrainRequest(BaseModel):
    key: str
    points: list[SeriesPoint]
    season_length: int = Field(default=12, ge=2, le=24)
    horizon: int = Field(default=6, ge=1, le=36)


class TrainResult(BaseModel):
    key: str
    method: str
    fit: FitInfo
    backtest: Optional[Backtest] = None
    persisted: bool = True
