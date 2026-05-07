"use client";

import { CheckCircle2, Circle, Users, Map, Sprout, BarChart3 } from "lucide-react";

const phases = [
  {
    id: 0,
    title: "Stakeholder Alignment",
    status: "complete",
    icon: Users,
    desc: "Regional design sprints & SOPs.",
  },
  {
    id: 1,
    title: "Hazard Mapping",
    status: "active",
    icon: Map,
    desc: "Early warning & disaster impact.",
  },
  {
    id: 2,
    title: "Rangeland Restoration",
    status: "active",
    icon: Sprout,
    desc: "Tracking vegetation & soil health.",
  },
  {
    id: 3,
    title: "Yield Monitoring",
    status: "planned",
    icon: BarChart3,
    desc: "Biomass estimation & carrying capacity.",
  },
];

export function PhaseTracker() {
  return (
    <div className="rounded-[2.5rem] bg-white p-8 border border-[var(--line)] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Project Implementation Phases</h3>
          <p className="mt-1 text-sm text-slate-500">Tracking progress across the 4-stage execution roadmap.</p>
        </div>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-8 left-0 w-full h-[2px] bg-[var(--line)] hidden md:block" />
        
        <div className="grid gap-6 md:grid-cols-4 relative z-10">
          {phases.map((phase) => (
            <div key={phase.id} className="relative flex flex-row md:flex-col items-start gap-4">
              
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all
                ${phase.status === 'complete' ? 'bg-[var(--earth-green)] text-white' : 
                  phase.status === 'active' ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent-soft)]' : 
                  'bg-[var(--surface-muted)] text-slate-400 border border-[var(--line)]'}
              `}>
                <phase.icon className="h-7 w-7" />
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phase {phase.id}</p>
                  {phase.status === 'complete' && <CheckCircle2 className="h-3 w-3 text-[var(--earth-green)]" />}
                  {phase.status === 'active' && <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />}
                  {phase.status === 'planned' && <Circle className="h-3 w-3 text-slate-300" />}
                </div>
                <h4 className={`font-bold tracking-tight ${phase.status === 'planned' ? 'text-slate-400' : 'text-[var(--foreground)]'}`}>
                  {phase.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[200px]">
                  {phase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
