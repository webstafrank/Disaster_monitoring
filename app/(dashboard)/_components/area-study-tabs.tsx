"use client";

import { useState } from "react";
import { Info, BarChart, Layers as LayersIcon, Map as MapIcon, ChevronRight } from "lucide-react";

type StudyTab = {
  id: string;
  label: string;
  summary: string;
  layers: string[];
  chartTitle: string;
  chartSeries: number[];
  insight: string;
};

const studyTabs: StudyTab[] = [
  {
    id: "land-use",
    label: "Land use",
    summary:
      "Track built-up expansion, cropland shifts, settlement pressure, and land cover transitions within the study area.",
    layers: [
      "Land cover classification",
      "Built-up footprint change",
      "Agricultural zones",
      "Administrative boundaries",
    ],
    chartTitle: "Land cover share",
    chartSeries: [68, 44, 36, 22],
    insight:
      "GeoServer can publish land cover mosaics and change polygons into this view for time-based comparison.",
  },
  {
    id: "vegetation-monitoring",
    label: "Vegetation monitoring",
    summary:
      "Observe vegetation vigor, seasonal greenness, and recovery patterns from satellite-derived raster products.",
    layers: [
      "NDVI composite",
      "Vegetation anomaly",
      "Water bodies",
      "Observation stations",
    ],
    chartTitle: "Greenness trend",
    chartSeries: [32, 48, 61, 57],
    insight:
      "This panel is ready for charts derived from NDVI and anomaly layers served through GeoServer and summarized by area.",
  },
  {
    id: "drought-indicators",
    label: "Drought indicators",
    summary:
      "Review rainfall deficits, moisture stress, and exposure conditions to flag areas under persistent drought pressure.",
    layers: [
      "SPI severity classes",
      "Soil moisture anomaly",
      "Rainfall deficit grid",
      "Population exposure",
    ],
    chartTitle: "Drought severity index",
    chartSeries: [18, 30, 54, 71],
    insight:
      "Use this tab for drought composites, threshold alerts, and district summaries generated from GeoServer layers.",
  },
];

export function AreaStudyTabs() {
  const [activeTab, setActiveTab] = useState(studyTabs[0]);

  return (
    <section className="rounded-[2.5rem] border border-[var(--line)] bg-white shadow-sm p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-strong)] mb-4">
            <LayersIcon className="h-3 w-3" />
            Area of Study
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Thematic Map Layers & <span className="text-[var(--secondary)]">GeoServer Data</span>
          </h3>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Each thematic study provides specialized map layers and derived analysis charts to 
            support decision making within specific disaster contexts.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {studyTabs.map((tab) => {
          const isActive = tab.id === activeTab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "rounded-full px-6 py-3 text-sm font-bold transition-all duration-300",
                isActive
                  ? "bg-[var(--accent-strong)] text-white shadow-lg shadow-[color:rgba(23,78,166,0.1)]"
                  : "bg-[var(--surface-strong)] text-slate-500 hover:bg-white hover:text-[var(--accent)] border border-transparent hover:border-[var(--line)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-[var(--surface-strong)] p-6 border border-[var(--line)]">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-[var(--accent-strong)] flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {activeTab.label} Summary
              </h4>
              <div className="rounded-full bg-[var(--success-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--success)] border border-[var(--success)]/20">
                Ready
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 italic">
              &ldquo;{activeTab.summary}&rdquo;
            </p>
          </div>

          <div className="map-grid contour-lines relative min-h-[400px] overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(180deg,var(--secondary-soft)_0%,var(--accent-soft)_100%)]">
            <div className="absolute inset-x-6 top-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50">
                <MapIcon className="h-3 w-3" />
                Spatial Projection
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50">
                Interactive Preview
              </div>
            </div>
            
            {/* Visual placeholders for map elements */}
            <div className="absolute left-[15%] top-[30%] h-32 w-32 rounded-full border-2 border-dashed border-[var(--warning)] bg-[color:var(--warning-soft)]/30 animate-pulse" />
            <div className="absolute left-[45%] top-[20%] h-40 w-40 rounded-full border-2 border-dashed border-[var(--accent)] bg-[color:var(--accent-soft)]/30" />
            <div className="absolute right-[15%] top-[45%] h-28 w-28 rounded-full border-2 border-dashed border-[var(--secondary-strong)] bg-[color:var(--secondary-soft)]/30" />

            <div className="absolute inset-x-6 bottom-6 grid gap-4 lg:grid-cols-[1fr_200px]">
              <div className="rounded-2xl bg-white/90 p-5 backdrop-blur shadow-sm border border-white/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Available Layers
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeTab.layers.map((layer) => (
                    <span
                      key={layer}
                      className="rounded-lg bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-medium text-slate-700 border border-[var(--line)]"
                    >
                      {layer}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--accent-strong)] p-5 text-white shadow-xl shadow-[color:rgba(23,78,166,0.2)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">
                  Note
                </p>
                <p className="text-xs leading-relaxed font-medium">
                  Full exploration available in the workspace.
                </p>
                <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ml-auto">
                   <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 rounded-[2rem] bg-[var(--secondary-strong)] p-8 text-white">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Derived Insights
              </p>
              <BarChart className="h-4 w-4 text-[var(--secondary-soft)]" />
            </div>
            <h4 className="text-xl font-bold tracking-tight">
              {activeTab.chartTitle}
            </h4>
            <div className="mt-10 flex h-48 items-end gap-3">
              {activeTab.chartSeries.map((value, index) => (
                <div key={`${activeTab.id}-${value}-${index}`} className="flex-1 group">
                  <div
                    className="rounded-t-xl bg-white/20 group-hover:bg-white/40 transition-all duration-500"
                    style={{ height: `${value}%` }}
                  />
                  <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Q{index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border-2 border-[var(--accent-soft)] bg-white p-8">
            <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
              <Info className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-widest">Analysis Note</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 font-medium">
              {activeTab.insight}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
