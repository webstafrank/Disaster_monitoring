# API service

FastAPI backend implementing `contracts/openapi.yaml`. Pulls indicator series from the
active data source, runs deterministic analytics, and calls `services/llm` for narrative.

## Endpoints

| Method | Path            | Purpose |
|--------|-----------------|---------|
| GET    | `/health`       | Liveness + data-source status |
| GET    | `/locations`    | Monitored ASAL counties |
| GET    | `/indicators`   | Available disaster indicators |
| GET    | `/observations` | Time-series for one location + indicator |
| POST   | `/insight`      | Analytics + generated narrative |

## Layout

- `app/analytics.py` — deterministic severity/trend/anomaly (the math). Unit-tested.
- `app/sources/` — data adapters: `stub.py` (placeholder), `geoserver.py` (real, pending),
  `catalog.py` (shared counties + indicators). `get_source()` picks via `DATA_SOURCE`.
- `app/insight.py` — assembles analytics + narrative into an `Insight`.
- `app/llm_client.py` — calls `services/llm`; falls back to a template if it is down.
- `app/main.py` — routes + CORS + error shape.

## Config

See `.env.example`. Key vars: `DATA_SOURCE`, `LLM_URL`, `CORS_ORIGINS`, `GEOSERVER_*`.

## Test

```bash
cd services/api && python -m pytest          # gate (free)
DATA_SOURCE=stub LLM_URL=http://127.0.0.1:8100 python -m pytest evals   # paid, needs llm up
```

## Wiring the real source

Implement `GeoServerSource.get_series` in `app/sources/geoserver.py` (sketch in the file),
set `DATA_SOURCE=geoserver` and the `GEOSERVER_*` env vars. No frontend or contract change
needed: the shape is identical, only `source` flips from `stub` to `geoserver`.
