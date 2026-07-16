"""PostGIS data source: the real per-county indicator time-series.

In this stack the numeric series come straight from the PostGIS database. GeoServer
reads the same database to publish WMS map layers for the map view; it is not in the
path for the charts. So `DATA_SOURCE=postgis` is the real feed behind the same
`IndicatorSource` contract the stub implements.

Expected table (names overridable by env; see `_Cfg`):

    CREATE TABLE indicator_observations (
        county_id     text             NOT NULL,   -- matches catalog Location.id
        indicator_id  text             NOT NULL,   -- matches catalog Indicator.id
        period        date             NOT NULL,   -- first day of the month
        value         double precision,            -- NULL allowed (gap)
        PRIMARY KEY (county_id, indicator_id, period)
    );

The month label sent to the frontend is `to_char(period, 'YYYY-MM')`, which also sorts
correctly for the inclusive `from`/`to` filter. See services/api/sql/observations.sql.

The psycopg driver is imported lazily and the row fetch is injectable, so gate tests
run without a database or the driver installed (they feed canned rows). The real
fetch opens a short-lived connection per call, which is plenty for on-prem load and
is thread-safe under FastAPI's sync threadpool.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Callable, Optional

from ..schemas import Indicator, Location, ObservationPoint, ObservationSeries
from .base import SourceError, SourceUnavailable
from .catalog import INDICATORS, INDICATORS_BY_ID, LOCATIONS, LOCATIONS_BY_ID

# A fetcher takes (dsn, sql, params) and returns rows as (month_label, value) tuples.
Fetcher = Callable[[str, str, dict], list[tuple[str, Optional[float]]]]


@dataclass(frozen=True)
class _Cfg:
    table: str
    col_location: str
    col_indicator: str
    col_period: str
    col_value: str

    @classmethod
    def from_env(cls) -> "_Cfg":
        return cls(
            table=os.getenv("PG_OBS_TABLE", "indicator_observations"),
            col_location=os.getenv("PG_COL_LOCATION", "county_id"),
            col_indicator=os.getenv("PG_COL_INDICATOR", "indicator_id"),
            col_period=os.getenv("PG_COL_PERIOD", "period"),
            col_value=os.getenv("PG_COL_VALUE", "value"),
        )


def _dsn_from_env() -> str:
    """Full libpq connection string. PG_DSN wins; otherwise assemble from POSTGRES_*
    (the same variables the db service uses in docker-compose)."""
    dsn = os.getenv("PG_DSN")
    if dsn:
        return dsn
    host = os.getenv("PGHOST", "db")
    port = os.getenv("PGPORT", "5432")
    db = os.getenv("POSTGRES_DB", "asal")
    user = os.getenv("POSTGRES_USER", "asal")
    password = os.getenv("POSTGRES_PASSWORD", "")
    return f"host={host} port={port} dbname={db} user={user} password={password}"


def _psycopg_fetch(dsn: str, sql: str, params: dict) -> list[tuple[str, Optional[float]]]:
    """Real fetch. psycopg is imported here so the module loads without the driver."""
    try:
        import psycopg
    except ImportError as e:  # pragma: no cover - environment guard
        raise SourceUnavailable(
            "psycopg is not installed; add psycopg[binary] to run DATA_SOURCE=postgis"
        ) from e
    try:
        with psycopg.connect(dsn, connect_timeout=int(os.getenv("PG_CONNECT_TIMEOUT", "5"))) as conn:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                return [(str(r[0]), None if r[1] is None else float(r[1])) for r in cur.fetchall()]
    except SourceUnavailable:
        raise
    except Exception as e:  # psycopg.Error and friends -> infrastructure failure
        raise SourceUnavailable(f"postgis query failed: {e}") from e


class PostgresSource:
    kind = "postgis"

    def __init__(self, fetcher: Fetcher | None = None, cfg: _Cfg | None = None) -> None:
        self._fetch = fetcher or _psycopg_fetch
        self._cfg = cfg or _Cfg.from_env()

    def probe(self) -> None:
        """Readiness check: raise SourceUnavailable if the database is unreachable.
        Runs a no-row query so it costs a round-trip, not a scan."""
        self._fetch(
            _dsn_from_env(),
            "SELECT NULL::text, NULL::double precision WHERE false",
            {},
        )

    def list_locations(self) -> list[Location]:
        return list(LOCATIONS)

    def list_indicators(self) -> list[Indicator]:
        return list(INDICATORS)

    def _build_sql(self, frm: Optional[str], to: Optional[str]) -> tuple[str, dict]:
        c = self._cfg
        label = f"to_char({c.col_period}, 'YYYY-MM')"
        where = [f"{c.col_location} = %(loc)s", f"{c.col_indicator} = %(ind)s"]
        params: dict = {}
        if frm:
            where.append(f"{label} >= %(frm)s")
            params["frm"] = frm
        if to:
            where.append(f"{label} <= %(to)s")
            params["to"] = to
        sql = (
            f"SELECT {label} AS t, {c.col_value} AS value "
            f"FROM {c.table} WHERE {' AND '.join(where)} ORDER BY {c.col_period}"
        )
        return sql, params

    def get_series(
        self,
        location_id: str,
        indicator_id: str,
        frm: Optional[str] = None,
        to: Optional[str] = None,
    ) -> ObservationSeries:
        if location_id not in LOCATIONS_BY_ID:
            raise SourceError(f"unknown location: {location_id}")
        indicator = INDICATORS_BY_ID.get(indicator_id)
        if indicator is None:
            raise SourceError(f"unknown indicator: {indicator_id}")

        sql, params = self._build_sql(frm, to)
        params["loc"] = location_id
        params["ind"] = indicator_id
        rows = self._fetch(_dsn_from_env(), sql, params)

        points = [ObservationPoint(t=t, value=v) for t, v in rows]
        return ObservationSeries(
            location=location_id,
            indicator=indicator_id,
            unit=indicator.unit,
            source=self.kind,
            points=points,
        )
