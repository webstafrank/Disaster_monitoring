"""Quality eval for the forecaster.

Unlike the LLM services, the forecaster is deterministic, so its quality lane is a
backtest against a threshold rather than a paid model call. It runs a panel of
synthetic monthly series that mimic the shapes real drought indicators take
(seasonal + trend, sharp decline, flat, noisy) and asserts the trained model beats
the seasonal-naive baseline on aggregate. This is the measurable outcome for the
service: aggregate MASE < 1.0.

Deterministic and free, so it is safe to run nightly and in CI. Threshold lives here,
not in the gate tests, so tightening quality does not churn the fast lane.
"""

import math

from app.backtest import backtest

MASE_THRESHOLD = 1.0  # trained model must beat seasonal-naive on average


def _panel() -> dict[str, list[float]]:
    def clamp(x, lo, hi):
        return max(lo, min(hi, x))

    series = {}
    # Seasonal vegetation with mild positive trend (recovering rangeland).
    series["ndvi_recovering"] = [
        clamp(0.4 + 0.002 * i + 0.12 * math.sin(2 * math.pi * (i % 12) / 12), 0, 1)
        for i in range(48)
    ]
    # Seasonal VCI with sharp drought decline.
    series["vci_declining"] = [
        clamp(60 - 0.6 * i + 15 * math.sin(2 * math.pi * (i % 12) / 12), 0, 100)
        for i in range(48)
    ]
    # Rainfall: strong seasonality, no trend, small deterministic wobble.
    series["rainfall_seasonal"] = [
        clamp(80 + 70 * math.sin(2 * math.pi * (i % 12) / 12) + 6 * ((i * 7) % 5 - 2), 0, 400)
        for i in range(48)
    ]
    # SPI oscillating around zero.
    series["spi_oscillating"] = [
        1.4 * math.sin(2 * math.pi * (i % 12) / 12 + 0.5) - 0.01 * i for i in range(48)
    ]
    # Near-flat indicator (should not do worse than naive).
    series["flood_flat"] = [2.0 + 0.5 * ((i % 12) in (3, 4)) for i in range(48)]
    return series


def test_panel_beats_naive_on_aggregate():
    results = {k: backtest(v, horizon=6, season_length=12) for k, v in _panel().items()}
    mases = [r.mase for r in results.values()]
    mean_mase = sum(mases) / len(mases)
    report = ", ".join(f"{k}={r.mase}" for k, r in results.items())
    assert mean_mase < MASE_THRESHOLD, f"mean MASE {mean_mase:.3f} >= {MASE_THRESHOLD} ({report})"


def test_majority_of_series_beat_naive():
    results = _panel()
    wins = sum(1 for v in results.values() if backtest(v, horizon=6).mase < 1.0)
    assert wins >= len(results) - 1, f"only {wins}/{len(results)} series beat naive"
