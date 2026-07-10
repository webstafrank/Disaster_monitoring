"""Trained univariate forecaster for monthly drought-indicator series.

Deterministic machine space: this is a *model that is trained* (its smoothing
parameters are fit to each county-indicator history), but given the same series in
it produces the same forecast out. No LLM, no network, no numpy. Pure stdlib so the
service stays as dependency-light as the rest of the backend and the algorithm is
fully inspectable.

Method: additive Holt-Winters (triple exponential smoothing) with a seasonal period
of 12 months. Holt-Winters is the tried-and-true choice for a short, seasonal,
univariate series (~4 seasons of monthly data); a heavier ML stack would overfit 48
points and add the only large dependency in the backend. When there is not enough
history for a seasonal fit (< 2 full seasons) the model degrades to Holt's linear
trend, and to a flat/naive forecast when there is barely any history at all. Every
path is labelled in the result so the caller knows which model produced the numbers.

Training = grid-search over the smoothing parameters (alpha, beta, gamma) to minimise
one-step in-sample squared error. The fitted state (level, trend, seasonal indices,
parameters) is what `store.py` persists as the model's "weights".
"""

from __future__ import annotations

from dataclasses import dataclass, field
from statistics import fmean

# Smoothing-parameter grid searched during training. Coarse on purpose: the surface
# is smooth and 5^3 = 125 fits over ~48 points is trivial and fully deterministic.
_GRID = (0.1, 0.3, 0.5, 0.7, 0.9)


@dataclass
class FitResult:
    method: str  # holt-winters-additive | holt-linear | naive
    level: float
    trend: float
    seasonals: list[float]  # length == season_length (0s when non-seasonal)
    season_length: int
    alpha: float
    beta: float
    gamma: float
    sse: float  # one-step in-sample sum of squared errors (scored points only)
    scored: int  # number of points that contributed to sse
    sigma: float  # residual std, used to size prediction intervals
    n_train: int
    params: dict = field(default_factory=dict)


# --- initialisation ---------------------------------------------------------

def _seasonal_init(y: list[float], m: int) -> list[float]:
    """Additive seasonal indices from whole seasons, normalised to sum to zero."""
    n_seasons = len(y) // m
    season_avg = [fmean(y[k * m : (k + 1) * m]) for k in range(n_seasons)]
    s = []
    for i in range(m):
        deviations = [y[k * m + i] - season_avg[k] for k in range(n_seasons)]
        s.append(fmean(deviations))
    adj = fmean(s)
    return [x - adj for x in s]


# --- core recursion ---------------------------------------------------------

def _run(y: list[float], m: int, alpha: float, beta: float, gamma: float,
         *, seasonal: bool) -> FitResult:
    """One Holt-Winters pass at fixed parameters. `seasonal=False` -> Holt's linear."""
    n = len(y)
    if seasonal:
        seas = _seasonal_init(y, m)  # seas[t] for t in 0..m-1
        level = fmean(y[:m])
        second = fmean(y[m : 2 * m])
        trend = (second - level) / m
        warmup = m
    else:
        seas = [0.0] * m
        level = y[0]
        trend = (y[1] - y[0]) if n > 1 else 0.0
        warmup = 1

    errors: list[float] = []
    for t in range(warmup, n):
        s_tm = seas[t - m] if seasonal else 0.0
        forecast = level + trend + s_tm
        errors.append(y[t] - forecast)

        new_level = alpha * (y[t] - s_tm) + (1 - alpha) * (level + trend)
        new_trend = beta * (new_level - level) + (1 - beta) * trend
        if seasonal:
            seas.append(gamma * (y[t] - new_level) + (1 - gamma) * s_tm)
        level, trend = new_level, new_trend

    sse = sum(e * e for e in errors)
    sigma = (sse / len(errors)) ** 0.5 if errors else 0.0
    return FitResult(
        method="holt-winters-additive" if seasonal else "holt-linear",
        level=level, trend=trend, seasonals=seas, season_length=m,
        alpha=alpha, beta=beta, gamma=gamma if seasonal else 0.0,
        sse=sse, scored=len(errors), sigma=sigma, n_train=n,
    )


# --- training (parameter search + model selection) --------------------------

def _fit_method(y: list[float], method: str, m: int) -> FitResult:
    """Grid-search the smoothing parameters for one method, minimising in-sample SSE."""
    seasonal = method == "seasonal"
    best: FitResult | None = None
    for a in _GRID:
        for b in _GRID:
            for g in (_GRID if seasonal else (0.0,)):
                r = _run(y, m, a, b, g, seasonal=seasonal)
                if best is None or r.sse < best.sse:
                    best = r
    assert best is not None
    return best


def _holdout_mae(y: list[float], method: str, m: int, h: int) -> float:
    """Train on all but the last `h` points, score the forecast on those points."""
    train = y[:-h]
    preds = forecast(_fit_method(train, method, m), h)
    actual = y[-h:]
    return fmean([abs(p.value - a) for p, a in zip(preds, actual)])


def fit(values: list[float], *, season_length: int = 12) -> FitResult:
    """Train the model on a clean (no None) series.

    Picks the method (seasonal Holt-Winters vs Holt's linear) by an out-of-sample
    holdout so a pure trend is not misread as seasonality, then refits the chosen
    method on the full series. Grid-searches the smoothing parameters throughout.
    """
    y = [float(v) for v in values]
    n = len(y)
    m = season_length
    if n < 2:
        v = y[-1] if y else 0.0
        return FitResult("naive", v, 0.0, [0.0] * m, m,
                         0.0, 0.0, 0.0, 0.0, 0, 0.0, n)

    method = "linear"
    if n >= 2 * m:
        h = max(1, min(m, n // 4))
        # A seasonal fit needs two full seasons of *training* data too.
        if n - h >= 2 * m:
            seasonal_mae = _holdout_mae(y, "seasonal", m, h)
            linear_mae = _holdout_mae(y, "linear", m, h)
            method = "seasonal" if seasonal_mae <= linear_mae else "linear"
        else:
            method = "seasonal"

    best = _fit_method(y, method, m)
    best.params = {"alpha": best.alpha, "beta": best.beta, "gamma": best.gamma,
                   "season_length": m, "method": best.method}
    return best


# --- forecasting ------------------------------------------------------------

@dataclass
class Prediction:
    value: float
    lower: float
    upper: float


def forecast(state: FitResult, horizon: int, *, z: float = 1.28,
             clamp_min: float | None = None, clamp_max: float | None = None,
             round_to: int | None = None) -> list[Prediction]:
    """Project `horizon` steps past the training window.

    Intervals widen with the square root of the step (a standard random-walk-error
    approximation); `z` defaults to the ~80% normal quantile. Values and interval
    bounds are clamped to the indicator range when provided.
    """
    seas = state.seasonals
    n = len(seas)
    m = state.season_length
    seasonal = state.method == "holt-winters-additive"

    def _clamp(x: float) -> float:
        if clamp_min is not None:
            x = max(clamp_min, x)
        if clamp_max is not None:
            x = min(clamp_max, x)
        return round(x, round_to) if round_to is not None else x

    out: list[Prediction] = []
    for step in range(1, horizon + 1):
        s = seas[n - m + ((step - 1) % m)] if (seasonal and n >= m) else 0.0
        point = state.level + step * state.trend + s
        margin = z * state.sigma * (step ** 0.5)
        out.append(Prediction(_clamp(point), _clamp(point - margin), _clamp(point + margin)))
    return out
