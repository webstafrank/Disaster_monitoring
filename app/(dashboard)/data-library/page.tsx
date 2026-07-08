"use client";

import { Search, Download, Calendar, Tag } from "lucide-react";

const datasets = [
  { name: "Kenya NDVI Composite 2024", type: "Raster", resolution: "10m", date: "2024-12", source: "Sentinel-2", size: "2.4 GB", tags: ["Vegetation", "NDVI"] },
  { name: "SPI Drought Index — 2024 Q4", type: "Vector", resolution: "1km", date: "2024-12", source: "CHIRPS", size: "340 MB", tags: ["Drought", "SPI"] },
  { name: "VCI Vegetation Condition Index", type: "Raster", resolution: "250m", date: "2024-11", source: "MODIS", size: "1.1 GB", tags: ["VCI", "Vegetation"] },
  { name: "ASAL County Boundaries", type: "GeoJSON", resolution: "—", date: "2024-01", source: "KSA", size: "14 MB", tags: ["Admin", "Boundaries"] },
  { name: "Surface Water Dynamics 2024", type: "Raster", resolution: "30m", date: "2024-09", source: "Landsat 9", size: "980 MB", tags: ["Hydrology", "Water"] },
  { name: "Land Cover Classification", type: "Raster", resolution: "100m", date: "2024-06", source: "ESA CCI", size: "3.2 GB", tags: ["Land Cover"] },
];

const tagColors: Record<string, string> = {
  Vegetation: "chip-normal", NDVI: "chip-normal",
  Drought: "chip-warning", SPI: "chip-warning",
  VCI: "chip-watch",
  Hydrology: "bg-[var(--sky-blue-soft)] text-[var(--sky-blue)]",
  Water: "bg-[var(--sky-blue-soft)] text-[var(--sky-blue)]",
  Admin: "bg-[var(--secondary-soft)] text-[var(--secondary)]",
  Boundaries: "bg-[var(--secondary-soft)] text-[var(--secondary)]",
  "Land Cover": "bg-[var(--surface-muted)] text-slate-600",
};

export default function DataLibraryPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)] mb-3">Repository</p>
        <h2 className="text-4xl font-bold tracking-tight">Data Library</h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
          Centralized hub of satellite imagery, EO-derived products, and validated datasets powering the Rangeland Intelligence Hub.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search datasets, products, or tags..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[var(--line)] bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
          />
        </div>
        <select className="rounded-2xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[var(--accent)]">
          <option>All Types</option>
          <option>Raster</option>
          <option>Vector</option>
          <option>GeoJSON</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {datasets.map((ds) => (
          <div key={ds.name} className="rounded-[2.5rem] border border-[var(--line)] bg-white p-6 hover-lift shadow-sm group flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-sm leading-snug">{ds.name}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {ds.date} · {ds.source}
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-[var(--surface-strong)] px-2 py-1 rounded-lg text-slate-500 border border-[var(--line)]">
                {ds.type}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Res: <span className="font-bold text-slate-700">{ds.resolution}</span></span>
              <span>Size: <span className="font-bold text-slate-700">{ds.size}</span></span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {ds.tags.map((tag) => (
                <span key={tag} className={`${tagColors[tag] ?? "chip-normal"} px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1`}>
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>

            <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--line)] py-2.5 text-sm font-bold text-slate-600 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
