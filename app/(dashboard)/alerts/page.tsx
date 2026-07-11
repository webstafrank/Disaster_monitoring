"use client";

import { ApiErrorNotice } from "../_components/api-error-notice";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--terracotta)] mb-3">
          Real-Time Monitoring
        </p>
        <h2 className="text-4xl font-bold tracking-tight">Alerts &amp; Warnings</h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
          Climate alerts derived from satellite indices across all 10 ASAL counties.
        </p>
      </section>

      <ApiErrorNotice context="Alerts feed is not connected to the monitoring API yet." />
    </div>
  );
}
