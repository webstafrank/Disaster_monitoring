"use client";

import { Satellite, Clock, Globe2, Layers, Activity } from "lucide-react";

const satellites = [
  {
    name: "Sentinel-2A/2B", agency: "ESA", altitude: "786 km",
    revisit: "5 days", resolution: "10m", bands: 13,
    products: ["NDVI", "Land Cover", "Vegetation Indices"],
  },
  {
    name: "MODIS (Terra/Aqua)", agency: "NASA", altitude: "705 km",
    revisit: "1–2 days", resolution: "250m–1km", bands: 36,
    products: ["VCI", "Fire Detection", "Surface Temperature"],
  },
  {
    name: "Landsat 9", agency: "NASA/USGS", altitude: "705 km",
    revisit: "16 days", resolution: "30m", bands: 11,
    products: ["Land Use Change", "Water Bodies", "Thermal Band"],
  },
  {
    name: "CHIRPS (Rainfall)", agency: "UCSB / USGS", altitude: "—",
    revisit: "Daily", resolution: "5km", bands: 1,
    products: ["Rainfall Estimates", "Drought Monitoring", "SPI"],
  },
];

export default function SatellitesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--sky-blue)] mb-3">Earth Observation</p>
        <h2 className="text-4xl font-bold tracking-tight">EO Satellite Fleet</h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
          Active satellite missions providing Earth Observation data to the Rangeland Intelligence Hub.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {satellites.map((sat) => (
          <div key={sat.name} className="rounded-[2.5rem] border border-[var(--line)] bg-white p-8 hover-lift shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[100px] bg-[var(--sky-blue-soft)] opacity-40 pointer-events-none group-hover:opacity-70 transition-opacity" />
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--sky-blue-soft)] text-[var(--sky-blue)]">
                  <Satellite className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{sat.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sat.agency}</p>
                </div>
              </div>
              <span className="chip-normal px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Clock, label: "Revisit", val: sat.revisit },
                { icon: Layers, label: "Resolution", val: sat.resolution },
                { icon: Globe2, label: "Altitude", val: sat.altitude },
                { icon: Activity, label: "Bands", val: sat.bands },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="rounded-xl bg-[var(--surface-strong)] p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Icon className="h-3 w-3" /> {label}
                  </p>
                  <p className="text-sm font-bold">{val}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {sat.products.map((p) => (
                <span key={p} className="bg-[var(--accent-soft)] text-[var(--accent-strong)] px-2.5 py-1 rounded-lg text-[11px] font-bold">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
