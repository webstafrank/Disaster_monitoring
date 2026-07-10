"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock } from "lucide-react";

const alerts = [
  {
    id: 1, level: "emergency", county: "Mandera", title: "Severe Drought — Critical Stage",
    detail: "Vegetation cover below 15% baseline. Immediate livestock destocking recommended.",
    time: "2 hours ago", icon: AlertTriangle,
  },
  {
    id: 2, level: "warning", county: "Wajir", title: "Drought Warning — Phase 2",
    detail: "SPI index at -1.8. Water pan levels at 30% capacity. Monitor closely.",
    time: "6 hours ago", icon: AlertTriangle,
  },
  {
    id: 3, level: "warning", county: "Garissa", title: "Drought Warning — Vegetation Stress",
    detail: "NDVI anomaly trending downward for 3 consecutive months.",
    time: "12 hours ago", icon: AlertCircle,
  },
  {
    id: 4, level: "watch", county: "Marsabit", title: "Drought Watch — Northern Zone",
    detail: "Emerging vegetation stress detected. Seasonal rainfall below average.",
    time: "1 day ago", icon: Info,
  },
  {
    id: 5, level: "watch", county: "Turkana", title: "Drought Watch — Pastoralist Alert",
    detail: "Grazing pressure elevated. Cross-border movement patterns shifting.",
    time: "1 day ago", icon: Info,
  },
  {
    id: 6, level: "normal", county: "Makueni", title: "Normal Conditions",
    detail: "All vegetation and rainfall indices within expected range.",
    time: "2 days ago", icon: CheckCircle2,
  },
];

const levelStyles: Record<string, string> = {
  emergency: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-[var(--terracotta-soft)] border-[var(--terracotta)]/30 text-[var(--terracotta)]",
  watch: "bg-[var(--savanna-gold-soft)] border-[var(--savanna-gold)]/30 text-[var(--savanna-gold)]",
  normal: "bg-[var(--earth-green-soft)] border-[var(--earth-green)]/30 text-[var(--earth-green)]",
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--terracotta)] mb-3">
          Real-Time Monitoring
        </p>
        <h2 className="text-4xl font-bold tracking-tight">Alerts &amp; Warnings</h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
          Sample climate alerts derived from satellite indices across all 10 ASAL counties.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Emergency", count: 1, color: "red" },
          { label: "Warning", count: 2, color: "terracotta" },
          { label: "Watch", count: 2, color: "savanna-gold" },
          { label: "Normal", count: 5, color: "earth-green" },
        ].map((s) => (
          <div key={s.label} className="rounded-[2rem] bg-white border border-[var(--line)] p-6 flex items-center gap-4 hover-lift shadow-sm">
            <p className="text-3xl font-bold text-[var(--foreground)]">{s.count}</p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`rounded-[2rem] border p-6 flex items-start gap-5 hover-lift ${levelStyles[alert.level]}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60">
              <alert.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <p className="font-bold">{alert.title}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{alert.county} County</span>
              </div>
              <p className="text-sm leading-relaxed opacity-80">{alert.detail}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] opacity-60 shrink-0">
              <Clock className="h-3 w-3" />
              {alert.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
