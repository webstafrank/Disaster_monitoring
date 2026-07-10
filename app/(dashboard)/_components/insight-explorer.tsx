"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Gauge,
  Loader2,
  MapPin,
  Minus,
  Sparkles,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api, ApiRequestError } from "@/app/lib/api";
import type { DataSourceKind, Indicator, Insight, Location, SeverityClass, TrendDirection } from "@/contracts/types";

const DATA_SOURCE_LABEL: Record<DataSourceKind, string> = {
  stub: "Placeholder data",
  postgis: "Live · PostGIS",
  geoserver: "GeoServer",
};

const SEVERITY_STYLE: Record<SeverityClass, { bg: string; fg: string; label: string }> = {
  normal: { bg: "var(--earth-green-soft)", fg: "var(--earth-green)", label: "Normal" },
  watch: { bg: "var(--sky-blue-soft)", fg: "var(--sky-blue)", label: "Watch" },
  warning: { bg: "var(--savanna-gold-soft)", fg: "var(--savanna-gold)", label: "Warning" },
  severe: { bg: "var(--terracotta-soft)", fg: "var(--terracotta)", label: "Severe" },
  emergency: { bg: "#fee2e2", fg: "#991b1b", label: "Emergency" },
};

function TrendBadge({ direction }: { direction: TrendDirection }) {
  const map = {
    improving: { icon: ArrowUpRight, color: "var(--earth-green)", label: "Improving" },
    declining: { icon: ArrowDownRight, color: "var(--terracotta)", label: "Declining" },
    stable: { icon: Minus, color: "var(--sky-blue)", label: "Stable" },
  }[direction];
  const Icon = map.icon;
  return (
    <span className="inline-flex items-center gap-1 font-bold" style={{ color: map.color }}>
      <Icon className="h-4 w-4" /> {map.label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

export function InsightExplorer() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loc, setLoc] = useState<string>("");
  const [ind, setInd] = useState<string>("");
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  // Load the catalog once.
  useEffect(() => {
    let cancelled = false;
    Promise.all([api.locations(), api.indicators()])
      .then(([locs, inds]) => {
        if (cancelled) return;
        setLocations(locs);
        setIndicators(inds);
        setLoc((cur) => cur || locs[0]?.id || "");
        setInd((cur) => cur || inds[0]?.id || "");
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load catalog"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch insight whenever the selection changes.
  useEffect(() => {
    if (!loc || !ind) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    api
      .insight({ location: loc, indicator: ind })
      .then((res) => {
        if (id === reqId.current) setInsight(res);
      })
      .catch((e) => {
        if (id !== reqId.current) return;
        setError(e instanceof ApiRequestError ? e.message : "Could not reach the intelligence API.");
        setInsight(null);
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false);
      });
  }, [loc, ind]);

  // History plus the forecast tail. The last historical point carries the forecast
  // mean and a zero-width band so the dashed projection line connects cleanly.
  const history = insight?.series.points ?? [];
  const fc = insight?.forecast?.points ?? [];
  const chartData: Array<{
    t: string;
    value?: number | null;
    forecast?: number;
    range?: [number, number];
  }> = [
    ...history.map((p, i) => {
      const last = i === history.length - 1;
      return {
        t: p.t,
        value: p.value,
        forecast: last && p.value != null ? p.value : undefined,
        range: last && p.value != null ? ([p.value, p.value] as [number, number]) : undefined,
      };
    }),
    ...fc.map((p) => ({
      t: p.t,
      value: undefined,
      forecast: p.value,
      range: [p.lower, p.upper] as [number, number],
    })),
  ];
  const projection = fc.length ? fc[fc.length - 1] : null;
  const forecastMeta = insight?.forecast ?? null;
  const sev = insight ? SEVERITY_STYLE[insight.analytics.severity.class] : null;

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Select County</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {locations.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLoc(l.id)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                l.id === loc
                  ? "bg-[var(--accent-strong)] text-white shadow-md"
                  : "bg-[var(--surface-strong)] text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Gauge className="h-4 w-4 text-[var(--earth-green)]" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Disaster Indicator</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {indicators.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setInd(i.id)}
              title={i.description}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                i.id === ind
                  ? "bg-[var(--earth-green)] text-white shadow-md"
                  : "bg-[var(--surface-strong)] text-slate-600 hover:bg-slate-100"
              }`}
            >
              {i.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--terracotta)]/30 bg-[var(--terracotta-soft)] p-4">
          <AlertTriangle className="h-5 w-5 text-[var(--terracotta)] shrink-0" />
          <p className="text-sm font-medium text-[var(--terracotta)]">{error}</p>
        </div>
      )}

      {/* Result */}
      {insight && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Left: analytics + chart */}
          <div className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {insight.location.name} · {insight.indicator.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{insight.indicator.full_name}</p>
              </div>
              <div className="flex items-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)]" />}
                {sev && (
                  <span
                    className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{ background: sev.bg, color: sev.fg }}
                  >
                    {sev.label}
                  </span>
                )}
                <span
                  className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    borderColor: "var(--line)",
                    color: insight.data_source === "stub" ? "var(--savanna-gold)" : "var(--earth-green)",
                  }}
                  title="Data provenance"
                >
                  {DATA_SOURCE_LABEL[insight.data_source] ?? insight.data_source}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat
                label={`Latest (${insight.indicator.unit})`}
                value={insight.analytics.latest_value?.toString() ?? "—"}
              />
              <Stat label="Window mean" value={insight.analytics.mean?.toString() ?? "—"} />
              <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trend</p>
                <p className="mt-1 text-sm">
                  <TrendBadge direction={insight.analytics.trend.direction} />
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {insight.analytics.trend.pct_change}% over window
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Anomaly</p>
                <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
                  {insight.analytics.anomaly.z_score}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {insight.analytics.anomaly.is_anomalous ? "z outside ±2" : "within range"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {insight.period.from} → {projection ? projection.t : insight.period.to}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {insight.series.points.length} obs
                  {fc.length ? ` + ${fc.length} forecast` : ""}
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="insightFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                    <XAxis
                      dataKey="t"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} width={40} />
                    <Tooltip
                      contentStyle={{ borderRadius: 0, border: "1px solid var(--line)", fontSize: 12 }}
                    />
                    {/* Prediction interval band over the forecast tail. */}
                    <Area
                      type="linear"
                      dataKey="range"
                      stroke="none"
                      fill="var(--savanna-gold)"
                      fillOpacity={0.15}
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                      connectNulls
                    />
                    {/* Observed history. */}
                    <Area
                      type="linear"
                      dataKey="value"
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      fill="url(#insightFill)"
                      dot={false}
                      activeDot={{ r: 0 }}
                      connectNulls={false}
                    />
                    {/* Trained-model projection. */}
                    <Line
                      type="linear"
                      dataKey="forecast"
                      stroke="var(--savanna-gold)"
                      strokeWidth={2.5}
                      strokeDasharray="5 4"
                      dot={false}
                      activeDot={{ r: 3 }}
                      isAnimationActive={false}
                      connectNulls
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Projection summary */}
              {projection && forecastMeta && (
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-[var(--savanna-gold)]/30 bg-[var(--savanna-gold-soft)] p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-0 w-6 border-t-2 border-dashed border-[var(--savanna-gold)]" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {forecastMeta.horizon}-mo forecast
                    </p>
                  </div>
                  <p className="text-sm">
                    <span className="font-bold text-[var(--foreground)]">
                      {projection.value} {insight.indicator.unit}
                    </span>{" "}
                    <span className="text-slate-500">
                      by {projection.t} (range {projection.lower}–{projection.upper})
                    </span>
                  </p>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {forecastMeta.method}
                    </span>
                    {forecastMeta.backtest && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: forecastMeta.backtest.beats_naive
                            ? "var(--earth-green-soft)"
                            : "var(--terracotta-soft)",
                          color: forecastMeta.backtest.beats_naive
                            ? "var(--earth-green)"
                            : "var(--terracotta)",
                        }}
                        title={`MASE ${forecastMeta.backtest.mase} vs seasonal-naive`}
                      >
                        {forecastMeta.backtest.beats_naive ? "beats naive" : "below naive"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: narrative */}
          <div className="rounded-[2rem] bg-[var(--sidebar-bg)] p-7 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--savanna-gold)]" />
                <h3 className="text-xl font-bold tracking-tight">Model Insight</h3>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-muted)] mb-2">
                  Assessment
                </p>
                <p className="text-sm leading-relaxed text-white/90">{insight.narrative.summary}</p>
              </div>

              <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--sidebar-surface)] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--savanna-gold)] mb-2 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> Recommendation
                </p>
                <p className="text-sm leading-relaxed text-white/90">
                  {insight.narrative.recommendation}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Activity className="h-3.5 w-3.5 text-[var(--sidebar-muted)]" />
                <p className="text-[11px] text-[var(--sidebar-muted)]">
                  {insight.narrative.generated
                    ? `Generated by ${insight.narrative.model}`
                    : "Template fallback (narrative service offline)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* First-load skeleton */}
      {!insight && !error && (
        <div className="flex h-48 items-center justify-center rounded-[2rem] border border-[var(--line)] bg-white">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading intelligence...
          </p>
        </div>
      )}
    </div>
  );
}
