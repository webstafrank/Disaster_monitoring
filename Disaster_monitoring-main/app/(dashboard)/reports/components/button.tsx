"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Radar, ArrowUpRight } from "lucide-react";

export function MagneticButton({ href, children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    });
  };

  return (
    <Link href={href} className="inline-block">
      <div
        ref={ref}
        className="transition-transform duration-200 ease-out"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      >
        <div className="group relative h-[52px] px-8 bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex items-center gap-3 border border-slate-700/50 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
            <Radar className="relative h-5 w-5 text-blue-400 group-hover:text-blue-300" />
          </div>
          
          <span className="relative font-semibold text-sm tracking-wide group-hover:tracking-wider transition-all">
            {children}
          </span>
          
          <ArrowUpRight className="relative h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}