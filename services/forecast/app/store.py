"""Persistence for trained model parameters ("weights").

Fitted Holt-Winters state is small and numeric, so it is stored as plain JSON, one
file for the whole catalog, keyed by "location:indicator". No binaries in the repo:
the artifacts directory is derived output and is gitignored. Retraining overwrites a
key in place.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from .model import FitResult

_ARTIFACTS = Path(os.getenv("FORECAST_ARTIFACTS", Path(__file__).resolve().parent.parent / "artifacts"))
_STORE = _ARTIFACTS / "params.json"


def _load_all() -> dict:
    if not _STORE.exists():
        return {}
    try:
        return json.loads(_STORE.read_text())
    except (json.JSONDecodeError, OSError):
        return {}


def count() -> int:
    return len(_load_all())


def save(key: str, state: FitResult) -> None:
    _ARTIFACTS.mkdir(parents=True, exist_ok=True)
    data = _load_all()
    data[key] = {
        "method": state.method,
        "level": state.level,
        "trend": state.trend,
        "seasonals": state.seasonals,
        "season_length": state.season_length,
        "alpha": state.alpha,
        "beta": state.beta,
        "gamma": state.gamma,
        "sigma": state.sigma,
        "sse": state.sse,
        "scored": state.scored,
        "n_train": state.n_train,
    }
    _STORE.write_text(json.dumps(data, indent=2, sort_keys=True))


def load(key: str) -> FitResult | None:
    d = _load_all().get(key)
    if d is None:
        return None
    return FitResult(
        method=d["method"], level=d["level"], trend=d["trend"],
        seasonals=d["seasonals"], season_length=d["season_length"],
        alpha=d["alpha"], beta=d["beta"], gamma=d["gamma"],
        sse=d["sse"], scored=d["scored"], sigma=d["sigma"], n_train=d["n_train"],
        params={"alpha": d["alpha"], "beta": d["beta"], "gamma": d["gamma"],
                "season_length": d["season_length"], "method": d["method"]},
    )
