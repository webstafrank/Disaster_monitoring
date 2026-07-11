"use client";

import { AlertTriangle } from "lucide-react";

export function AlertBanner() {
  return (
    <div className="relative overflow-hidden bg-[var(--terracotta)] text-white flex items-center h-10 px-4 rounded-[1rem] shadow-sm mb-6 shrink-0 border border-red-900/20">
      <div className="absolute left-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--terracotta)] to-transparent" />
      <div className="absolute right-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--terracotta)] to-transparent" />

      <div className="flex items-center gap-2 z-20 shrink-0 bg-[var(--terracotta)] pr-4 font-bold text-xs uppercase tracking-wider">
        <div className="h-2 w-2 rounded-full bg-white alert-pulse" />
        Live Alerts
      </div>

      <div className="flex-1 overflow-hidden">
        <span className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 opacity-80" />
          API error
        </span>
      </div>
    </div>
  );
}
