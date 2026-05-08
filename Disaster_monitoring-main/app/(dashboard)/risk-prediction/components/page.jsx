"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function NeonButton({ href, children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-500 shadow-blue-500/50",
    red: "bg-red-500 shadow-red-500/50",
    purple: "bg-purple-500 shadow-purple-500/50",
  };

  return (
    <Link href={href} className="inline-block">
      <div className={`group relative inline-flex items-center gap-2 px-8 h-[52px] ${colors[color]} text-white rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95`}>
        <div className={`absolute inset-0 rounded-2xl ${colors[color].split(' ')[0]} blur-xl opacity-40 group-hover:opacity-60`} />
        <div className={`absolute inset-0 rounded-2xl ${colors[color].split(' ')[0]} blur-lg opacity-60 group-hover:opacity-80`} />
        <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-opacity-60" />
        
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[200%] animate-scan" />
        </div>
        
        <Sparkles className="relative h-4 w-4 group-hover:rotate-12 transition-transform" />
        <span className="relative font-bold text-sm tracking-wider uppercase">{children}</span>
        <ArrowRight className="relative h-4 w-4 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}