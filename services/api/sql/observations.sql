-- Per-county monthly indicator observations: the real numeric feed for the API
-- (DATA_SOURCE=postgis). GeoServer reads the same database to publish map layers.
--
-- county_id / indicator_id MUST match the catalog ids in
-- services/api/app/sources/catalog.py (e.g. 'turkana', 'vci'). period is the first
-- day of the month; the API exposes it to the frontend as to_char(period,'YYYY-MM').
--
-- Column names can be overridden without touching this schema via env
-- (PG_OBS_TABLE, PG_COL_LOCATION, PG_COL_INDICATOR, PG_COL_PERIOD, PG_COL_VALUE),
-- but these defaults are what the adapter expects out of the box.

CREATE TABLE IF NOT EXISTS indicator_observations (
    county_id     text             NOT NULL,
    indicator_id  text             NOT NULL,
    period        date             NOT NULL,
    value         double precision,            -- NULL = observed gap
    PRIMARY KEY (county_id, indicator_id, period)
);

-- Fast lookup for get_series (one county+indicator, ordered by month).
CREATE INDEX IF NOT EXISTS idx_obs_series
    ON indicator_observations (county_id, indicator_id, period);
