# Forecast service

Trains and serves a univariate forecast for monthly drought-indicator series. Given a
county-indicator history it projects the next N months with prediction intervals, so
the platform shows not just where an indicator has been but where it is heading.

This is the "model that is to be trained" in the pipeline. It is deliberately not a
heavy ML stack: the series are short (~4 seasons of monthly data), so the tried-and-true
choice is **additive Holt-Winters** (triple exponential smoothing). Its smoothing
parameters are fit (trained) to each series, and the fitted state is what gets persisted
as the model's weights. No numpy, no network, no LLM. Same series in, same forecast out.

## Model

`app/model.py`:
- Picks the method by an out-of-sample holdout so a pure trend is not misread as
  seasonality: **holt-winters-additive** (>= 2 seasons and it beats a non-seasonal fit),
  **holt-linear** (short or non-seasonal), or **naive** (< 2 points).
- Trains by grid-searching the smoothing parameters (alpha, beta, gamma) to minimise
  one-step in-sample squared error.
- Forecasts with intervals that widen as `z * sigma * sqrt(step)`; values and bounds are
  clamped to the indicator range.

`app/backtest.py` scores a trained model against held-out history. Headline metric is
**MASE** (model MAE / seasonal-naive MAE). Below 1 means the model beats the naive
baseline. That is the measurable outcome the forecaster has to move.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET  | `/health`   | Liveness + count of persisted (trained) parameter sets |
| POST | `/forecast` | Project a series forward; reuse persisted params for `key` if present, else fit cold |
| POST | `/train`    | Fit + backtest + persist params for a `key` (e.g. `turkana:vci`) |

`/forecast` and `/train` speak in plain `{t, value}` points, so the service stays
decoupled from the API's catalog and data source.

## Persistence

Trained parameters are small and numeric, stored as JSON in `artifacts/params.json`
keyed by `location:indicator`. The directory is derived output and is gitignored (no
weights in the repo). In Docker it is a named volume (`forecast_artifacts`).

## Testing lanes

- **Gate** (`tests/`, free, deterministic, < 2s): model math, endpoint contract,
  determinism, interval and clamp behaviour. Run by `scripts/gate.sh`.
- **Eval** (`evals/`, threshold): a backtest panel of synthetic indicator shapes,
  asserting aggregate MASE < 1.0. Deterministic (no model calls), so it is cheap to run
  nightly and in CI, but it lives in the quality lane so tightening the threshold does
  not churn the fast gate.

## Run locally

```bash
# from repo root, using the local venv
.venv-test/bin/python -m uvicorn app.main:app --app-dir services/forecast --port 8200

# warm the model on the current data source (pulls series from the running API)
python scripts/train_forecaster.py
```
