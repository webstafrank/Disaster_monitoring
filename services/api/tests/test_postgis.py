"""Gate tests for the PostGIS source.

No database and no driver required: the row fetch is injected, so these are free,
deterministic, and driver-free. They pin the SQL shape, the row->series mapping, and
the error taxonomy (bad request -> SourceError/404, store down -> SourceUnavailable/503).
"""

import os

os.environ.setdefault("DATA_SOURCE", "stub")  # keep main's module-level source on stub

from fastapi.testclient import TestClient  # noqa: E402

import app.main as main  # noqa: E402
from app.sources.base import SourceError, SourceUnavailable  # noqa: E402
from app.sources.postgis import _Cfg, PostgresSource  # noqa: E402


def _source(rows=None, raise_exc=None):
    captured = {}

    def fetcher(dsn, sql, params):
        captured["dsn"] = dsn
        captured["sql"] = sql
        captured["params"] = params
        if raise_exc is not None:
            raise raise_exc
        return rows if rows is not None else []

    return PostgresSource(fetcher=fetcher), captured


def test_maps_rows_to_series():
    src, _ = _source(rows=[("2024-01", 30.0), ("2024-02", None), ("2024-03", 28.5)])
    series = src.get_series("turkana", "vci")
    assert series.source == "postgis"
    assert series.location == "turkana"
    assert series.unit == "percent"  # from catalog
    assert [p.t for p in series.points] == ["2024-01", "2024-02", "2024-03"]
    assert [p.value for p in series.points] == [30.0, None, 28.5]


def test_sql_is_parameterised_with_ids_and_dates():
    src, cap = _source(rows=[])
    src.get_series("garissa", "ndvi", "2024-01", "2024-12")
    sql, params = cap["sql"], cap["params"]
    assert "to_char" in sql and "ORDER BY" in sql
    # Ids and bounds travel as bound params, never interpolated into the SQL text.
    assert params["loc"] == "garissa"
    assert params["ind"] == "ndvi"
    assert params["frm"] == "2024-01"
    assert params["to"] == "2024-12"
    assert "garissa" not in sql and "2024-01" not in sql


def test_no_date_filter_omits_bounds():
    src, cap = _source(rows=[])
    src.get_series("wajir", "spi")
    assert "frm" not in cap["params"] and "to" not in cap["params"]


def test_column_overrides_respected():
    cfg = _Cfg(table="obs", col_location="loc_id", col_indicator="ind_id",
               col_period="ts", col_value="val")
    captured = {}

    def fetcher(dsn, sql, params):
        captured["sql"] = sql
        return []

    src = PostgresSource(fetcher=fetcher, cfg=cfg)
    src.get_series("kitui", "rainfall")
    sql = captured["sql"]
    assert "FROM obs" in sql
    assert "loc_id = %(loc)s" in sql
    assert "ind_id = %(ind)s" in sql
    assert "val AS value" in sql
    assert "to_char(ts," in sql


def test_unknown_location_is_source_error():
    src, _ = _source(rows=[])
    try:
        src.get_series("atlantis", "vci")
    except SourceError as e:
        assert not isinstance(e, SourceUnavailable)
        return
    raise AssertionError("expected SourceError")


def test_unknown_indicator_is_source_error():
    src, _ = _source(rows=[])
    try:
        src.get_series("turkana", "nope")
    except SourceError:
        return
    raise AssertionError("expected SourceError")


def test_store_failure_propagates_as_unavailable():
    src, _ = _source(raise_exc=SourceUnavailable("db down"))
    try:
        src.get_series("turkana", "vci")
    except SourceUnavailable:
        return
    raise AssertionError("expected SourceUnavailable")


# --- API-level error mapping (swap the module-level source, then restore) ----

class _Boom:
    kind = "postgis"

    def list_locations(self):
        return []

    def list_indicators(self):
        return []

    def get_series(self, *a, **k):
        raise SourceUnavailable("db down")


def test_api_returns_503_when_store_unavailable():
    original = main.source
    main.source = _Boom()
    try:
        client = TestClient(main.app, raise_server_exceptions=False)
        r = client.post("/insight", json={"location": "turkana", "indicator": "vci"})
        assert r.status_code == 503
        assert r.json()["error"] == "source_unavailable"
        # health reflects the active source kind
        assert client.get("/health").json()["data_source"] == "postgis"
    finally:
        main.source = original
