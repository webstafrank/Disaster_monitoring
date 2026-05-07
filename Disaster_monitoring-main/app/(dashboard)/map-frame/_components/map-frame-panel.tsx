"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Map as MapIcon,
  Calendar,
  Search,
  Bell,
  Settings,
  Download,
  Share2,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Eye,
  Database,
  Shield,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
  Maximize2,
  Minimize2,
  Zap,
  Globe,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Satellite,
  TreePine,
  Droplets,
  Mountain,
  MapPin,
  HardDrive,
  Wifi,
  Server,
  Cpu
} from "lucide-react";

/* ─────────── Dynamic Map — NO loading prop, render immediately ─────────── */
const MapView = dynamic(() => import("./map-view"), { ssr: false });

/* ─────────── Types ─────────── */
type Area = {
  id: string;
  label: string;
  years: string[];
  center: [number, number];
  zoom: number;
  note: string;
  layers: string[];
  stats: {
    coverage: number;
    changeRate: number;
    quality: number;
    vegetation: number;
  };
};

type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
};

/* ─────────── Data ─────────── */
const areas: Area[] = [
  {
    id: "study-area",
    label: "Study Area",
    years: ["2020", "2021", "2022", "2023", "2024", "2025"],
    center: [0.0236, 37.9062],
    zoom: 6,
    note: "National comparison for GeoServer-published yearly layers.",
    layers: ["Country boundary", "Annual coverage mosaic", "Regional labels"],
    stats: { coverage: 94.2, changeRate: 2.3, quality: 98.5, vegetation: 67.4 },
  },
  {
    id: "northern-rangelands",
    label: "Northern Rangelands",
    years: ["2020", "2021", "2022", "2023", "2024", "2025"],
    center: [2.3, 37.5],
    zoom: 7,
    note: "Dryland and rangeland views for vegetation and drought comparison.",
    layers: ["Rangeland extent", "Seasonal vegetation layer", "Drought severity"],
    stats: { coverage: 87.1, changeRate: -1.2, quality: 96.3, vegetation: 42.8 },
  },
  {
    id: "eastern-agricultural-corridor",
    label: "Eastern Agricultural Corridor",
    years: ["2020", "2021", "2022", "2023", "2024", "2025"],
    center: [-0.5, 38.5],
    zoom: 8,
    note: "Agricultural footprint and land-use change over published years.",
    layers: ["Cropland blocks", "Irrigation footprint", "Land-use change"],
    stats: { coverage: 91.5, changeRate: 4.7, quality: 97.8, vegetation: 78.9 },
  },
  {
    id: "southwestern-highlands",
    label: "Southwestern Highlands",
    years: ["2020", "2021", "2022", "2023", "2024", "2025"],
    center: [-1.0, 35.5],
    zoom: 8,
    note: "Mountainous terrain view for vegetation recovery and slope-sensitive change.",
    layers: ["Terrain context", "Vegetation vigor", "Watershed boundaries"],
    stats: { coverage: 89.3, changeRate: 1.8, quality: 95.1, vegetation: 82.3 },
  },
];

const recentActivity: ActivityItem[] = [
  { id: "1", user: "Dr. A. Kimani", action: "published", target: "2025 vegetation analysis", time: "5 min ago", avatar: "AK" },
  { id: "2", user: "J. Ochieng", action: "reviewed", target: "Eastern corridor LULC", time: "12 min ago", avatar: "JO" },
  { id: "3", user: "M. Wanjiku", action: "exported", target: "Highlands DEM dataset", time: "34 min ago", avatar: "MW" },
  { id: "4", user: "P. Njoroge", action: "flagged", target: "Rangeland quality issue", time: "1 hr ago", avatar: "PN" },
  { id: "5", user: "S. Mutua", action: "updated", target: "Basemap tiles v2.4", time: "2 hrs ago", avatar: "SM" },
  { id: "6", user: "L. Wambui", action: "analyzed", target: "Drought severity Q1", time: "3 hrs ago", avatar: "LW" },
  { id: "7", user: "K. Mwangi", action: "approved", target: "Forest cover 2024", time: "5 hrs ago", avatar: "KM" },
];

const tableData = [
  { id: "L-2025-001", name: "Vegetation Mosaic 2025", area: "National", type: "Raster", size: "4.2 GB", status: "Published", date: "2025-04-28" },
  { id: "L-2025-002", name: "Rangeland Extent Q1", area: "Northern", type: "Vector", size: "156 MB", status: "Published", date: "2025-04-25" },
  { id: "L-2025-003", name: "Cropland Blocks", area: "Eastern", type: "Vector", size: "89 MB", status: "Processing", date: "2025-04-24" },
  { id: "L-2025-004", name: "Terrain Context DEM", area: "Southwestern", type: "Raster", size: "2.1 GB", status: "Published", date: "2025-04-22" },
  { id: "L-2025-005", name: "Drought Severity Index", area: "Northern", type: "Raster", size: "1.8 GB", status: "Review", date: "2025-04-20" },
  { id: "L-2025-006", name: "Watershed Boundaries", area: "Southwestern", type: "Vector", size: "234 MB", status: "Published", date: "2025-04-18" },
];

/* ─────────── Sub-Components ─────────── */

function KPICard({ title, value, change, changeType, icon: Icon, color }: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10 ${color}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-xl tracking-tight font-bold text-black/70 text-shadow-amber-700 text-[var(--foreground)]">{value}</p>
          <div className="mt-2 flex items-center gap-1.5">
            {changeType === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
            {changeType === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
            <span className={`text-xs font-bold ${changeType === "up" ? "text-emerald-600" : changeType === "down" ? "text-red-600" : "text-slate-500"}`}>
              {change}
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
    </div>
  );
}

function AreaChartSVG({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 280;
  const height = 80;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0,${height} ${points.split(" ").map((p, i) => `${i === 0 ? "L" : "L"}${p}`).join(" ")} L${width},${height} Z`} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="2" />;
      })}
    </svg>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
        {data.map((d, i) => {
          const start = (cumulative / total) * 360;
          const sweep = (d.value / total) * 360;
          cumulative += d.value;
          const startRad = (start * Math.PI) / 180;
          const endRad = ((start + sweep) * Math.PI) / 180;
          const x1 = 60 + 45 * Math.cos(startRad);
          const y1 = 60 + 45 * Math.sin(startRad);
          const x2 = 60 + 45 * Math.cos(endRad);
          const y2 = 60 + 45 * Math.sin(endRad);
          const largeArc = sweep > 180 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M60,60 L${x1},${y1} A45,45 0 ${largeArc},1 ${x2},${y2} Z`}
              fill={d.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        <circle cx="60" cy="60" r="28" fill="white" />
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs font-semibold text-slate-600">{d.label}</span>
            <span className="text-xs font-bold text-slate-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-800">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Review: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
      {status === "Published" && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {status === "Processing" && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
      {status === "Review" && <Eye className="mr-1 h-3 w-3" />}
      {status}
    </span>
  );
}

function MiniStat({ label, value, icon: Icon, color }: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 border border-transparent hover:border-[var(--line)] transition-all">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`h-4 w-4 ${color.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-bold text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}

/* ─────────── Main Dashboard ─────────── */
export function MapFramePanel() {
  const [activeArea, setActiveArea] = useState(areas[0]);
  const [activeYear, setActiveYear] = useState(areas[0].years.at(-1) ?? "2025");
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set(activeArea.layers));
  const [showExportModal, setShowExportModal] = useState(false);

  const publishedLayers = useMemo(
    () => activeArea.layers.map((layer) => `${layer} ${activeYear}`),
    [activeArea, activeYear],
  );

  const coverageData = [62, 68, 71, 75, 82, activeArea.stats.coverage];
  const vegetationData = [45, 52, 58, 61, 65, activeArea.stats.vegetation];

  const landUseData = [
    { label: "Forest", value: 34, color: "#059669" },
    { label: "Agriculture", value: 28, color: "#d97706" },
    { label: "Rangeland", value: 22, color: "#b45309" },
    { label: "Water", value: 10, color: "#2563eb" },
    { label: "Urban", value: 6, color: "#475569" },
  ];

  useEffect(() => {
    setSelectedLayers(new Set(activeArea.layers));
  }, [activeArea]);

  const toggleLayer = (layer: string) => {
    const next = new Set(selectedLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    setSelectedLayers(next);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-6 space-y-6">
        {/* Breadcrumb & Title */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-[var(--accent)]">Spatial Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {activeArea.label}
              <span className="ml-3 inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-strong)]">
                {activeYear}
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">Real-time geospatial monitoring and land-use analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[color:rgba(23,78,166,0.2)] hover:bg-[var(--accent)] transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-slate-500 hover:bg-slate-50 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total Coverage" value={`${activeArea.stats.coverage}%`} change="+2.3%" changeType="up" icon={Satellite} color="bg-blue-500" />
          <KPICard title="Vegetation Index" value={`${activeArea.stats.vegetation}%`} change="+1.8%" changeType="up" icon={TreePine} color="bg-emerald-500" />
          <KPICard title="Data Quality" value={`${activeArea.stats.quality}%`} change="-0.2%" changeType="down" icon={Shield} color="bg-violet-500" />
          <KPICard title="Change Rate" value={`${activeArea.stats.changeRate > 0 ? "+" : ""}${activeArea.stats.changeRate}%`} change="Stable" changeType="neutral" icon={Zap} color="bg-amber-500" />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 xl:grid-cols-12">

          {/* LEFT COLUMN - 8 cols */}
          <div className="xl:col-span-8 space-y-6">

            {/* Map Card */}
            <div className={`rounded-3xl border border-[var(--line)] bg-white shadow-sm overflow-hidden transition-all duration-500 ${mapFullscreen ? "fixed inset-4 z-50" : ""}`}>
              <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                    <MapIcon className="h-5 w-5 text-[var(--accent-strong)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Interactive Map</h3>
                    <p className="text-xs text-slate-400">{activeArea.center.join(", ")} · Zoom {activeArea.zoom}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMapFullscreen(!mapFullscreen)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-slate-400 hover:text-slate-600 transition-colors">
                    {mapFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {areas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => { setActiveArea(area); setActiveYear(area.years.at(-1) ?? "2025"); }}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                        area.id === activeArea.id
                          ? "bg-[var(--accent-strong)] text-white shadow-lg shadow-[color:rgba(23,78,166,0.25)]"
                          : "border border-[var(--line)] bg-white text-slate-600 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Year</span>
                  <div className="flex gap-1.5">
                    {activeArea.years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          year === activeYear
                            ? "bg-[var(--secondary)] text-white shadow-md"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-[var(--line)]"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`relative w-full overflow-hidden rounded-2xl border border-[var(--line)] shadow-inner ${mapFullscreen ? "h-[calc(100vh-220px)]" : "h-[420px] md:h-[500px] xl:h-[520px]"}`}>
                  <MapView center={activeArea.center} zoom={activeArea.zoom} />

                  <div className="absolute top-4 left-4 z-[1000] space-y-2">
                    <div className="rounded-xl bg-white/95 backdrop-blur-md p-3 shadow-lg border border-[var(--line)]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Base Layers</p>
                      {activeArea.layers.map((layer) => (
                        <button key={layer} onClick={() => toggleLayer(layer)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                          <div className={`h-2.5 w-2.5 rounded-sm border-2 transition-colors ${selectedLayers.has(layer) ? "border-[var(--accent-strong)] bg-[var(--accent-strong)]" : "border-slate-300"}`} />
                          {layer}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-white/95 backdrop-blur-md p-3 shadow-lg border border-[var(--line)] max-w-[220px]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Region Info</p>
                    <p className="text-sm font-bold mt-1 text-[var(--foreground)]">{activeArea.label}</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /><p className="text-[10px] font-medium text-slate-600">Coverage: {activeArea.stats.coverage}%</p></div>
                      <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /><p className="text-[10px] font-medium text-slate-600">Quality: {activeArea.stats.quality}%</p></div>
                      <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /><p className="text-[10px] font-medium text-slate-600">Year: {activeYear}</p></div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 z-[1000] flex gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 backdrop-blur shadow-lg border border-[var(--line)] text-slate-500 hover:text-slate-700 transition-colors"><RefreshCw className="h-4 w-4" /></button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 backdrop-blur shadow-lg border border-[var(--line)] text-slate-500 hover:text-slate-700 transition-colors"><Layers className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-3xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-[var(--accent-strong)]" />
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Published Layers</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">{tableData.length}</span>
                </div>
                <button className="text-xs font-bold text-[var(--accent-strong)] hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-slate-50/50">
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Layer Name</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Area</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Size</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</th>
                      <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id} className="border-b border-[var(--line)] last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3.5 text-xs font-mono font-semibold text-slate-500">{row.id}</td>
                        <td className="px-6 py-3.5 text-xs font-bold text-[var(--foreground)]">{row.name}</td>
                        <td className="px-6 py-3.5 text-xs text-slate-600">{row.area}</td>
                        <td className="px-6 py-3.5"><span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{row.type}</span></td>
                        <td className="px-6 py-3.5 text-xs font-semibold text-slate-600">{row.size}</td>
                        <td className="px-6 py-3.5"><StatusBadge status={row.status} /></td>
                        <td className="px-6 py-3.5 text-xs text-slate-500">{row.date}</td>
                        <td className="px-6 py-3.5 text-right">
                          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Total Layers" value="1,247" icon={Layers} color="bg-blue-500" />
              <MiniStat label="Storage Used" value="842 GB" icon={HardDrive} color="bg-violet-500" />
              <MiniStat label="Active Users" value="18" icon={Users} color="bg-emerald-500" />
              <MiniStat label="Processing" value="3 jobs" icon={Cpu} color="bg-amber-500" />
            </div>

            {/* System Status */}
            <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">System</p>
                  <h3 className="mt-1 text-sm font-bold text-[var(--foreground)]">Service Status</h3>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700">All Systems Nominal</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "GeoServer", status: "Operational", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50", uptime: "99.9%" },
                  { name: "PostGIS Database", status: "Operational", icon: Database, color: "text-emerald-500", bg: "bg-emerald-50", uptime: "99.8%" },
                  { name: "Tile Cache CDN", status: "Degraded", icon: Server, color: "text-amber-500", bg: "bg-amber-50", uptime: "94.2%" },
                  { name: "Processing Queue", status: "Operational", icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-50", uptime: "99.5%" },
                  { name: "WMS/WFS Services", status: "Operational", icon: Wifi, color: "text-emerald-500", bg: "bg-emerald-50", uptime: "99.7%" },
                  { name: "Storage Cluster", status: "Operational", icon: HardDrive, color: "text-emerald-500", bg: "bg-emerald-50", uptime: "100%" },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${service.bg}`}>
                        <service.icon className={`h-4 w-4 ${service.color}`} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">{service.name}</span>
                        <span className="text-[10px] text-slate-400">Uptime {service.uptime}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${service.color}`}>{service.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* RIGHT COLUMN - 4 cols */}
          <div className="xl:col-span-4 flex flex-col gap-6">

            {/* Coverage Chart */}
            <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Trend Analysis</p>
                  <h3 className="mt-1 text-sm font-bold text-[var(--foreground)]">Coverage Over Time</h3>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  <TrendingUp className="h-3 w-3" />+{activeArea.stats.coverage - 62}%
                </div>
              </div>
              <AreaChartSVG data={coverageData} color="#2563eb" />
              <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {activeArea.years.map((y) => <span key={y}>{y}</span>)}
              </div>
            </div>

            {/* Vegetation Chart */}
            <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Vegetation</p>
                  <h3 className="mt-1 text-sm font-bold text-[var(--foreground)]">Vegetation Index Trend</h3>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  <TreePine className="h-3 w-3" />{activeArea.stats.vegetation}%
                </div>
              </div>
              <AreaChartSVG data={vegetationData} color="#059669" />
              <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {activeArea.years.map((y) => <span key={y}>{y}</span>)}
              </div>
            </div>

            {/* Land Use + Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
              <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Composition</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--foreground)] mb-5">Land Use Distribution</h3>
                <DonutChart data={landUseData} />
              </div>
              <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Quality Metrics</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--foreground)] mb-5">Data Quality Scores</h3>
                <div className="space-y-4">
                  <ProgressBar value={activeArea.stats.quality} color="bg-emerald-500" label="Completeness" />
                  <ProgressBar value={94} color="bg-blue-500" label="Geo Accuracy" />
                  <ProgressBar value={88} color="bg-violet-500" label="Temporal" />
                  <ProgressBar value={96} color="bg-amber-500" label="Attributes" />
                </div>
              </div>
            </div>

            {/* Active Layers */}
            <div className="rounded-3xl bg-[var(--accent-strong)] p-6 text-white shadow-xl shadow-[color:rgba(23,78,166,0.15)]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Active Layers</p>
                <Layers className="h-4 w-4 text-white/40" />
              </div>
              <div className="flex flex-wrap gap-2">
                {publishedLayers.map((layer) => (
                  <span key={layer} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                    {layer}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-white/70 italic border-l-2 border-white/20 pl-3">{activeArea.note}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-white/50">
                <Clock className="h-3 w-3" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm flex-1">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Activity</p>
                  <h3 className="mt-1 text-sm font-bold text-[var(--foreground)]">Recent Actions</h3>
                </div>
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent-strong)]">
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--foreground)] truncate">
                        {item.user} <span className="font-normal text-slate-500">{item.action}</span>{" "}
                        <span className="text-[var(--accent-strong)]">{item.target}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            

            {/* Advanced Analytics CTA */}
            <div className="rounded-3xl border-2 border-dashed border-[var(--line)] p-6 flex flex-col items-center justify-center text-center bg-white">
              <div className="h-12 w-12 rounded-full bg-[var(--surface-strong)] flex items-center justify-center mb-3">
                <LineChart className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <p className="text-sm font-bold text-slate-700">Advanced Analytics</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px]">ML-driven change detection and predictive modeling for land-use patterns.</p>
              <button className="mt-4 rounded-full bg-[var(--accent-strong)] px-6 py-2.5 text-xs font-bold text-white hover:bg-[var(--accent)] transition-colors shadow-lg shadow-[color:rgba(23,78,166,0.2)]">
                Run Analysis
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">Export Report</h3>
              <button onClick={() => setShowExportModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              {["PDF Report", "GeoJSON Export", "CSV Data", "Shapefile Package"].map((format) => (
                <button key={format} className="flex w-full items-center gap-3 rounded-xl border border-[var(--line)] p-4 text-left hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all group">
                  <Download className="h-5 w-5 text-slate-400 group-hover:text-[var(--accent-strong)]" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-[var(--accent-strong)]">{format}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowExportModal(false)} className="mt-5 w-full rounded-xl bg-[var(--accent-strong)] py-3 text-sm font-bold text-white hover:bg-[var(--accent)] transition-colors">
              Confirm Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
}