"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MapPin,
  Download,
  Share2,
  Calendar,
  Activity,
  Droplets,
  Trees,
  Layers,
  ChevronDown,
  Check,
  Info,
  Maximize2,
  PieChart,
} from "lucide-react";

// ─── Kenya Space Agency Color Palette ────────────────────────
// Professional Blue & Black Theme
const KSA_COLORS = {
  primary: "#1E40AF",      // Royal blue
  primaryFade: "rgba(30,64,175,0.08)",
  secondary: "#0F172A",    // Slate black
  accent: "#2563EB",       // Bright blue accent
  light: "#FFFFFF",        // White
  gold: "#64748B",         // Slate accent
  surface: "#EFF6FF",      // Light blue tint
  surfaceStrong: "#DBEAFE", // Stronger blue tint
  line: "#BFDBFE",         // Blue-tinted border
  success: "#1E40AF",        // Blue for positive
  warning: "#64748B",        // Slate for caution
  destructive: "#DC2626",    // Red for critical
  muted: "#64748B",        // Muted slate
  // Faded blue blend
  blueFade: "#EFF6FF",
  blueSoft: "#93C5FD",
  blueMuted: "#3B82F6",
  blueStrong: "#1D4ED8",
  // Blended green-blue
  teal: "#3B82F6",        // Blue
  tealSoft: "#DBEAFE",    // Blue soft
  tealFade: "rgba(59,130,246,0.08)", // Blue fade
} as const;

// ─── Types ───────────────────────────────────────────────────

interface AreaReport {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly region: string;
  readonly population: string;
  readonly areaKm2: number;
  readonly landUse: readonly number[];
  readonly vegetation: readonly number[];
  readonly drought: readonly number[];
  readonly riskLevel: "low" | "moderate" | "high" | "critical";
  readonly landCover: readonly { label: string; value: number; color: string }[];
}

interface ChartConfig {
  readonly title: string;
  readonly description: string;
  readonly key: "landUse" | "vegetation" | "drought";
  readonly color: string;
  readonly colorSoft: string;
  readonly colorStrong: string;
  readonly icon: React.ElementType;
  readonly unit: string;
  readonly benchmark: number;
}

interface KPIData {
  readonly label: string;
  readonly value: string;
  readonly change: number;
  readonly changeLabel: string;
  readonly icon: React.ElementType;
  readonly color: string;
}

// ─── Data ────────────────────────────────────────────────────

const PERIODS = ["2016", "2018", "2020", "2022", "2024"] as const;

const AREA_REPORTS: readonly AreaReport[] = [
  {
    id: "ksa-wide",
    label: "KSA Wide",
    summary: "Countrywide reporting for annual land cover, greenness, and drought pressure comparisons across all administrative regions.",
    region: "All Regions",
    population: "54.0M",
    areaKm2: 580367,
    landUse: [42, 47, 54, 58, 63],
    vegetation: [36, 41, 49, 56, 60],
    drought: [22, 30, 38, 45, 52],
    riskLevel: "moderate",
    landCover: [
      { label: "Agriculture", value: 35, color: "#1E40AF" },
      { label: "Forest", value: 28, color: "#3B82F6" },
      { label: "Grassland", value: 20, color: "#3B82F6" },
      { label: "Urban", value: 12, color: "#2563EB" },
      { label: "Water", value: 5, color: "#1D4ED8" },
    ],
  },
  {
    id: "northern-frontier",
    label: "Northern Frontier",
    summary: "Arid and semi-arid lands monitoring focused on pastoral zones, drought resilience, and vegetation stress in ASAL counties.",
    region: "Mandera, Wajir, Garissa, Marsabit",
    population: "3.2M",
    areaKm2: 126182,
    landUse: [25, 28, 32, 35, 38],
    vegetation: [22, 26, 30, 28, 33],
    drought: [55, 62, 68, 72, 78],
    riskLevel: "critical",
    landCover: [
      { label: "Agriculture", value: 15, color: "#1E40AF" },
      { label: "Forest", value: 8, color: "#3B82F6" },
      { label: "Grassland", value: 45, color: "#3B82F6" },
      { label: "Urban", value: 5, color: "#2563EB" },
      { label: "Water", value: 2, color: "#1D4ED8" },
    ],
  },
  {
    id: "central-highlands",
    label: "Central Highlands",
    summary: "Highland agriculture monitoring tracking tea and coffee zones, forest cover, and rainfall patterns in the Aberdare foothills.",
    region: "Kiambu, Murang'a, Nyeri, Kirinyaga",
    population: "8.5M",
    areaKm2: 15420,
    landUse: [58, 63, 68, 71, 75],
    vegetation: [62, 66, 72, 76, 80],
    drought: [12, 16, 22, 28, 34],
    riskLevel: "low",
    landCover: [
      { label: "Agriculture", value: 55, color: "#1E40AF" },
      { label: "Forest", value: 30, color: "#3B82F6" },
      { label: "Grassland", value: 8, color: "#3B82F6" },
      { label: "Urban", value: 5, color: "#2563EB" },
      { label: "Water", value: 2, color: "#1D4ED8" },
    ],
  },
  {
    id: "rift-valley",
    label: "Rift Valley",
    summary: "Monitor rift system land use transitions, Lake Naivasha basin health, and geothermal zone vegetation recovery.",
    region: "Nakuru, Naivasha, Baringo, Kericho",
    population: "12.1M",
    areaKm2: 45234,
    landUse: [48, 52, 57, 61, 65],
    vegetation: [44, 49, 55, 60, 64],
    drought: [28, 34, 40, 45, 51],
    riskLevel: "moderate",
    landCover: [
      { label: "Agriculture", value: 42, color: "#1E40AF" },
      { label: "Forest", value: 22, color: "#3B82F6" },
      { label: "Grassland", value: 25, color: "#3B82F6" },
      { label: "Urban", value: 8, color: "#2563EB" },
      { label: "Water", value: 3, color: "#1D4ED8" },
    ],
  },
  {
    id: "coastal-zone",
    label: "Coastal Zone",
    summary: "Coastal ecosystem monitoring for mangrove health, coral reef stress, and tourism corridor land use changes.",
    region: "Mombasa, Kilifi, Kwale, Lamu",
    population: "4.3M",
    areaKm2: 18370,
    landUse: [38, 42, 46, 50, 54],
    vegetation: [52, 56, 62, 66, 70],
    drought: [18, 22, 28, 33, 39],
    riskLevel: "low",
    landCover: [
      { label: "Agriculture", value: 30, color: "#1E40AF" },
      { label: "Forest", value: 35, color: "#3B82F6" },
      { label: "Grassland", value: 15, color: "#3B82F6" },
      { label: "Urban", value: 15, color: "#2563EB" },
      { label: "Water", value: 5, color: "#1D4ED8" },
    ],
  },
] as const;

const CHART_CONFIGS: readonly ChartConfig[] = [
  {
    title: "Land Use Change",
    description: "Land cover transitions and built-up expansion index",
    key: "landUse",
    color: KSA_COLORS.primary,
    colorSoft: "#DBEAFE",
    colorStrong: "#1E40AF",
    icon: Layers,
    unit: "Index",
    benchmark: 55,
  },
  {
    title: "Vegetation Health",
    description: "NDVI-derived greenness and biomass indicator",
    key: "vegetation",
    color: "#3B82F6",
    colorSoft: "#DBEAFE",
    colorStrong: "#3B82F6",
    icon: Trees,
    unit: "NDVI × 100",
    benchmark: 50,
  },
  {
    title: "Drought Pressure",
    description: "Composite drought severity and exposure index",
    key: "drought",
    color: KSA_COLORS.blueStrong,
    colorSoft: "#EFF6FF",
    colorStrong: "#1D4ED8",
    icon: Droplets,
    unit: "Severity",
    benchmark: 35,
  },
] as const;

// ─── Utilities ───────────────────────────────────────────────

function getRiskColor(risk: AreaReport["riskLevel"]): string {
  const map: Record<AreaReport["riskLevel"], string> = {
    low: KSA_COLORS.success,
    moderate: KSA_COLORS.teal,
    high: KSA_COLORS.warning,
    critical: KSA_COLORS.destructive,
  };
  return map[risk];
}

function getRiskLabel(risk: AreaReport["riskLevel"]): string {
  const map: Record<AreaReport["riskLevel"], string> = {
    low: "Low Risk",
    moderate: "Moderate",
    high: "High Risk",
    critical: "Critical",
  };
  return map[risk];
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

// ─── Hooks ───────────────────────────────────────────────────

function useIntersectionObserver(ref: React.RefObject<HTMLElement | null>): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
}

// ─── Pie Chart Component ─────────────────────────────────────

const PieChartComponent = memo(function PieChartComponent({
  data,
  size = 220,
}: {
  data: readonly { label: string; value: number; color: string }[];
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;

  let currentAngle = -90;

  const segments = useMemo(() => {
    let angleAcc = -90;
    return data.map((item) => {
      const angle = (item.value / total) * 360;
      const startAngle = angleAcc;
      const endAngle = angleAcc + angle;
      angleAcc += angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return { ...item, path, startAngle, endAngle, angle };
    });
  }, [data, total, radius, center]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F0F0F0"
            strokeWidth="1"
          />

          {segments.map((segment, i) => (
            <g key={segment.label} className="group">
              <path
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2.5"
                className={isInView ? "animate-pie-segment" : "opacity-0"}
                style={{
                  animationDelay: `${i * 120}ms`,
                  transformOrigin: `${center}px ${center}px`,
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
                }}
              />
              {/* Hover brightening overlay */}
              <path
                d={segment.path}
                fill="white"
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-15"
                style={{ pointerEvents: "none" }}
              />
            </g>
          ))}

          {/* Inner white circle for donut effect */}
          <circle
            cx={center}
            cy={center}
            r={radius * 0.52}
            fill="white"
            stroke="#F0F0F0"
            strokeWidth="1"
          />

          {/* Center content */}
          <text
            x={center}
            y={center - 10}
            textAnchor="middle"
            className="text-[10px] font-bold fill-[#9CA3AF] uppercase tracking-[0.15em]"
          >
            Total Cover
          </text>
          <text
            x={center}
            y={center + 18}
            textAnchor="middle"
            className="text-2xl font-bold fill-[#1A1A1A]"
          >
            {total}%
          </text>
        </svg>
      </div>

      {/* Legend - horizontal wrap */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full px-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div
              className="h-3 w-3 rounded-full shrink-0 ring-2 ring-offset-1 ring-transparent transition-all group-hover:ring-offset-2"
              style={{
                backgroundColor: segment.color,
                groupHoverRingColor: segment.color,
              }}
            />
            <span className="text-[12px] text-[#4B5563] font-medium">
              {segment.label}
            </span>
            <span className="text-[12px] font-bold text-[#1A1A1A]">
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Sub-components ────────────────────────────────────────

const RiskBadge = memo(function RiskBadge({
  level,
}: {
  level: AreaReport["riskLevel"];
}) {
  const color = getRiskColor(level);
  const label = getRiskLabel(level);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
          style={{ backgroundColor: color }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
      {label}
    </span>
  );
});

const KPICard = memo(function KPICard({
  data,
  index,
}: {
  data: KPIData;
  index: number;
}) {
  const Icon = data.icon;
  const isPositive = data.change >= 0;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg"
      style={{
        borderColor: KSA_COLORS.line,
        backgroundColor: "white",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.04] transition-transform group-hover:scale-150"
        style={{ backgroundColor: data.color }}
      />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${data.color}12`, color: data.color }}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div
            className={[
              "flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-bold",
              isPositive
                ? "bg-[#DBEAFE] text-[#1E40AF]"
                : "bg-[#FEF2F2] text-[#2563EB]",
            ].join(" ")}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {data.change}%
          </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B]">
          {data.label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-[#1A1A1A]">
          {data.value}
        </p>
        <p className="mt-1 text-[11px] text-[#64748B]">{data.changeLabel}</p>
      </div>
    </div>
  );
});

const AreaSelector = memo(function AreaSelector({
  selected,
  onSelect,
}: {
  selected: AreaReport;
  onSelect: (area: AreaReport) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-all hover:shadow-md"
        style={{ borderColor: KSA_COLORS.line, backgroundColor: "white" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#DBEAFE", color: KSA_COLORS.primary }}
          >
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B]">
              Selected Area
            </p>
            <p className="text-base font-semibold text-[#1A1A1A]">
              {selected.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={selected.riskLevel} />
          <ChevronDown
            className={[
              "h-4 w-4 text-[#64748B] transition-transform duration-200",
              isOpen && "rotate-180",
            ].join(" ")}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border shadow-xl animate-scale-in"
          style={{ borderColor: KSA_COLORS.line, backgroundColor: "white" }}
        >
          {AREA_REPORTS.map((area) => {
            const isSelected = area.id === selected.id;
            return (
              <button
                key={area.id}
                onClick={() => {
                  onSelect(area);
                  setIsOpen(false);
                }}
                className={[
                  "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors",
                  isSelected ? "bg-[#DBEAFE]/50" : "hover:bg-[#F8FAFC]",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    isSelected
                      ? "text-white"
                      : "bg-[#F8FAFC] text-[#64748B]",
                  ].join(" ")}
                  style={isSelected ? { backgroundColor: KSA_COLORS.primary } : {}}
                >
                  {isSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {area.label}
                  </p>
                  <p className="text-[11px] text-[#64748B]">{area.region}</p>
                </div>
                <RiskBadge level={area.riskLevel} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

const AnimatedLineChart = memo(function AnimatedLineChart({
  values,
  color,
  benchmark,
  isComparison,
  comparisonValues,
}: {
  values: readonly number[];
  color: string;
  benchmark: number;
  isComparison?: boolean;
  comparisonValues?: readonly number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref);

  const w = 420;
  const h = 180;
  const pad = { top: 28, right: 20, bottom: 36, left: 48 };
  const usableW = w - pad.left - pad.right;
  const usableH = h - pad.top - pad.bottom;

  const maxVal = 100;

  const getPoint = (v: number, i: number) => ({
    x: pad.left + (i / (values.length - 1)) * usableW,
    y: pad.top + usableH - (v / maxVal) * usableH,
  });

  const points = values.map((v, i) => getPoint(v, i));
  const linePath =
    `M${points[0].x},${points[0].y} ` +
    points.slice(1).map((p) => `L${p.x},${p.y}`).join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${pad.top + usableH} L${points[0].x},${pad.top + usableH} Z`;

  const benchmarkY = pad.top + usableH - (benchmark / maxVal) * usableH;

  // Ensure benchmark label doesn't get cut off
  const benchmarkLabelY = Math.max(benchmarkY - 6, pad.top + 10);

  const gradientId = `grad-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div ref={ref} className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={pad.left}
            y1={pad.top + usableH * (1 - pct)}
            x2={w - pad.right}
            y2={pad.top + usableH * (1 - pct)}
            stroke="rgba(30,64,175,0.06)"
            strokeWidth="1"
            strokeDasharray={pct === 0 ? undefined : "4,4"}
          />
        ))}

        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((val, i) => (
          <text
            key={val}
            x={pad.left - 10}
            y={pad.top + usableH * (1 - i / 4) + 4}
            textAnchor="end"
            className="text-[10px] fill-[#64748B] font-semibold"
          >
            {val}
          </text>
        ))}

        {/* Benchmark line - now with background for readability */}
        <rect
          x={pad.left}
          y={benchmarkY - 10}
          width={w - pad.left - pad.right}
          height={20}
          fill="white"
          opacity="0.7"
        />
        <line
          x1={pad.left}
          y1={benchmarkY}
          x2={w - pad.right}
          y2={benchmarkY}
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="8,4"
          opacity="0.5"
        />
        {/* Benchmark label with background pill */}
        <rect
          x={w - pad.right - 85}
          y={benchmarkLabelY - 8}
          width={80}
          height={18}
          rx={4}
          fill={color}
          opacity="0.1"
        />
        <text
          x={w - pad.right - 8}
          y={benchmarkLabelY + 3}
          textAnchor="end"
          className="text-[9px] font-bold uppercase tracking-wider"
          fill={color}
        >
          Benchmark {benchmark}
        </text>

        {/* Comparison line */}
        {isComparison && comparisonValues && (
          <>
            <path
              d={`M${comparisonValues.map((v, i) => `${getPoint(v, i).x},${getPoint(v, i).y}`).join(" L")}`}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="6,3"
              className={isInView ? "animate-draw-line" : "opacity-0"}
              style={{ strokeDasharray: 1000, strokeDashoffset: isInView ? 0 : 1000 }}
            />
            {comparisonValues.map((v, i) => (
              <circle
                key={`comp-${i}`}
                cx={getPoint(v, i).x}
                cy={getPoint(v, i).y}
                r="3.5"
                fill="white"
                stroke="#94A3B8"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
          className={isInView ? "animate-fade-in" : "opacity-0"}
        />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isInView ? "animate-draw-line" : "opacity-0"}
          style={{ strokeDasharray: 1000, strokeDashoffset: isInView ? 0 : 1000 }}
        />

        {/* Data points with larger hit areas */}
        {points.map((p, i) => (
          <g
            key={i}
            className={isInView ? "animate-pop-in" : "opacity-0"}
            style={{ animationDelay: `${800 + i * 100}ms` }}
          >
            <circle cx={p.x} cy={p.y} r="12" fill={color} opacity="0" className="cursor-pointer" />
            <circle cx={p.x} cy={p.y} r="10" fill={color} opacity="0.08" />
            <circle cx={p.x} cy={p.y} r="5" fill="white" stroke={color} strokeWidth="2.5" />
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              className="text-[10px] font-bold"
              fill={color}
            >
              {values[i]}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {PERIODS.map((p, i) => (
          <text
            key={p}
            x={pad.left + (i / (PERIODS.length - 1)) * usableW}
            y={h - 10}
            textAnchor="middle"
            className="text-[11px] font-bold uppercase tracking-widest fill-[#64748B]"
          >
            {p}
          </text>
        ))}
      </svg>
    </div>
  );
});

const InsightChartCard = memo(function InsightChartCard({
  config,
  values,
  comparisonValues,
  isComparison,
}: {
  config: ChartConfig;
  values: readonly number[];
  comparisonValues?: readonly number[];
  isComparison: boolean;
}) {
  const Icon = config.icon;
  const latestVal = values[values.length - 1];
  const prevVal = values[values.length - 2];
  const change = latestVal - prevVal;
  const changePct = ((change / prevVal) * 100).toFixed(1);
  const isPositive = change >= 0;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl"
      style={{ borderColor: KSA_COLORS.line }}
    >
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${config.color} 0%, ${config.colorSoft} 100%)`,
        }}
      />

      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: config.colorSoft, color: config.colorStrong }}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B]">
                {config.unit}
              </p>
              <h3 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
                {config.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#64748B]">{config.description}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-2xl font-bold tracking-tight"
              style={{ color: config.colorStrong }}
            >
              {latestVal}
            </div>
            <div
              className={[
                "mt-1 flex items-center justify-end gap-0.5 text-[10px] font-bold",
                isPositive ? "text-[#1E40AF]" : "text-[#2563EB]",
              ].join(" ")}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {changePct}%
            </div>
          </div>
        </div>

        <AnimatedLineChart
          values={values}
          color={config.color}
          benchmark={config.benchmark}
          isComparison={isComparison}
          comparisonValues={comparisonValues}
        />

        <div className="mt-4 grid grid-cols-5 gap-1 border-t pt-4" style={{ borderColor: KSA_COLORS.line }}>
          {PERIODS.map((p, i) => (
            <div key={p} className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#64748B]">
                {p}
              </p>
              <p
                className="mt-1 text-xs font-bold animate-fade-in"
                style={{ color: config.colorStrong, animationDelay: `${1000 + i * 50}ms` }}
              >
                {values[i]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
});

const ComparisonToggle = memo(function ComparisonToggle({
  isEnabled,
  onToggle,
}: {
  isEnabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={[
        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
        isEnabled
          ? "text-white shadow-md"
          : "border bg-white text-[#1A1A1A] hover:text-[#1E40AF]",
      ].join(" ")}
      style={
        isEnabled
          ? { backgroundColor: KSA_COLORS.primary, borderColor: KSA_COLORS.primary }
          : { borderColor: KSA_COLORS.line }
      }
    >
      <Activity className="h-4 w-4" />
      {isEnabled ? "Comparing: KSA Wide" : "Compare with KSA Wide"}
    </button>
  );
});

// ─── Main Component ──────────────────────────────────────────

export default function ReportsPage() {
  const [selectedArea, setSelectedArea] = useState<AreaReport>(AREA_REPORTS[0]);
  const [isComparison, setIsComparison] = useState(false);
  const [dateRange] = useState("2016 - 2024");

  const kpiData: readonly KPIData[] = useMemo(
    () => [
      {
        label: "Total Area",
        value: `${formatNumber(selectedArea.areaKm2)} km²`,
        change: 2.4,
        changeLabel: "vs last assessment",
        icon: MapPin,
        color: KSA_COLORS.primary,
      },
      {
        label: "Population",
        value: selectedArea.population,
        change: 5.8,
        changeLabel: "annual growth",
        icon: Activity,
        color: KSA_COLORS.success,
      },
      {
        label: "Avg. Land Use",
        value: `${Math.round(selectedArea.landUse.reduce((a, b) => a + b, 0) / selectedArea.landUse.length)}`,
        change: 8.2,
        changeLabel: "5-year trend",
        icon: Layers,
        color: "#3B82F6",
      },
      {
        label: "Drought Risk",
        value: `${selectedArea.drought[selectedArea.drought.length - 1]}%`,
        change: -3.1,
        changeLabel: "improvement",
        icon: Droplets,
        color: KSA_COLORS.blueStrong,
      },
    ],
    [selectedArea]
  );

  const comparisonArea = useMemo(
    () => AREA_REPORTS.find((a) => a.id === "ksa-wide")!,
    []
  );

  const handleAreaSelect = useCallback((area: AreaReport) => {
    setSelectedArea(area);
  }, []);

  const toggleComparison = useCallback(() => {
    setIsComparison((prev) => !prev);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section
        className="relative overflow-hidden rounded-[2rem] border p-8 lg:p-10"
        style={{
          borderColor: KSA_COLORS.line,
          background: `linear-gradient(135deg, ${KSA_COLORS.surfaceStrong} 0%, ${KSA_COLORS.blueFade} 100%)`,
        }}
      >
        <div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.04]"
          style={{ backgroundColor: KSA_COLORS.primary }}
        />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full opacity-[0.03]"
          style={{ backgroundColor: KSA_COLORS.blueStrong }}
        />
        <div className="relative">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: "#DBEAFE", color: KSA_COLORS.primary }}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              Analytics Dashboard
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] lg:text-4xl">
            Insight Reports &{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${KSA_COLORS.primary} 0%, ${KSA_COLORS.teal} 50%, ${KSA_COLORS.blueStrong} 100%)`,
              }}
            >
              Spatial Analytics
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B]">
            Comprehensive reporting across land use, vegetation health, and drought
            indicators. Compare regions, track trends, and export findings.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, i) => (
          <KPICard key={kpi.label} data={kpi} index={i} />
        ))}
      </section>

      {/* Controls */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AreaSelector selected={selectedArea} onSelect={handleAreaSelect} />
        <div className="flex flex-wrap items-center gap-2">
          <ComparisonToggle isEnabled={isComparison} onToggle={toggleComparison} />
          <button
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:text-[#1E40AF]"
            style={{ borderColor: KSA_COLORS.line, backgroundColor: "white" }}
          >
            <Calendar className="h-4 w-4" />
            {dateRange}
          </button>
          <button
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:text-[#1E40AF]"
            style={{ borderColor: KSA_COLORS.line, backgroundColor: "white" }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border text-[#1A1A1A] transition-all hover:text-[#1E40AF]"
            style={{ borderColor: KSA_COLORS.line, backgroundColor: "white" }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Summary + Pie Chart Row */}
      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Summary Card */}
        <div
          className="rounded-2xl border bg-white p-6"
          style={{ borderColor: KSA_COLORS.line }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, #DBEAFE 0%, ${KSA_COLORS.blueFade} 100%)`,
                  color: KSA_COLORS.primary
                }}
              >
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">{selectedArea.label}</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#64748B]">
                  {selectedArea.summary}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <MapPin className="h-3 w-3" />
                    {selectedArea.region}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#BFDBFE]" />
                  <span className="text-xs text-[#64748B]">
                    {formatNumber(selectedArea.areaKm2)} km²
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#BFDBFE]" />
                  <RiskBadge level={selectedArea.riskLevel} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="rounded-xl px-4 py-3 text-center"
                style={{ backgroundColor: KSA_COLORS.surfaceStrong }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                  Data Points
                </p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                  {PERIODS.length * 3}
                </p>
              </div>
              <div
                className="rounded-xl px-4 py-3 text-center"
                style={{ backgroundColor: KSA_COLORS.surfaceStrong }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                  Time Span
                </p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">8 Years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart Card - NOW VISIBLE */}
        <div
          className="rounded-2xl border bg-white p-6 flex flex-col"
          style={{ borderColor: KSA_COLORS.line }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, #DBEAFE 0%, ${KSA_COLORS.blueFade} 100%)`,
                color: KSA_COLORS.primary
              }}
            >
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B]">
                Land Cover Distribution
              </p>
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                {selectedArea.label} — Composition
              </h3>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center py-2">
            <PieChartComponent data={selectedArea.landCover} size={240} />
          </div>
        </div>
      </section>

      {/* Charts Grid */}
      <section className="grid gap-6 xl:grid-cols-3">
        {CHART_CONFIGS.map((config) => {
          const values = selectedArea[config.key];
          const comparisonValues = isComparison ? comparisonArea[config.key] : undefined;
          return (
            <InsightChartCard
              key={config.key}
              config={config}
              values={values}
              comparisonValues={comparisonValues}
              isComparison={isComparison}
            />
          );
        })}
      </section>

      {/* Bottom Insight */}
      <section
        className="rounded-2xl border-2 bg-white p-6"
        style={{
          borderColor: KSA_COLORS.tealSoft,
          background: `linear-gradient(135deg, white 0%, ${KSA_COLORS.tealFade} 100%)`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, #DBEAFE 0%, ${KSA_COLORS.blueFade} 100%)`,
              color: KSA_COLORS.primary
            }}
          >
            <Maximize2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1A1A1A]">
              Cross-Indicator Analysis
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
              {selectedArea.label} shows a{" "}
              <span className="font-semibold" style={{ color: KSA_COLORS.primary }}>
                {selectedArea.landUse[4] > selectedArea.landUse[0] ? "positive" : "negative"}
              </span>{" "}
              land use trajectory with{" "}
              <span className="font-semibold" style={{ color: KSA_COLORS.teal }}>
                {selectedArea.vegetation[4] > 50 ? "healthy" : "declining"}
              </span>{" "}
              vegetation cover. Drought pressure is{" "}
              <span
                className="font-semibold"
                style={{
                  color: selectedArea.drought[4] > 50 ? KSA_COLORS.destructive : KSA_COLORS.blueStrong,
                }}
              >
                {selectedArea.drought[4] > 50 ? "critical" : "manageable"}
              </span>{" "}
              compared to the national baseline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}