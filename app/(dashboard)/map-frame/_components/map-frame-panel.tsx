"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { LineChart } from "lucide-react";

const MapView = dynamic(() => import("./map-view"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center rounded-[2rem] bg-slate-100 animate-pulse md:h-[520px] xl:h-[620px]">
      <p className="text-sm font-medium text-slate-400">Loading spatial intelligence...</p>
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
};

const areas: Area[] = [
    {
        id: "Study Area",
        label: "Study Area",
        years: ["2020", "2021", "2022", "2023", "2024", "2025"],
        center: [0.0236, 37.9062],
        zoom: 6,
        note: "National comparison for GeoServer-published yearly layers.",
        layers: [
            "Country boundary",
            "Annual coverage mosaic",
            "Regional labels",
        ],
    },
    {
        id: "northern-rangelands",
        label: "Northern rangelands",
        years: ["2020", "2021", "2022", "2023", "2024", "2025"],
        center: [2.3, 37.5],
        zoom: 7,
        note: "Dryland and rangeland views for vegetation and drought comparison.",
        layers: [
            "Rangeland extent",
            "Seasonal vegetation layer",
            "Drought severity",
        ],
    },
    {
        id: "eastern-agricultural-corridor",
        label: "Eastern agricultural corridor",
        years: ["2020", "2021", "2022", "2023", "2024", "2025"],
        center: [-0.5, 38.5],
        zoom: 8,
        note: "Agricultural footprint and land-use change over published years.",
        layers: ["Cropland blocks", "Irrigation footprint", "Land-use change"],
    },
    {
        id: "southwestern-highlands",
        label: "Southwestern highlands",
        years: ["2020", "2021", "2022", "2023", "2024", "2025"],
        center: [-1.0, 35.5],
        zoom: 8,
        note: "Mountainous terrain view for vegetation recovery and slope-sensitive change.",
        layers: ["Terrain context", "Vegetation vigor", "Watershed boundaries"],
    },
];

const layerGroups = [
    "Basemap and terrain context",
    "Published yearly layer stack",
    "Area boundaries and labels",
    "Charts and derived indicators",
];

export function MapFramePanel() {
    const [activeArea, setActiveArea] = useState(areas[0]);
    const [activeYear, setActiveYear] = useState(
        areas[0].years.at(-1) ?? "2025",
    );

    const publishedLayers = useMemo(
        () => activeArea.layers.map((layer) => `${layer} ${activeYear}`),
        [activeArea, activeYear],
    );

    return (
        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
                <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
                            Map section
                        </p>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
                            {activeArea.label}
                        </h3>
                    </div>
                    <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                        {activeArea.center.join(", ")}
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {areas.map((area) => {
                        const isActive = area.id === activeArea.id;

                        return (
                            <button
                                key={area.id}
                                type="button"
                                onClick={() => {
                                    setActiveArea(area);
                                    setActiveYear(area.years.at(-1) ?? "2025");
                                }}
                                className={[
                                    "rounded-full px-5 py-3 text-sm font-bold transition-all duration-300",
                                    isActive
                                        ? "bg-[var(--accent-strong)] text-white shadow-lg"
                                        : "border border-[var(--line)] bg-white text-slate-700 hover:border-[var(--accent)]",
                                ].join(" ")}
                            >
                                {area.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <p className="mr-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Published years
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {activeArea.years.map((year) => {
                            const isActive = year === activeYear;

                            return (
                                <button
                                    key={`${activeArea.id}-${year}`}
                                    type="button"
                                    onClick={() => setActiveYear(year)}
                                    className={[
                                        "rounded-lg px-3 py-2 text-xs font-bold transition-all",
                                        isActive
                                            ? "bg-[var(--secondary)] text-white"
                                            : "bg-white text-slate-600 hover:bg-slate-50 border border-[var(--line)]",
                                    ].join(" ")}
                                >
                                    {year}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="relative mt-6 h-[460px] w-full overflow-hidden rounded-[2rem] border border-[var(--line)] shadow-sm md:h-[520px] xl:h-[620px]">
                   <MapView center={activeArea.center} zoom={activeArea.zoom} />
                   
                   {/* Map Overlay Info */}
                   <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[var(--line)] shadow-lg max-w-[200px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Layer Context</p>
                        <p className="text-xs font-bold mt-1 text-[var(--foreground)]">{activeArea.label}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                            <p className="text-[10px] font-medium text-slate-600">GeoJSON Region Active</p>
                        </div>
                   </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                        Layer Groups
                    </p>
                    <div className="mt-5 space-y-2">
                        {layerGroups.map((group) => (
                            <div
                                key={group}
                                className="group flex items-center justify-between rounded-2xl bg-[var(--surface-strong)] px-4 py-4 border border-transparent hover:border-[var(--line)] transition-all"
                            >
                                <p className="text-sm font-bold text-slate-700">{group}</p>
                                <div className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-[var(--accent)] transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2.5rem] bg-[var(--accent-strong)] p-8 text-white shadow-xl shadow-[color:rgba(23,78,166,0.15)]">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                        Active Layers
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {publishedLayers.map((layer) => (
                            <span
                                key={layer}
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest"
                            >
                                {layer}
                            </span>
                        ))}
                    </div>
                    <p className="mt-6 text-sm leading-relaxed text-white/80 italic border-l-2 border-white/20 pl-4">
                        {activeArea.note}
                    </p>
                </div>
                
                <div className="rounded-[2.5rem] border-2 border-dashed border-[var(--line)] p-8 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-[var(--surface-strong)] flex items-center justify-center mb-4">
                        <LineChart className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Analytics Preview</p>
                    <p className="text-xs text-slate-500 mt-2">Charts will be dynamically generated based on the selected region and year.</p>
                </div>
            </div>
        </section>
    );
}
