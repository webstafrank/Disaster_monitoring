"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Layers, LineChart, Target, MapPin, Eye, Info, Sprout, Loader2, AlertTriangle } from "lucide-react";

import { api } from "@/app/lib/api";
import type { Location, MapLayer } from "@/contracts/types";

const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center rounded-[2rem] bg-[var(--surface-strong)] animate-pulse md:h-[520px] xl:h-[620px]">
      <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
        <Activity className="h-4 w-4 animate-spin" />
        Loading spatial intelligence...
      </p>
    </div>
  ),
});

const COUNTIES_URL = "/counties.geojson";
const YEARS = ["2022", "2023", "2024", "2025"];
// Indicators surfaced in the KPI ribbon (must exist in the API catalog).
// Class strings are literal so Tailwind can see them at build time (no interpolation).
const RIBBON = [
  { id: "ndvi", label: "Mean NDVI", icon: Sprout, iconWrap: "bg-[var(--earth-green-soft)] text-[var(--earth-green)]", fmt: (v: number) => v.toFixed(2) },
  { id: "vci", label: "VCI Condition", icon: Activity, iconWrap: "bg-[var(--savanna-gold-soft)] text-[var(--savanna-gold)]", fmt: (v: number) => `${v}%` },
  { id: "spi", label: "SPI Drought", icon: Target, iconWrap: "bg-[var(--terracotta-soft)] text-[var(--terracotta)]", fmt: (v: number) => v.toFixed(1) },
] as const;

// Always-on base layers the map draws itself (OSM basemap + county boundaries).
// GeoServer WMS layers are discovered at runtime and appended, toggleable.
const BASE_LAYERS = ["Basemap & Terrain Context", "County Boundaries"];

type IndicatorData = { latest: number | null; series: number[] };
type CountyData = Record<string, IndicatorData>;

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) {
    return <div className="h-12 w-full flex items-center text-[10px] text-slate-300">No data</div>;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const n = data.length;
  const y = (d: number) => 47 - ((d - min) / rng) * 44;
  const points = data.map((d, i) => `${(i / (n - 1)) * 100},${y(d)}`).join(" ");
  const lastY = y(data[n - 1]);
  return (
    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-12 overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" points={points} vectorEffect="non-scaling-stroke" />
      <rect x="96" y={lastY - 2} width="4" height="4" fill={color} />
    </svg>
  );
}

export function MapFramePanel() {
  const [counties, setCounties] = useState<Location[]>([]);
  const [geojson, setGeojson] = useState<unknown | null>(null);
  const [placeholder, setPlaceholder] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [year, setYear] = useState<string>(YEARS[YEARS.length - 1]);
  const [data, setData] = useState<CountyData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  // GeoServer WMS catalog for the layer manager + map overlays.
  const [wmsBaseUrl, setWmsBaseUrl] = useState("");
  const [wmsLayers, setWmsLayers] = useState<MapLayer[]>([]);
  const [wmsAvailable, setWmsAvailable] = useState<boolean | null>(null);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  // Catalog + boundaries, once.
  useEffect(() => {
    let cancelled = false;
    api
      .locations()
      .then((locs) => {
        if (cancelled) return;
        setCounties(locs);
        setActiveId((cur) => cur || locs[0]?.id || "");
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load counties"));

    fetch(COUNTIES_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("no counties.geojson"))))
      .then((fc) => {
        if (cancelled) return;
        setGeojson(fc);
        setPlaceholder(Boolean(fc?.placeholder));
      })
      .catch(() => {}); // map simply shows no boundaries if the file is missing
    return () => {
      cancelled = true;
    };
  }, []);

  // GeoServer WMS layer catalog (GET /map/layers). Empty until layers are published.
  useEffect(() => {
    let cancelled = false;
    api
      .mapLayers()
      .then((cat) => {
        if (cancelled) return;
        setWmsBaseUrl(cat.wms_base_url);
        setWmsLayers(cat.layers);
        setWmsAvailable(cat.available);
      })
      .catch(() => !cancelled && setWmsAvailable(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Map GeoJSON feature properties -> catalog county id (id or name, any common key).
  const idLookup = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of counties) {
      m[c.id.toLowerCase()] = c.id;
      m[c.name.toLowerCase()] = c.id;
    }
    return m;
  }, [counties]);

  const resolveId = useCallback(
    (props: Record<string, unknown>) => {
      const keys = ["county_id", "id", "COUNTY", "County", "county", "NAME_1", "name", "Name", "shapeName", "ADM1_EN"];
      for (const k of keys) {
        const v = props[k];
        if (v == null) continue;
        const hit = idLookup[String(v).toLowerCase()];
        if (hit) return hit;
      }
      return null;
    },
    [idLookup],
  );

  // KPIs + sparklines for the active county, filtered to the selected year.
  useEffect(() => {
    if (!activeId) return;
    const id = ++reqId.current;
    // Show the spinner immediately for the new county/year before the async
    // fetch resolves. The one extra render this triggers is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    const from = `${year}-01`;
    const to = `${year}-12`;
    Promise.all(
      RIBBON.map((r) =>
        api
          .observations(activeId, r.id, from, to)
          .then((s) => {
            const values = s.points.map((p) => p.value).filter((v): v is number => v != null);
            const latest = values.length ? values[values.length - 1] : null;
            return [r.id, { latest, series: values }] as const;
          })
          .catch(() => [r.id, { latest: null, series: [] }] as const),
      ),
    )
      .then((entries) => {
        if (id !== reqId.current) return;
        setData(Object.fromEntries(entries));
      })
      .catch((e) => {
        if (id === reqId.current) setError(e instanceof Error ? e.message : "Failed to load indicators");
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false);
      });
  }, [activeId, year]);

  const active = counties.find((c) => c.id === activeId) ?? null;
  const fallbackCenter: [number, number] = active ? [active.centroid.lat, active.centroid.lon] : [1.5, 38.5];

  return (
    <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-6 shadow-sm">
        {/* Header Controls */}
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-[var(--accent)]" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Selected County</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {counties.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300",
                    c.id === activeId
                      ? "bg-[var(--accent-strong)] text-white shadow-md"
                      : "bg-[var(--surface-strong)] text-slate-600 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-2">Temporal Filter</p>
            <div className="flex bg-[var(--surface-strong)] rounded-xl p-1 border border-[var(--line)]">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    y === year ? "bg-white shadow-sm text-[var(--accent-strong)]" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Ribbon (real values from the API for the selected county + year) */}
        <div className="grid grid-cols-3 gap-4 py-4 border-b border-[var(--line)]">
          {RIBBON.map((r, i) => {
            const d = data[r.id];
            const val = d && d.latest != null ? r.fmt(d.latest) : "—";
            return (
              <div key={r.id} className={`flex items-center gap-3 px-4 ${i > 0 ? "border-l border-[var(--line)]" : ""}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${r.iconWrap}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{r.label}</p>
                  <p className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                    {val}
                    {loading && <Loader2 className="h-3 w-3 animate-spin text-slate-300" />}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--terracotta)]/30 bg-[var(--terracotta-soft)] p-3">
            <AlertTriangle className="h-4 w-4 text-[var(--terracotta)] shrink-0" />
            <p className="text-sm font-medium text-[var(--terracotta)]">{error}</p>
          </div>
        )}

        <div className="relative mt-6 h-[460px] w-full overflow-hidden rounded-[2rem] border border-[var(--line)] shadow-sm md:h-[520px] xl:h-[620px]">
          <MapView
            geojson={geojson}
            selectedId={activeId}
            onSelect={setActiveId}
            resolveId={resolveId}
            fallbackCenter={fallbackCenter}
            fallbackZoom={7}
            wmsBaseUrl={wmsBaseUrl}
            wmsLayers={wmsLayers.map((l) => ({ name: l.name, visible: Boolean(visible[l.name]) }))}
          />

          {/* Map Overlay Info */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-[var(--line)] shadow-xl max-w-[240px]">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-[var(--accent)]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Viewport</p>
            </div>
            <p className="text-sm font-bold text-[var(--foreground)]">
              {active ? active.name : "—"} · {year}
            </p>
            {placeholder && (
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--savanna-gold)]">
                Sample boundaries
              </p>
            )}
          </div>

          {/* Coordinates Overlay */}
          {active && (
            <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--line)] shadow-sm flex items-center gap-2">
              <Target className="h-3 w-3 text-[var(--accent)]" />
              <span className="text-[10px] font-mono font-bold text-slate-600">
                {active.centroid.lat.toFixed(4)}°, {active.centroid.lon.toFixed(4)}°
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Tools */}
      <div className="space-y-6">
        <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-[var(--accent)]" />
            <h3 className="text-xl font-bold tracking-tight">Layer Manager</h3>
          </div>
          <div className="space-y-3">
            {/* Always-on base layers drawn by the map itself. */}
            {BASE_LAYERS.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl p-4 border bg-[var(--accent-soft)] border-[var(--accent)]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded border flex items-center justify-center bg-[var(--accent)] border-[var(--accent)]">
                    <div className="h-2 w-2 bg-white rounded-sm" />
                  </div>
                  <p className="text-sm font-bold text-[var(--accent-strong)]">{name}</p>
                </div>
              </div>
            ))}

            {/* GeoServer WMS layers, discovered at runtime and toggleable. */}
            {wmsLayers.map((layer) => {
              const on = Boolean(visible[layer.name]);
              return (
                <button
                  key={layer.name}
                  type="button"
                  onClick={() => setVisible((v) => ({ ...v, [layer.name]: !v[layer.name] }))}
                  title={layer.name}
                  className={`w-full group flex items-center justify-between rounded-2xl p-4 border text-left transition-all
                      ${on ? "bg-[var(--accent-soft)] border-[var(--accent)]/30" : "bg-[var(--surface-strong)] border-transparent hover:border-[var(--line)]"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors
                          ${on ? "bg-[var(--accent)] border-[var(--accent)]" : "border-slate-300 bg-white"}
                      `}
                    >
                      {on && <div className="h-2 w-2 bg-white rounded-sm" />}
                    </div>
                    <p className={`text-sm font-bold ${on ? "text-[var(--accent-strong)]" : "text-slate-600"}`}>
                      {layer.title}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Status note when GeoServer publishes nothing or is unreachable. */}
            {wmsAvailable !== null && wmsLayers.length === 0 && (
              <p className="rounded-2xl bg-[var(--surface-strong)] p-4 text-xs font-medium text-slate-500">
                {wmsAvailable ? "No GeoServer layers published yet." : "GeoServer layers unavailable."}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-[var(--sidebar-bg)] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Info className="h-5 w-5 text-[var(--sky-blue)]" />
            <h3 className="text-xl font-bold tracking-tight">Area Context</h3>
          </div>
          <p className="text-sm leading-relaxed text-[var(--sidebar-muted)] relative z-10">
            {active ? (
              <>
                <span className="text-white font-bold">{active.name}</span> County, centered at{" "}
                {active.centroid.lat.toFixed(2)}°, {active.centroid.lon.toFixed(2)}°. Indicator values shown are drawn
                from the monitoring API for {year}.
              </>
            ) : (
              "Select a county to load its indicators."
            )}
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-[var(--earth-green)]" />
              <h3 className="text-xl font-bold tracking-tight">Trend Analysis</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{year}</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-slate-600">NDVI</p>
                <span className="text-[10px] text-slate-400">{data.ndvi?.series.length ?? 0} pts</span>
              </div>
              <MiniSparkline data={data.ndvi?.series ?? []} color="var(--savanna-gold)" />
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-slate-600">SPI (Precipitation)</p>
                <span className="text-[10px] text-slate-400">{data.spi?.series.length ?? 0} pts</span>
              </div>
              <MiniSparkline data={data.spi?.series ?? []} color="var(--sky-blue)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
