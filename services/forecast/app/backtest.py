"""Backtest a trained forecast against held-out history.

Deterministic and free, so it runs as a gate check rather than a paid eval: fit on
all but the last `horizon` points, forecast them, and score against the truth. The
headline metric is MASE (mean absolute scaled error) relative to a seasonal-naive
baseline (repeat the value from one season ago). MASE < 1 means the trained model
beats the naive baseline; that is the outcome the forecaster has to move.
"""

from __future__ import annotations

from dataclasses import dataclass
from statistics import fmean

from .model import fit, forecast


@dataclass
class BacktestResult:
    mae: float
    rmse: float
    mase: float  # model MAE / seasonal-naive MAE; < 1 beats naive
    naive_mae: float
    horizon: int
    n_train: int
    method: str


def seasonal_naive(history: list[float], horizon: int, season_length: int) -> list[float]:
    """Forecast = the value one season back, repeating if the horizon exceeds a season."""
    out = []
    for step in range(1, horizon + 1):
        idx = len(history) - season_length + ((step - 1) % season_length)
        out.append(history[idx] if 0 <= idx < len(history) else history[-1])
    return out


def backtest(values: list[float], *, horizon: int = 6, season_length: int = 12) -> BacktestResult:
    y = [float(v) for v in values]
    if len(y) <= horizon + 1:
        raise ValueError("series too short to backtest")
    train, test = y[:-horizon], y[-horizon:]

    state = fit(train, season_length=season_length)
    preds = [p.value for p in forecast(state, horizon)]
    naive = seasonal_naive(train, horizon, season_length)

    abs_err = [abs(p - a) for p, a in zip(preds, test)]
    naive_err = [abs(p - a) for p, a in zip(naive, test)]
    mae = fmean(abs_err)
    naive_mae = fmean(naive_err)
    rmse = (fmean([e * e for e in abs_err])) ** 0.5
    mase = mae / naive_mae if naive_mae > 0 else (0.0 if mae == 0 else float("inf"))
    return BacktestResult(
        mae=round(mae, 4), rmse=round(rmse, 4), mase=round(mase, 4),
        naive_mae=round(naive_mae, 4), horizon=horizon, n_train=len(train),
        method=state.method,
    )
