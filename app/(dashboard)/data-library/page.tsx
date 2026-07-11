"use client";

import { Search } from "lucide-react";

import { ApiErrorNotice } from "../_components/api-error-notice";

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

      <ApiErrorNotice context="Dataset catalog is not connected to the repository API yet." />
    </div>
  );
}
