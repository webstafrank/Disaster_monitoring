"use client";

import { MapPin, Calendar, Database, Upload, CheckCircle2, Clock } from "lucide-react";

const fieldSurveys = [
  { county: "Turkana", date: "2025-04-28", team: "Field Team A", status: "Validated", samples: 42, type: "Biomass Survey" },
  { county: "Marsabit", date: "2025-04-20", team: "Field Team B", status: "Processing", samples: 38, type: "Vegetation Plot" },
  { county: "Garissa", date: "2025-04-15", team: "Field Team C", status: "Validated", samples: 55, type: "Soil Health" },
  { county: "Wajir", date: "2025-04-10", team: "Field Team A", status: "Pending Review", samples: 30, type: "Biomass Survey" },
  { county: "Mandera", date: "2025-03-30", team: "Field Team D", status: "Validated", samples: 60, type: "Species Composition" },
];

const statusStyles: Record<string, string> = {
  "Validated": "chip-normal",
  "Processing": "chip-watch",
  "Pending Review": "chip-warning",
};

export default function FieldDataPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--earth-green)] mb-3">Ground Truth</p>
          <h2 className="text-4xl font-bold tracking-tight">Field Data Collection</h2>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            In-situ surveys that validate satellite-derived observations across the ASAL counties.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[var(--earth-green)] px-6 py-3 text-sm font-bold text-white hover-lift shrink-0">
          <Upload className="h-4 w-4" /> Upload Dataset
        </button>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white border border-[var(--line)] p-6 hover-lift shadow-sm">
          <p className="text-3xl font-bold text-[var(--earth-green)]">225</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Total Samples</p>
        </div>
        <div className="rounded-[2rem] bg-white border border-[var(--line)] p-6 hover-lift shadow-sm">
          <p className="text-3xl font-bold text-[var(--accent)]">5</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Active Surveys</p>
        </div>
        <div className="rounded-[2rem] bg-white border border-[var(--line)] p-6 hover-lift shadow-sm">
          <p className="text-3xl font-bold text-[var(--savanna-gold)]">3</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Validated Sets</p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-[var(--line)] bg-white p-8 shadow-sm overflow-x-auto">
        <h3 className="text-xl font-bold mb-6">Recent Field Surveys</h3>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--line)]">
              {["County", "Survey Type", "Team", "Date", "Samples", "Status"].map(h => (
                <th key={h} className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fieldSurveys.map((survey, i) => (
              <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--surface-strong)] transition-colors">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span className="font-bold text-sm">{survey.county}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-sm text-slate-600">{survey.type}</td>
                <td className="py-4 pr-4 text-sm text-slate-600">{survey.team}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {survey.date}
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    {survey.samples}
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <span className={`${statusStyles[survey.status]} px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider`}>
                    {survey.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
