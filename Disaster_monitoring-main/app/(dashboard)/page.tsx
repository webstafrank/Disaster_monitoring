"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  LineChart,
  Map as MapIcon,
  ShieldAlert,
  Sprout,
  Layers,
  ArrowRight,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Globe,
  TrendingUp,
} from "lucide-react";

import { OutcomesSlider } from "./_components/outcomes-slider";

const heroImages = [
  { src: "/231107.jpg",               alt: "Kenya Landscape 1" },
  { src: "/88112.jpg",                alt: "Kenya Landscape 2" },
  { src: "/iStock-1077574640.avif",   alt: "Kenya Landscape 3" },
];

const keyFeatures = [
  {
    title: "Integrated Map Workspace",
    description: "Access real-time satellite imagery and GeoServer-delivered map layers in one unified interface.",
    icon: MapIcon,
    accent: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  {
    title: "Study-Driven Analysis",
    description: "Leverage advanced geospatial analysis to monitor land cover shifts and environmental changes.",
    icon: Target,
    accent: "var(--secondary)",
    bg: "var(--secondary-soft)",
  },
  {
    title: "Decision-Ready Summaries",
    description: "Generate comprehensive reports and charts to support data-driven disaster response decisions.",
    icon: BarChart3,
    accent: "var(--warning)",
    bg: "var(--warning-soft)",
  },
];

const impacts = [
  {
    title: "Land Cover Shifts",
    description: "Reveal transitions that intensify resource pressure or flood exposure.",
    icon: Layers,
  },
  {
    title: "Vegetation Health",
    description: "Track seasonal recovery using satellite-derived NDVI raster products.",
    icon: Sprout,
  },
  {
    title: "Early Drought Warning",
    description: "Flag drought stress zones early via map layers and chart thresholds.",
    icon: ShieldAlert,
  },
];

const collaborators = [
  { name: "Kenya Space Agency",    role: "Strategic Partner",    color: "var(--accent)" },
  { name: "World Food Programme",  role: "Implementation Lead",  color: "var(--secondary)" },
  { name: "Remote Sensing Lab",    role: "Technical Partner",    color: "var(--success)" },
  { name: "Water Authority",       role: "Data Custodian",       color: "var(--warning)" },
];

const spatialCommandLogos = [
  { name: "Kenya Space Agency",   src: "/ksa.PNG" },
  { name: "World Food Programme", src: "/wfp.PNG" },
];

const stats = [
  { value: "12", label: "Regions",    color: "var(--accent-strong)" },
  { value: "24", label: "Layers",     color: "var(--secondary)"     },
  { value: "03", label: "Indicators", color: "var(--warning)"       },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  const nextSlide = () => setCurrentSlide(p => (p + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide(p => (p - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="space-y-10 pb-12">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2.25rem] bg-white border border-[var(--line)] shadow-[var(--shadow-md)]">
        <div className="grid lg:grid-cols-2">

          {/* Left: Copy */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14 rise-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3.5 py-1.5 w-fit mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Mission Overview
              </span>
            </div>

            <h1
              className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-[3.25rem] leading-[1.1] text-[var(--foreground)]"
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
            >
              Disaster Monitoring &{" "}
              <span className="gradient-text">Drought Indicators</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
              A comprehensive framework for Kenya&apos;s disaster monitoring.
              Harnessing geospatial intelligence to protect ecosystems and communities
              through data-driven insights.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/map-frame"
                className="group flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-accent)] transition-all hover:brightness-110 hover:-translate-y-0.5"
              >
                <LayoutDashboard className="h-4 w-4 text-white" />
                <span className="text-white">View Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/reports"
                className="flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-transparent px-7 py-3.5 text-sm font-semibold transition-all hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] hover:-translate-y-0.5"
              >
                <LineChart className="h-4 w-4 text-[var(--accent)]" />
                See Insights
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-11 grid grid-cols-3 gap-6 border-t border-[var(--line)] pt-8">
              {stats.map(s => (
                <div key={s.label}>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: s.color, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.04em" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Slider */}
          <div className="relative hidden min-h-[500px] lg:block overflow-hidden">
            {heroImages.map((img, i) => (
              <div
                key={img.src}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  i === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill priority={i === 0} className="object-cover" />
              </div>
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,46,0.05)_0%,rgba(5,15,46,0.35)_100%)]" />

            {/* Slider controls */}
            <div className="absolute bottom-8 left-8 flex gap-2 z-10">
              {[prevSlide, nextSlide].map((fn, i) => (
                <button
                  key={i}
                  onClick={fn}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-md hover:bg-white transition-colors"
                >
                  {i === 0
                    ? <ChevronLeft className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />
                  }
                </button>
              ))}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-9 left-28 flex gap-1.5 items-center z-10">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentSlide ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Floating card */}
            <div className="absolute bottom-8 right-8 max-w-[260px] rounded-2xl bg-white/92 p-5 backdrop-blur-md border border-white/30 shadow-[var(--shadow-lg)] z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)]">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Spatial Intelligence
                  </p>
                  <p className="text-xs text-slate-400">Live GeoServer Feed</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 mb-4">
                Real-time satellite-derived products for rapid situational awareness.
              </p>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2.5">
                  Spatial Command
                </p>
                <div className="flex items-center gap-2">
                  {spatialCommandLogos.map(logo => (
                    <div
                      key={logo.name}
                      className="flex h-10 w-20 items-center justify-center rounded-lg border border-slate-100 bg-white px-2 shadow-sm"
                    >
                      <Image src={logo.src} alt={logo.name} width={64} height={28} className="max-h-7 w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Capabilities ────────────────────────── */}
      <section className="space-y-7">
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
          >
            Core Capabilities
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Specialised tools for environmental monitoring and disaster risk reduction
            across the Kenyan landscape.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {keyFeatures.map((f, i) => (
            <div
              key={f.title}
              className={`card-hover group rounded-2xl border border-[var(--line)] bg-white p-7 slide-up delay-${(i + 1) * 100}`}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors"
                style={{ background: f.bg, color: f.accent }}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Impact + Partners ────────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Impact panel – dark */}
        <div className="rounded-[2rem] bg-[var(--accent-strong)] p-9 text-white relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-[var(--accent)]/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-3">
              Impact Analysis
            </p>
            <h2
              className="text-2xl font-bold leading-snug mb-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Why this dashboard matters
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              Data-driven decisions are critical for climate resilience. We translate
              raw spatial data into actionable environmental policy.
            </p>
            <div className="space-y-3">
              {impacts.map(impact => (
                <div
                  key={impact.title}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <impact.icon className="h-4 w-4 text-[var(--accent-soft)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {impact.title}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{impact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <div className="flex-1 rounded-[2rem] border border-[var(--line)] bg-white p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
              Collaborators
            </p>
            <h2
              className="text-2xl font-bold tracking-tight mb-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Institutional Partners
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-7">
              Collaborative effort between national and regional entities ensuring
              technical accuracy and operational relevance.
            </p>
            <div className="grid gap-3">
              {collaborators.map(c => (
                <div
                  key={c.name}
                  className="flex items-center gap-4 rounded-xl bg-[var(--surface-strong)] p-4 border border-transparent hover:border-[var(--line)] transition-all"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm"
                    style={{ background: c.color, fontFamily: "'Outfit', sans-serif" }}
                  >
                    {c.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {c.name}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {c.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--accent-soft)] p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-[var(--accent-strong)] text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Need customized reports?
              </p>
              <p className="text-xs text-[var(--accent)] mt-0.5">Our team can help with specific area studies.</p>
            </div>
            <Link
              href="/reports"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--accent-strong)] shadow-md hover:scale-110 transition-transform"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Expected Outcomes Slider ─────────────────── */}
      <section>
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
            >
              Project Expected Outcomes
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Strategic goals and long-term impact of our disaster monitoring initiatives.
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-[var(--accent)] shrink-0" />
        </div>
        <OutcomesSlider />
      </section>

    </div>
  );
}
