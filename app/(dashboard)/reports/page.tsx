import { InsightExplorer } from "../_components/insight-explorer";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--earth-green)]/5 blur-3xl pointer-events-none" />
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--earth-green)] mb-4">
          ASAL Analytics
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
          County <span className="text-gradient-earth">Insight Explorer</span>
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Pick a county and a disaster indicator. The platform pulls the time-series, computes
          severity, trend, and anomaly, and returns a plain-language assessment from the model.
        </p>
      </section>

      <InsightExplorer />
    </div>
  );
}
