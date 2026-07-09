"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Layers, LineChart, Target, MapPin, Eye, Info, Sprout } from "lucide-react";

const MapView = dynamic(() => import("./map-view"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center rounded-[2rem] bg-[var(--surface-strong)] animate-pulse md:h-[520px] xl:h-[620px]">
      <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
        <Activity className="h-4 w-4 animate-spin" />
        Loading spatial intelligence...
      </p>
    </div>
  )
});

type Area = {
    id: string;
    label: string;
    years: string[];
    center: [number, number];
    zoom: number;
    note: string;
    layers: string[];
    kpis: { ndvi: number; vci: number; spi: number };
};

const areas: Area[] = [
    {
        id: "turkana",
        label: "Turkana County",
        years: ["2022", "2023", "2024", "2025"],
        center: [3.1, 35.6],
        zoom: 7,
        note: "Focus on dryland pastoral stress and cross-border rangeland shifts.",
        layers: ["Administrative Boundaries", "NDVI Anomaly", "Surface Water Dynamics"],
        kpis: { ndvi: 0.42, vci: 35, spi: -1.2 },
    },
    {
        id: "garissa",
        label: "Garissa County",
        years: ["2022", "2023", "2024", "2025"],
        center: [-0.4, 39.6],
        zoom: 7,
        note: "Monitoring Tana River flood plains and adjacent arid rangelands.",
        layers: ["Flood Extent Maps", "Vegetation Vigor", "Settlement Exposure"],
        kpis: { ndvi: 0.58, vci: 48, spi: 0.5 },
    },
    {
        id: "makueni",
        label: "Makueni County",
        years: ["2022", "2023", "2024", "2025"],
        center: [-2.2, 37.8],
        zoom: 8,
        note: "Agro-pastoral transition zones and seasonal cropping cycles.",
        layers: ["Cropland Mask", "Soil Moisture Index", "Rainfall Deficit"],
        kpis: { ndvi: 0.71, vci: 62, spi: 1.1 },
    },
    {
        id: "marsabit",
        label: "Marsabit County",
        years: ["2022", "2023", "2024", "2025"],
        center: [2.3, 37.9],
        zoom: 7,
        note: "Vast northern arid zones tracking carrying capacity for livestock.",
        layers: ["Biomass Estimation", "Drought Severity", "Water Pans/Boreholes"],
        kpis: { ndvi: 0.38, vci: 28, spi: -1.8 },
    },
];

const layerGroups = [
    { name: "Basemap & Terrain Context", active: true },
    { name: "Vegetation & Biomass Indices", active: true },
    { name: "Hydrological & Drought Layers", active: false },
    { name: "Socio-Economic Exposure", active: false },
];

function MiniSparkline({ data, color }: { data: number[], color: string }) {
    const points = data.map((d, i) => `${i * 20},${50 - d * 40}`).join(" ");
    return (
        <svg viewBox="0 0 100 50" className="w-full h-12 overflow-visible">
            <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="butt" strokeLinejoin="miter" points={points} />
            <rect x="76" y={46 - data[4] * 40} width="8" height="8" fill={color} />
        </svg>
    );
}

export function MapFramePanel() {
    const [activeArea, setActiveArea] = useState(areas[0]);
    const [activeYear, setActiveYear] = useState(areas[0].years.at(-1) ?? "2025");

    return (
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-6 shadow-sm">
                
                {/* Header Controls */}
                <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                           <MapPin className="h-4 w-4 text-[var(--accent)]" />
                           <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Selected Region</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {areas.map((area) => (
                                <button
                                    key={area.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveArea(area);
                                        setActiveYear(area.years.at(-1) ?? "2025");
                                    }}
                                    className={[
                                        "rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300",
                                        area.id === activeArea.id
                                            ? "bg-[var(--accent-strong)] text-white shadow-md"
                                            : "bg-[var(--surface-strong)] text-slate-600 hover:bg-slate-100",
                                    ].join(" ")}
                                >
                                    {area.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                       <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-2">Temporal Filter</p>
                       <div className="flex bg-[var(--surface-strong)] rounded-xl p-1 border border-[var(--line)]">
                           {activeArea.years.map((year) => (
                               <button
                                   key={year}
                                   onClick={() => setActiveYear(year)}
                                   className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                       year === activeYear ? 'bg-white shadow-sm text-[var(--accent-strong)]' : 'text-slate-500 hover:text-slate-700'
                                   }`}
                               >
                                   {year}
                               </button>
                           ))}
                       </div>
                    </div>
                </div>

                {/* KPI Ribbon */}
                <div className="grid grid-cols-3 gap-4 py-4 border-b border-[var(--line)]">
                    <div className="flex items-center gap-3 px-4">
                        <div className="h-10 w-10 rounded-full bg-[var(--earth-green-soft)] flex items-center justify-center text-[var(--earth-green)] shrink-0">
                            <Sprout className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mean NDVI</p>
                            <p className="text-lg font-bold text-[var(--foreground)]">{activeArea.kpis.ndvi}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 border-l border-[var(--line)]">
                        <div className="h-10 w-10 rounded-full bg-[var(--savanna-gold-soft)] flex items-center justify-center text-[var(--savanna-gold)] shrink-0">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">VCI Condition</p>
                            <p className="text-lg font-bold text-[var(--foreground)]">{activeArea.kpis.vci}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 border-l border-[var(--line)]">
                        <div className="h-10 w-10 rounded-full bg-[var(--terracotta-soft)] flex items-center justify-center text-[var(--terracotta)] shrink-0">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SPI Drought</p>
                            <p className="text-lg font-bold text-[var(--foreground)]">{activeArea.kpis.spi}</p>
                        </div>
                    </div>
                </div>

                <div className="relative mt-6 h-[460px] w-full overflow-hidden rounded-[2rem] border border-[var(--line)] shadow-sm md:h-[520px] xl:h-[620px]">
                   <MapView center={activeArea.center} zoom={activeArea.zoom} />
                   
                   {/* Map Overlay Info */}
                   <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-[var(--line)] shadow-xl max-w-[240px]">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-4 w-4 text-[var(--accent)]" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Viewport</p>
                        </div>
                        <p className="text-sm font-bold text-[var(--foreground)]">{activeArea.label} · {activeYear}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                            {activeArea.layers.map(layer => (
                                <span key={layer} className="text-[9px] font-bold uppercase tracking-widest bg-[var(--surface-strong)] px-2 py-1 rounded text-slate-600 border border-[var(--line)]">
                                    {layer}
                                </span>
                            ))}
                        </div>
                   </div>

                   {/* Coordinates Overlay */}
                   <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--line)] shadow-sm flex items-center gap-2">
                       <Target className="h-3 w-3 text-[var(--accent)]" />
                       <span className="text-[10px] font-mono font-bold text-slate-600">{activeArea.center[0].toFixed(4)}°, {activeArea.center[1].toFixed(4)}°</span>
                   </div>
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
                        {layerGroups.map((group) => (
                            <div
                                key={group.name}
                                className={`group flex items-center justify-between rounded-2xl p-4 border transition-all cursor-pointer
                                    ${group.active ? 'bg-[var(--accent-soft)] border-[var(--accent)]/30' : 'bg-[var(--surface-strong)] border-transparent hover:border-[var(--line)]'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors
                                        ${group.active ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-slate-300 bg-white'}
                                    `}>
                                        {group.active && <div className="h-2 w-2 bg-white rounded-sm" />}
                                    </div>
                                    <p className={`text-sm font-bold ${group.active ? 'text-[var(--accent-strong)]' : 'text-slate-600'}`}>
                                        {group.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2.5rem] bg-[var(--sidebar-bg)] p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-6 relative z-10">
                        <Info className="h-5 w-5 text-[var(--sky-blue)]" />
                        <h3 className="text-xl font-bold tracking-tight">Area Context</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--sidebar-muted)] relative z-10">
                        {activeArea.note}
                    </p>
                </div>
                
                <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-[var(--earth-green)]" />
                            <h3 className="text-xl font-bold tracking-tight">Trend Analysis</h3>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">5yr</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-bold text-slate-600">NDVI Anomaly</p>
                                <span className="text-[10px] text-slate-400">Slight decline</span>
                            </div>
                            <MiniSparkline data={[0.8, 0.6, 0.7, 0.4, 0.3]} color="var(--savanna-gold)" />
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-bold text-slate-600">Precipitation Index</p>
                                <span className="text-[10px] text-slate-400">Improving</span>
                            </div>
                            <MiniSparkline data={[0.2, 0.3, 0.2, 0.6, 0.9]} color="var(--sky-blue)" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
