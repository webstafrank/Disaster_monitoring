"use client";

import { Droplets, Users, ShieldAlert, Sprout, Wind, Map, Sun, Database } from "lucide-react";

const topics = [
  {
    title: "Drought & Hydrological Risk",
    description: "Track rainfall anomalies, soil moisture deficits, and surface water depletion using SPI and NDWI indices.",
    icon: Droplets,
    color: "var(--sky-blue)",
    bg: "var(--sky-blue-soft)",
  },
  {
    title: "Vegetation & Biomass Yield",
    description: "Monitor seasonal greenness, vegetation vigor, and estimate forage availability for livestock carrying capacity.",
    icon: Sprout,
    color: "var(--earth-green)",
    bg: "var(--earth-green-soft)",
  },
  {
    title: "Population Exposure",
    description: "Estimate affected settlements, pastoralist movements, and service demand during climate shock events.",
    icon: Users,
    color: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  {
    title: "Infrastructure Resilience",
    description: "Map critical access corridors, water pans, boreholes, and health sites against flood/drought hazard zones.",
    icon: ShieldAlert,
    color: "var(--terracotta)",
    bg: "var(--terracotta-soft)",
  },
  {
    title: "Land Degradation",
    description: "Identify overgrazed areas, invasive shrub species encroachment, and long-term land cover transitions.",
    icon: Map,
    color: "var(--savanna-gold)",
    bg: "var(--savanna-gold-soft)",
  },
  {
    title: "Climate Stress & Heat",
    description: "Observe land surface temperature (LST) anomalies and prolonged heat stress impacts on ecosystems.",
    icon: Sun,
    color: "var(--warning)",
    bg: "var(--warning-soft)",
  },
  {
    title: "Meteorological Patterns",
    description: "Integrate weather station data with satellite forecasts to track changing wind and precipitation cycles.",
    icon: Wind,
    color: "var(--secondary)",
    bg: "var(--secondary-soft)",
  },
  {
    title: "Ground-Truth Calibration",
    description: "Field data collection hubs for validating ML models, annotating imagery, and improving EO accuracy.",
    icon: Database,
    color: "var(--sidebar-bg)",
    bg: "var(--surface-muted)",
  },
];

export default function TopicsUnderStudyPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[var(--surface-strong)] to-transparent pointer-events-none" />
        
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)] mb-4">
          Research Framework
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
          Thematic <span className="text-gradient-blue">Analytical Scopes</span>
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 relative z-10">
          The KSA-WFP intelligence hub categorizes environmental monitoring into discrete research topics. Each topic drives specific geospatial indicators, map layers, and automated alerts for the 10 ASAL counties.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic, index) => (
          <article
            key={topic.title}
            className="rounded-[2rem] border border-[var(--line)] bg-white p-6 hover-lift group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] opacity-20 pointer-events-none transition-transform group-hover:scale-110`} style={{ backgroundColor: topic.bg }} />
            
            <div className="flex flex-col gap-4 relative z-10 h-full">
              <div className="flex items-start justify-between">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110"
                  style={{ backgroundColor: topic.bg, color: topic.color }}
                >
                  <topic.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  0{index + 1}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-2 leading-snug">{topic.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {topic.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2.5rem] bg-[var(--sidebar-bg)] p-8 md:p-12 text-white mt-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
         <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Propose a New Study</h3>
            <p className="text-[var(--sidebar-muted)] max-w-lg">Are you a county official or technical partner? You can request custom geospatial analysis for specific localized issues.</p>
         </div>
         <button className="rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--sidebar-bg)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)] transition-all shrink-0 shadow-lg">
            Submit Request
         </button>
      </section>
    </div>
  );
}
