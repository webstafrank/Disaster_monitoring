"""Gate tests: deterministic, free, fast. Prove the model math, not its prose."""

import math

from app import model
from app.backtest import backtest, seasonal_naive
from app.timeutil import add_months, future_months, parse_month


# --- timeutil ---------------------------------------------------------------

def test_add_months_wraps_year():
    assert add_months("2024-11", 3) == "2025-02"
    assert add_months("2024-01", -1) == "2023-12"


def test_future_months():
    assert future_months("2025-12", 3) == ["2026-01", "2026-02", "2026-03"]


def test_parse_month_rejects_bad():
    try:
        parse_month("2024-13")
    except ValueError:
        return
    raise AssertionError("expected ValueError on month 13")


# --- model selection --------------------------------------------------------

def test_linear_trend_is_not_read_as_seasonal():
    # A pure line must extrapolate as a line, not wander with invented seasonality.
    y = [10 + 2 * i for i in range(48)]
    st = model.fit(y)
    assert st.method == "holt-linear"
    fc = model.forecast(st, 6)
    assert [round(p.value, 3) for p in fc] == [106.0, 108.0, 110.0, 112.0, 114.0, 116.0]


def test_seasonal_series_selects_seasonal():
    y = [50 + 0.2 * i + 10 * math.sin(2 * math.pi * (i % 12) / 12) for i in range(48)]
    st = model.fit(y)
    assert st.method == "holt-winters-additive"


def test_short_series_falls_back_to_linear():
    st = model.fit([5, 6, 7, 8, 9, 10])
    assert st.method == "holt-linear"
    assert [round(p.value, 2) for p in model.forecast(st, 2)] == [11.0, 12.0]


def test_single_point_is_naive_flat():
    st = model.fit([42.0])
    assert st.method == "naive"
    assert [p.value for p in model.forecast(st, 3)] == [42.0, 42.0, 42.0]


def test_empty_series_does_not_crash():
    st = model.fit([])
    assert [p.value for p in model.forecast(st, 2)] == [0.0, 0.0]


# --- forecasting behaviour --------------------------------------------------

def test_seasonality_repeats_with_period():
    y = [50 + 10 * math.sin(2 * math.pi * (i % 12) / 12) for i in range(48)]
    st = model.fit(y)
    fc = [p.value for p in model.forecast(st, 24)]
    # Same month next year within a tight tolerance (flat trend, strong season).
    for i in range(12):
        assert abs(fc[i] - fc[i + 12]) < 1.0


def test_intervals_widen_with_horizon():
    y = [50 + 10 * math.sin(2 * math.pi * (i % 12) / 12) + (i % 5) for i in range(48)]
    fc = model.forecast(model.fit(y), 12)
    widths = [p.upper - p.lower for p in fc]
    assert widths[-1] >= widths[0]
    assert all(p.lower <= p.value <= p.upper for p in fc)


def test_clamp_and_round_respected():
    y = [0.9 - 0.05 * i for i in range(48)]  # decays well below 0
    fc = model.forecast(model.fit(y), 6, clamp_min=0.0, clamp_max=1.0, round_to=3)
    assert all(0.0 <= p.value <= 1.0 for p in fc)
    assert all(p.value == round(p.value, 3) for p in fc)


def test_forecast_is_deterministic():
    y = [45 - 0.4 * i + 12 * math.sin(2 * math.pi * (i % 12) / 12) for i in range(48)]
    a = [p.value for p in model.forecast(model.fit(y), 12)]
    b = [p.value for p in model.forecast(model.fit(y), 12)]
    assert a == b


# --- backtest ---------------------------------------------------------------

def test_seasonal_naive_baseline():
    hist = list(range(24))  # 0..23
    naive = seasonal_naive(hist, 3, 12)
    assert naive == [12, 13, 14]  # value one season (12) back


def test_backtest_beats_naive_on_seasonal_data():
    y = [50 + 0.2 * i + 12 * math.sin(2 * math.pi * (i % 12) / 12) for i in range(48)]
    r = backtest(y, horizon=6, season_length=12)
    assert r.mase < 1.0  # trained model beats seasonal-naive


def test_backtest_rejects_too_short():
    try:
        backtest([1, 2, 3], horizon=6)
    except ValueError:
        return
    raise AssertionError("expected ValueError on short series")
