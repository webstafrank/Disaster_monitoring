// Frontend-facing mirror of contracts/openapi.yaml.
// openapi.yaml is the single source of truth. Keep this file in lockstep with it.
// The frontend imports these via "@/contracts/types" (see tsconfig paths).

export type DataSourceKind = "stub" | "geoserver";

export interface Health {
  status: "ok";
  data_source: DataSourceKind;
  llm_mode: "claude" | "stub";
  version?: string;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Location {
  id: string;
  name: string;
  type: "county";
  centroid: LatLon;
  bbox?: [number, number, number, number];
}

export type IndicatorCategory = "vegetation" | "drought" | "hydrology" | "hazard";
export type Direction = "higher_is_better" | "lower_is_better";

export interface Indicator {
  id: string;
  name: string;
  full_name: string;
  unit: string;
  category: IndicatorCategory;
  direction: Direction;
  description?: string;
  value_range?: { min?: number; max?: number };
}

export interface ObservationPoint {
  t: string; // YYYY-MM
  value: number | null;
}

export interface ObservationSeries {
  location: string;
  indicator: string;
  unit: string;
  source: DataSourceKind;
  points: ObservationPoint[];
}

export type SeverityClass = "normal" | "watch" | "warning" | "severe" | "emergency";
export type TrendDirection = "improving" | "stable" | "declining";

export interface Trend {
  direction: TrendDirection;
  slope_per_month: number;
  pct_change: number;
}

export interface Anomaly {
  z_score: number;
  is_anomalous: boolean;
}

export interface Severity {
  class: SeverityClass;
  score: number;
  rationale_code: string;
}

export interface Analytics {
  latest_value: number | null;
  mean: number | null;
  n_points: number;
  trend: Trend;
  anomaly: Anomaly;
  severity: Severity;
}

export interface Narrative {
  summary: string;
  recommendation: string;
  generated: boolean;
  model: string;
}

export interface InsightRequest {
  location: string;
  indicator: string;
  from?: string;
  to?: string;
}

export interface Period {
  from?: string;
  to?: string;
}

export interface Insight {
  location: Location;
  indicator: Indicator;
  period: Period;
  series: ObservationSeries;
  analytics: Analytics;
  narrative: Narrative;
  data_source: DataSourceKind;
  generated_at: string | null;
}

export interface ApiError {
  error: string;
  detail: string;
}
