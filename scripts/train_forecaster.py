#!/usr/bin/env python3
"""Warm (train) the forecast model on every county-indicator series.

Glue, not business logic: it reads the catalog and series from the running API
(whatever DATA_SOURCE is active) and POSTs each series to the forecast service's
/train endpoint, which fits, backtests, and persists the parameters. Run it after a
data refresh so /forecast serves pre-trained params (trained=True) instead of cold
fits.

    python scripts/train_forecaster.py
    API_URL=http://localhost:8000 FORECAST_URL=http://localhost:8200 python scripts/train_forecaster.py

Prints one line per series with the chosen method and backtest MASE, then a summary.
"""

from __future__ import annotations

import os
import sys

import httpx

API_URL = os.getenv("API_URL", "http://127.0.0.1:8000")
FORECAST_URL = os.getenv("FORECAST_URL", "http://127.0.0.1:8200")
HORIZON = int(os.getenv("FORECAST_HORIZON", "6"))
SEASON = int(os.getenv("FORECAST_SEASON", "12"))


def main() -> int:
    with httpx.Client(timeout=30.0) as c:
        locations = c.get(f"{API_URL}/locations").json()
        indicators = c.get(f"{API_URL}/indicators").json()
        print(f"Training {len(locations)} x {len(indicators)} = "
              f"{len(locations) * len(indicators)} series\n")

        trained, beat_naive, failures = 0, 0, 0
        for loc in locations:
            for ind in indicators:
                key = f"{loc['id']}:{ind['id']}"
                try:
                    series = c.get(
                        f"{API_URL}/observations",
                        params={"location": loc["id"], "indicator": ind["id"]},
                    ).json()
                    res = c.post(f"{FORECAST_URL}/train", json={
                        "key": key,
                        "points": series["points"],
                        "season_length": SEASON,
                        "horizon": HORIZON,
                    }).json()
                except (httpx.HTTPError, KeyError, ValueError) as e:
                    print(f"  FAIL {key}: {e}")
                    failures += 1
                    continue
                trained += 1
                bt = res.get("backtest")
                mase = bt["mase"] if bt else None
                if bt and bt["beats_naive"]:
                    beat_naive += 1
                flag = "" if (mase is None or mase < 1.0) else "  <-- worse than naive"
                print(f"  {key:28s} {res['method']:22s} mase={mase}{flag}")

        print(f"\nTrained {trained} series, {beat_naive} beat naive, {failures} failed.")
        return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
