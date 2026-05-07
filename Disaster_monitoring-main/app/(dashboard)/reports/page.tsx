"use client";

import { useMemo, useState } from "react";
import { Download, Share2, Filter } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

type AreaReport = {
  id: string;
  label: string;
  summary: string;
  landUse: number[];
  vegetation: number[];
  drought: number[];
  kpi: { ndviAvg: number, severityIdx: number, recoveryRate: number };
};

const areaReports: AreaReport[] = [
  {
    id: "turkana", label: "Turkana",
    summary: "Dryland reporting focused on grazing pressure and moisture deficits.",
    landUse: [30, 34, 39, 43, 46], vegetation: [28, 32, 37, 35, 40], drought: [40, 48, 57, 61, 68],
    kpi: { ndviAvg: 0.38, severityIdx: 7.2, recoveryRate: 2.1 }
  },
  {
    id: "marsabit", label: "Marsabit",
    summary: "Northern rangeland monitoring for livestock carrying capacity.",
    landUse: [32, 35, 38, 41, 44], vegetation: [30, 33, 35, 32, 38], drought: [45, 52, 60, 65, 72],
    kpi: { ndviAvg: 0.35, severityIdx: 7.8, recoveryRate: 1.8 }
  },
  {
    id: "mandera", label: "Mandera",
    summary: "Cross-border pastoral stress and persistent drought conditions.",
    landUse: [25, 28, 32, 35, 38], vegetation: [22, 25, 28, 25, 30], drought: [50, 58, 65, 70, 78],
    kpi: { ndviAvg: 0.30, severityIdx: 8.5, recoveryRate: 1.2 }
  },
  {
    id: "wajir", label: "Wajir",
    summary: "Central ASAL monitoring for water pan depletion and vegetation vigor.",
    landUse: [28, 32, 35, 38, 42], vegetation: [25, 28, 32, 30, 35], drought: [48, 55, 62, 68, 75],
    kpi: { ndviAvg: 0.32, severityIdx: 8.1, recoveryRate: 1.5 }
  },
  {
    id: "garissa", label: "Garissa",
    summary: "Tana River flood plains and adjacent arid rangeland transitions.",
    landUse: [35, 40, 45, 48, 52], vegetation: [38, 42, 48, 45, 50], drought: [35, 42, 50, 55, 62],
    kpi: { ndviAvg: 0.45, severityIdx: 6.5, recoveryRate: 3.2 }
  },
  {
    id: "tana-river", label: "Tana River",
    summary: "Riverine agricultural corridor and flood exposure tracking.",
    landUse: [40, 45, 50, 55, 60], vegetation: [45, 50, 55, 52, 60], drought: [25, 30, 38, 45, 52],
    kpi: { ndviAvg: 0.52, severityIdx: 5.2, recoveryRate: 4.5 }
  },
  {
    id: "isiolo", label: "Isiolo",
    summary: "Central grazing corridors and wildlife conservancy pressure.",
    landUse: [33, 38, 42, 46, 50], vegetation: [35, 40, 45, 42, 48], drought: [38, 45, 52, 58, 65],
    kpi: { ndviAvg: 0.40, severityIdx: 6.8, recoveryRate: 2.8 }
  },
  {
    id: "samburu", label: "Samburu",
    summary: "Highland transition zones and pastoral resource mapping.",
    landUse: [36, 42, 46, 50, 55], vegetation: [40, 45, 52, 48, 55], drought: [32, 38, 45, 52, 58],
    kpi: { ndviAvg: 0.48, severityIdx: 5.8, recoveryRate: 3.5 }
  },
  {
    id: "baringo", label: "Baringo",
    summary: "Lake basin flooding and surrounding rangeland degradation.",
    landUse: [38, 44, 48, 52, 58], vegetation: [42, 48, 55, 50, 58], drought: [30, 35, 42, 48, 55],
    kpi: { ndviAvg: 0.50, severityIdx: 5.5, recoveryRate: 3.8 }
  },
  {
    id: "makueni", label: "Makueni",
    summary: "Agro-pastoral transition and seasonal cropping cycles.",
    landUse: [45, 50, 55, 60, 65], vegetation: [48, 55, 62, 58, 65], drought: [20, 25, 32, 38, 45],
    kpi: { ndviAvg: 0.60, severityIdx: 4.5, recoveryRate: 5.2 }
  },
];

const periods = ["2020", "2021", "2022", "2023", "2024"];

function InsightChart({
  title,
  description,
  values,
  toneClass,
  strokeColor,
  fillGradient,
  chartType,
}: {
  title: string;
  description: string;
  values: number[];
  toneClass: string;
  strokeColor: string;
  fillGradient: string;
  chartType: "area" | "bar" | "pie";
}) {
  const periods = ["2020", "2021", "2022", "2023", "2024"];
  const data = values.map((val, i) => ({ name: periods[i], value: val }));

  return (
    <article className="rounded-[2.5rem] border border-[var(--line)] bg-white p-6 shadow-sm hover-lift relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] bg-gradient-to-bl ${fillGradient} opacity-20 pointer-events-none transition-opacity group-hover:opacity-40`} />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Indicator Analysis
          </p>
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
        <div className={`rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneClass}`}>
          Live
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 relative z-10 min-h-[40px]">{description}</p>

      <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-strong)] p-5 relative z-10 border border-[var(--line)] group-hover:border-[var(--accent)]/20 transition-colors h-[280px] flex flex-col">
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`grad-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke={strokeColor} fillOpacity={1} fill={`url(#grad-${title.replace(/\s+/g, '-')})`} strokeWidth={3} />
              </AreaChart>
            ) : chartType === "bar" ? (
               <BarChart data={data} barSize={32}>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 'dataMax + 10']} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill={strokeColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={strokeColor} fillOpacity={0.4 + (index * 0.15)} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-between text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
          {periods.map((period) => (
            <span key={period}>{period}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ReportsPage() {
  const [selectedArea, setSelectedArea] = useState(areaReports[0]);

  const reportCards = useMemo(
    () => [
      {
        title: "Land Cover Change",
        description: "Agricultural expansion and settlement growth mapped against arid transition zones.",
        values: selectedArea.landUse,
        toneClass: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
        strokeColor: "var(--accent)",
        fillGradient: "from-[var(--accent)] to-transparent",
        chartType: "pie" as const,
      },
      {
        title: "Vegetation Vigor (VCI)",
        description: "Greenness and vegetation condition patterns derived from time-based satellite indicators.",
        values: selectedArea.vegetation,
        toneClass: "bg-[var(--earth-green-soft)] text-[var(--earth-green)]",
        strokeColor: "var(--earth-green)",
        fillGradient: "from-[var(--earth-green)] to-transparent",
        chartType: "area" as const,
      },
      {
        title: "Drought Severity (SPI)",
        description: "Reported drought pressure using annual severity and exposure summaries.",
        values: selectedArea.drought,
        toneClass: "bg-[var(--terracotta-soft)] text-[var(--terracotta)]",
        strokeColor: "var(--terracotta)",
        fillGradient: "from-[var(--terracotta)] to-transparent",
        chartType: "bar" as const,
      },
    ],
    [selectedArea],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--savanna-gold)]/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <Filter className="h-4 w-4 text-[var(--savanna-gold)]" />
             <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--savanna-gold)]">
               ASAL Analytics
             </p>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
            County-Level <span className="text-gradient-earth">Impact Reports</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Generate and export aggregated insight reports for each of the 10 targeted arid and semi-arid counties. Data is derived directly from Earth Observation baselines.
          </p>
        </div>

        <div className="flex gap-3 relative z-10 shrink-0">
           <button className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-bold text-slate-600 hover:bg-white hover:text-[var(--accent)] transition-all">
             <Share2 className="h-4 w-4" /> Share
           </button>
           <button className="flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent)] transition-all hover-lift">
             <Download className="h-4 w-4" /> Export PDF
           </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="rounded-[2rem] bg-white border border-[var(--line)] p-6 flex items-center justify-between shadow-sm">
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mean NDVI (Baseline)</p>
               <p className="text-3xl font-bold text-[var(--earth-green)]">{selectedArea.kpi.ndviAvg}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[var(--earth-green-soft)] flex items-center justify-center text-[var(--earth-green)]">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
         </div>
         <div className="rounded-[2rem] bg-[var(--sidebar-bg)] p-6 flex items-center justify-between shadow-sm text-white">
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--sidebar-muted)] mb-1">Drought Severity Index</p>
               <p className="text-3xl font-bold text-[var(--terracotta)]">{selectedArea.kpi.severityIdx}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-[var(--terracotta)]">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
         </div>
         <div className="rounded-[2rem] bg-gradient-to-br from-[var(--savanna-gold)] to-[var(--earth-green)] p-6 flex items-center justify-between shadow-sm text-white">
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Veg. Recovery Rate</p>
               <p className="text-3xl font-bold">{selectedArea.kpi.recoveryRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
         </div>
      </section>

      {/* County Selector */}
      <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-1">
              Select Jurisdiction
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Focus Area
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 bg-white px-4 py-2 rounded-xl border border-[var(--line)]">
            <span className="font-bold text-[var(--accent-strong)]">{selectedArea.label} Context: </span>
            {selectedArea.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {areaReports.map((area) => {
            const isActive = area.id === selectedArea.id;

            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={[
                  "rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-[var(--accent-strong)] text-white shadow-md transform scale-105"
                    : "border border-[var(--line)] bg-white text-slate-600 hover:border-[var(--accent)] hover:text-[var(--accent)]",
                ].join(" ")}
              >
                {area.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Charts Grid */}
      <section className="grid gap-6 xl:grid-cols-3">
        {reportCards.map((card) => (
          <InsightChart
            key={card.title}
            title={card.title}
            description={card.description}
            values={card.values}
            toneClass={card.toneClass}
            strokeColor={card.strokeColor}
            fillGradient={card.fillGradient}
            chartType={card.chartType}
          />
        ))}
      </section>
    </div>
  );
}
