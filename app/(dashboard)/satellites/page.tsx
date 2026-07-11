"use client";

import { ApiErrorNotice } from "../_components/api-error-notice";

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

      <ApiErrorNotice context="Satellite fleet status is not connected to the monitoring API yet." />
    </div>
  );
}
