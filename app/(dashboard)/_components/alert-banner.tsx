"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";

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
        <div className="ticker-track flex items-center">
          <span className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 opacity-80" />
            <span className="opacity-80">WARNING:</span> Severe drought conditions extending in Garissa & Wajir. 
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4 opacity-80" />
            <span className="opacity-80">WATCH:</span> Emerging vegetation stress detected in northern Marsabit.
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 opacity-80" />
            <span className="opacity-80">ADVISORY:</span> Anticipatory action recommended for livestock in pastoral zones.
          </span>
          
          {/* Duplicate for seamless scrolling */}
          <span className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 opacity-80" />
            <span className="opacity-80">WARNING:</span> Severe drought conditions extending in Garissa & Wajir. 
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4 opacity-80" />
            <span className="opacity-80">WATCH:</span> Emerging vegetation stress detected in northern Marsabit.
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 opacity-80" />
            <span className="opacity-80">ADVISORY:</span> Anticipatory action recommended for livestock in pastoral zones.
          </span>
        </div>
      </div>
    </div>
  );
}
