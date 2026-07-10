"""Forecast service. Trains and serves an additive Holt-Winters model for monthly
drought-indicator series.

Endpoints:
  GET  /health    - liveness + count of persisted (trained) parameter sets
  POST /forecast  - project a series forward; reuse persisted params for `key` if any
  POST /train     - fit + backtest + persist params for a key

Per project rules this is deterministic (no LLM), dependency-light (stdlib + FastAPI),
and independently deployable.
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException

from . import backtest as bt
from . import model, store
from .schemas import (
    Backtest,
    FitInfo,
    Forecast,
    ForecastPoint,
    ForecastRequest,
    Health,
    TrainRequest,
    TrainResult,
)
from .timeutil import future_months

VERSION = "0.1.0"

app = FastAPI(title="KSA Forecast Service", version=VERSION)


def _clean(points) -> tuple[list[float], str | None]:
    """Non-null values in order, plus the last timestamp seen (for future labels)."""
    values = [p.value for p in points if p.value is not None]
    last_t = points[-1].t if points else None
    return values, last_t


def _fit_info(state: model.FitResult) -> FitInfo:
    return FitInfo(
        alpha=state.alpha, beta=state.beta, gamma=state.gamma,
        season_length=state.season_length, sigma=round(state.sigma, 4),
        n_train=state.n_train,
    )


def _maybe_backtest(values: list[float], horizon: int, m: int) -> Backtest | None:
    try:
        r = bt.backtest(values, horizon=horizon, season_length=m)
    except ValueError:
        return None
    return Backtest(
        mae=r.mae, rmse=r.rmse, mase=r.mase, naive_mae=r.naive_mae,
        horizon=r.horizon, beats_naive=r.mase < 1.0,
    )


@app.get("/health", response_model=Health)
def health() -> Health:
    return Health(version=VERSION, trained_keys=store.count())


@app.post("/forecast", response_model=Forecast)
def forecast(req: ForecastRequest) -> Forecast:
    values, last_t = _clean(req.points)
    if not values or last_t is None:
        raise HTTPException(status_code=422, detail="no observed values to forecast")

    trained = False
    state = store.load(req.key) if req.key else None
    if state is not None:
        trained = True
    else:
        state = model.fit(values, season_length=req.season_length)
        if req.persist and req.key:
            store.save(req.key, state)

    preds = model.forecast(
        state, req.horizon,
        clamp_min=req.value_min, clamp_max=req.value_max, round_to=req.round_to,
    )
    labels = future_months(last_t, req.horizon)
    points = [
        ForecastPoint(t=t, value=p.value, lower=p.lower, upper=p.upper)
        for t, p in zip(labels, preds)
    ]
    return Forecast(
        method=state.method, trained=trained, horizon=req.horizon, points=points,
        fit=_fit_info(state),
        backtest=_maybe_backtest(values, req.horizon, req.season_length),
    )


@app.post("/train", response_model=TrainResult)
def train(req: TrainRequest) -> TrainResult:
    values, _ = _clean(req.points)
    if not values:
        raise HTTPException(status_code=422, detail="no observed values to train on")
    state = model.fit(values, season_length=req.season_length)
    store.save(req.key, state)
    return TrainResult(
        key=req.key, method=state.method, fit=_fit_info(state),
        backtest=_maybe_backtest(values, req.horizon, req.season_length),
    )
