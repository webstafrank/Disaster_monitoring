"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const outcomes = [
  {
    title: "Early Warning & Preparedness",
    description: "Improved decision-making through timely EO-based alerts for droughts and floods.",
    image: "/231107.jpg",
    points: ["Real-time soil moisture tracking", "Community-level alerts", "Resource allocation optimisation"],
    tag: "01",
  },
  {
    title: "Ecosystem Recovery",
    description: "Strengthened sustainable land management through long-term vegetation trend and soil health monitoring.",
    image: "/88112.jpg",
    points: ["Verified satellite indices", "Historical trend analysis", "Institutional data sharing"],
    tag: "02",
  },
  {
    title: "Resource & Productivity",
    description: "Sustainable livestock management via biomass estimation and seasonal surface water tracking.",
    image: "/iStock-1077574640.avif",
    points: ["Vegetation health mapping", "Land cover change detection", "Wildlife habitat monitoring"],
    tag: "03",
  },
  {
    title: "Institutional Capacity",
    description: "National and county officers proficient in EO-based forecasts, GIS tools, and geospatial standards.",
    image: "/231107.jpg",
    points: ["Technical GIS training", "Standardisation of data", "Inter-agency collaboration"],
    tag: "04",
  },
  {
    title: "Youth Digital Inclusion",
    description: "Increased participation of Kenyan youth in the digital and space-enabled economy.",
    image: "/231107.jpg",
    points: ["Image annotation skills", "Data science workshops", "Digital economy access"],
    tag: "05",
  },
];

export function OutcomesSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % outcomes.length), 6000);
    return () => clearInterval(t);
  }, []);

  const next = () => setCurrent(p => (p + 1) % outcomes.length);
  const prev = () => setCurrent(p => (p - 1 + outcomes.length) % outcomes.length);

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[var(--foreground)] min-h-[480px] flex flex-col justify-center shadow-[var(--shadow-lg)]">
      {outcomes.map((outcome, index) => (
        <div
          key={outcome.title}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-[1.03] pointer-events-none"
          }`}
        >
          <Image src={outcome.image} alt={outcome.title} fill className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)] via-[var(--foreground)]/50 to-[var(--accent-strong)]/20" />

          <div className="relative h-full flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-2xl px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-5 border border-white/10">
                Expected Outcome <span className='font-bold text-lg text-blue-500'>{outcome.tag}</span>
              </div>
              <h3
                className="text-3xl md:text-4xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
              >
                {outcome.title}
              </h3>
              <p className="mt-5 text-base text-white/65 leading-relaxed max-w-xl">
                {outcome.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {outcome.points.map(point => (
                  <div
                    key={point}
                    className="flex items-center gap-2.5 bg-white/8 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/8 hover:bg-white/12 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[var(--accent-soft)] shrink-0" />
                    <p className="text-xs font-semibold text-white/85 leading-snug">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <div className="absolute bottom-7 right-7 md:right-14 flex items-center gap-4 z-20">
        {/* Dot indicators */}
        <div className="flex gap-1.5 items-center">
          {outcomes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        {/* Arrow buttons */}
        <div className="flex gap-2">
          {[prev, next].map((fn, i) => (
            <button
              key={i}
              onClick={fn}
              className="h-11 w-11 flex items-center justify-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur-md hover:bg-white hover:text-[var(--foreground)] transition-all"
            >
              {i === 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
