"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const outcomes = [
  {
    title: "Early Warning & Preparedness",
    description: "Improved decision-making through timely and accurate Earth Observation (EO)-based alerts for droughts and floods.",
    image: "/231107.jpg",
    points: ["Real-time soil moisture tracking", "Community-level alerts", "Resource allocation optimization"]
  },
  {
    title: "Ecosystem Recovery",
    description: "Strengthened sustainable land management and ecosystem restoration through the use of long-term vegetation trend analysis and soil health monitoring.",
    image: "/88112.jpg",
    points: ["Verified satellite indices", "Historical trend analysis", "Institutional data sharing"]
  },
  {
    title: "Resource & Productivity",
    description: "Sustainable management of livestock carrying capacity informed by accurate biomass (forage yield) estimation and seasonal surface water tracking.",
    image: "/iStock-1077574640.avif",
    points: ["Vegetation health mapping", "Land cover change detection", "Wildlife habitat monitoring"]
  },
  {
    title: "Institutional Capacity",
    description: "A workforce of national and county government officers proficient in interpreting EO-based forecasts, utilizing GIS tools, and operationalizing geospatial standards.",
    image: "/231107.jpg",
    points: ["Technical GIS training", "Standardization of data", "Inter-agency collaboration"]
  },
  {
    title: "Youth Digital Inclusion",
    description: "Increased participation of Kenyan youth in the digital and space-enabled economy through specialized training in image annotation and geospatial analytics.",
    image: "/231107.jpg",
    points: ["Image annotation skills", "Data science workshops", "Digital economy access"]
  }
];

export function OutcomesSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % outcomes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % outcomes.length);
  const prev = () => setCurrent((prev) => (prev - 1 + outcomes.length) % outcomes.length);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--sidebar-bg)] min-h-[500px] flex flex-col justify-center shadow-xl">
      {outcomes.map((outcome, index) => (
        <div
          key={outcome.title}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          <Image
            src={outcome.image}
            alt={outcome.title}
            fill
            className="object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--sidebar-bg)] via-[var(--sidebar-bg)]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--sidebar-bg)] via-[var(--sidebar-bg)]/80 to-transparent" />

          <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white mb-6 border border-white/20">
                <span className="h-2 w-2 rounded-full bg-[var(--savanna-gold)]" />
                Strategic Outcome 0{index + 1}
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                {outcome.title}
              </h3>
              <p className="mt-6 text-lg md:text-xl text-[var(--sidebar-muted)] leading-relaxed max-w-2xl">
                {outcome.description}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {outcome.points.map((point) => (
                  <div key={point} className="flex items-center gap-3 bg-[var(--sidebar-surface)] backdrop-blur-sm p-4 rounded-2xl border border-[var(--sidebar-border)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-[var(--earth-green)] shrink-0" />
                    <p className="text-sm font-bold text-[var(--sidebar-text)] leading-tight">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 md:right-16 flex items-center gap-4 z-20">
        <div className="flex gap-2 bg-[var(--sidebar-surface)] p-2 rounded-full backdrop-blur-md border border-[var(--sidebar-border)]">
            {outcomes.map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                        i === current ? "w-8 bg-[var(--savanna-gold)]" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                />
            ))}
        </div>
        <div className="flex gap-2 ml-2">
            <button
                onClick={prev}
                className="h-12 w-12 flex items-center justify-center rounded-full border border-[var(--sidebar-border)] bg-[var(--sidebar-surface)] text-white backdrop-blur-md hover:bg-white hover:text-[var(--foreground)] transition-all"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={next}
                className="h-12 w-12 flex items-center justify-center rounded-full border border-[var(--sidebar-border)] bg-[var(--sidebar-surface)] text-white backdrop-blur-md hover:bg-white hover:text-[var(--foreground)] transition-all"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
      </div>
    </section>
  );
}
