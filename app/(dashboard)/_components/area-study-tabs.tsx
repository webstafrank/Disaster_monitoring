"use client";

import { Layers as LayersIcon } from "lucide-react";

import { ApiErrorNotice } from "./api-error-notice";

export function AreaStudyTabs() {
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

      <div className="mt-10">
        <ApiErrorNotice context="Thematic study layers are not connected to the GeoServer API yet." />
      </div>
    </section>
  );
}
