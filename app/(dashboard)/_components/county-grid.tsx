"use client";

import { ApiErrorNotice } from "./api-error-notice";

export function CountyGrid() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold tracking-tight">ASAL County Monitor</h3>
          <p className="mt-2 text-slate-600">Status overview of the 10 targeted arid and semi-arid counties.</p>
        </div>
      </div>

      <ApiErrorNotice context="Per-county status feed is not connected to the monitoring API yet." />
    </div>
  );
}
