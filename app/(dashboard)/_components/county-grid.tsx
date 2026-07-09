"use client";

import { Activity, Droplets, MapPin } from "lucide-react";

type CountyInfo = {
  name: string;
  severity: "normal" | "watch" | "warning" | "emergency";
  popAffected: string;
  trend: number[]; // NDVI dummy trend
};

const counties: CountyInfo[] = [
  { name: "Turkana", severity: "watch", popAffected: "210k", trend: [60, 55, 45, 42, 38] },
  { name: "Marsabit", severity: "watch", popAffected: "185k", trend: [58, 52, 48, 45, 40] },
  { name: "Mandera", severity: "warning", popAffected: "320k", trend: [45, 38, 30, 25, 22] },
  { name: "Wajir", severity: "warning", popAffected: "280k", trend: [48, 40, 32, 28, 25] },
  { name: "Garissa", severity: "warning", popAffected: "250k", trend: [50, 42, 35, 30, 28] },
  { name: "Tana River", severity: "normal", popAffected: "45k", trend: [55, 60, 65, 62, 68] },
  { name: "Isiolo", severity: "watch", popAffected: "110k", trend: [55, 50, 45, 48, 42] },
  { name: "Samburu", severity: "normal", popAffected: "85k", trend: [62, 65, 60, 68, 70] },
  { name: "Baringo", severity: "normal", popAffected: "95k", trend: [65, 62, 68, 70, 75] },
  { name: "Makueni", severity: "normal", popAffected: "60k", trend: [70, 75, 72, 78, 80] },
];

function TrendSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`)
    .join(" ");

  return (
    <svg viewBox="0 -10 100 120" className="h-8 w-16 overflow-visible" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        points={points}
      />
    </svg>
  );
}

export function CountyGrid() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold tracking-tight">ASAL County Monitor</h3>
          <p className="mt-2 text-slate-600">Real-time status overview of the 10 targeted arid and semi-arid counties.</p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[var(--earth-green)]" /> Normal</span>
          <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[var(--savanna-gold)]" /> Watch</span>
          <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[var(--terracotta)]" /> Warning</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {counties.map((county) => {
          const isWarning = county.severity === "warning";
          const isWatch = county.severity === "watch";
          
          let colorClass = "text-[var(--earth-green)]";
          let strokeColor = "var(--earth-green)";
          if (isWarning) { colorClass = "text-[var(--terracotta)]"; strokeColor = "var(--terracotta)"; }
          else if (isWatch) { colorClass = "text-[var(--savanna-gold)]"; strokeColor = "var(--savanna-gold)"; }

          return (
            <div key={county.name} className="stat-card hover-lift relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">County</span>
                  </div>
                  <h4 className="text-lg font-bold">{county.name}</h4>
                </div>
                <div className={`chip-${county.severity} px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider`}>
                  {county.severity}
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Droplets className="h-3 w-3" /> NDVI Trend
                  </p>
                  <TrendSparkline data={county.trend} color={strokeColor} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                    <Activity className="h-3 w-3" /> Impact
                  </p>
                  <p className={`text-xl font-bold ${colorClass}`}>{county.popAffected}</p>
                </div>
              </div>

              {/* Decorative background glow based on severity */}
              <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-20 pointer-events-none ${isWarning ? 'bg-[var(--terracotta)]' : isWatch ? 'bg-[var(--savanna-gold)]' : 'bg-[var(--earth-green)]'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
