"use client";

import { Upload } from "lucide-react";

import { ApiErrorNotice } from "../_components/api-error-notice";

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

      <ApiErrorNotice context="Field survey records are not connected to the monitoring API yet." />
    </div>
  );
}
