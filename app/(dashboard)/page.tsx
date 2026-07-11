"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Map as MapIcon,
  ShieldAlert,
  Sprout,
  Layers,
  ArrowRight,
  Target,
  BarChart3,
  Clock,
  Database,
  Users,
  TrendingUp,
  Globe2,
  Droplets,
  Activity,
} from "lucide-react";

import { OutcomesSlider } from "./_components/outcomes-slider";
import { PhaseTracker } from "./_components/phase-tracker";
import { CountyGrid } from "./_components/county-grid";

const keyFeatures = [
  {
    title: "Integrated Spatial Intel",
    description: "Access real-time satellite imagery and GeoServer-delivered map layers in a unified interface.",
    icon: MapIcon,
    color: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  {
    title: "Study-Driven Analysis",
    description: "Monitor land cover shifts, vegetation indices, and hydrological anomalies across the ASALs.",
    icon: Target,
    color: "var(--earth-green)",
    bg: "var(--earth-green-soft)",
  },
  {
    title: "Decision-Ready Reports",
    description: "Generate comprehensive county-level reports to support data-driven disaster response.",
    icon: BarChart3,
    color: "var(--savanna-gold)",
    bg: "var(--savanna-gold-soft)",
  },
  {
    title: "Ecosystem Restoration",
    description: "Track vegetation recovery, soil health, and land restoration progress over time.",
    icon: Sprout,
    color: "var(--secondary)",
    bg: "var(--secondary-soft)",
  },
];

const impacts = [
  {
    title: "Land Cover Monitoring",
    description: "Reveal land cover shifts that may intensify resource pressure or flood exposure.",
    icon: Layers,
  },
  {
    title: "Vegetation Health",
    description: "Track vegetation health and seasonal recovery using geospatial raster products.",
    icon: Sprout,
  },
  {
    title: "Early Drought Warning",
    description: "Identify drought stress zones early with map layers and chart-based thresholds.",
    icon: ShieldAlert,
  },
];

const quickStats = [
  { label: "ASAL Counties", value: "10", icon: MapIcon, bg: "var(--accent-soft)", color: "var(--accent)" },
  { label: "Indicators", value: "5", icon: Activity, bg: "var(--savanna-gold-soft)", color: "var(--savanna-gold)" },
  { label: "Forecast", value: "6mo", icon: Layers, bg: "var(--earth-green-soft)", color: "var(--earth-green)" },
  { label: "Sync Status", value: "Live", icon: Clock, bg: "var(--secondary-soft)", color: "var(--secondary)" },
];

export default function HomePage() {
  return (
    <div className="space-y-10 pb-12">

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="glass-card rounded-[1.5rem] p-5 flex items-center gap-4 hover-lift">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: s.bg, color: s.color }}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">{s.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-[var(--line)]">
        {/* Hero imagery: photo occupies the right side in full, a white gradient over the
            left keeps the headline legible. */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-[62%]">
            <Image
              src="/iStock-1077574640.avif"
              alt="Aerial view of Kenya's arid and semi-arid rangelands"
              fill
              priority
              sizes="62vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--earth-green-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--earth-green)] border border-[var(--earth-green)]/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--earth-green)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--earth-green)]" />
              </span>
              Phase 1 Active
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">WFP · KSA Joint Initiative</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-[var(--foreground)]">
            Building Climate Resilience in{" "}
            <span className="text-gradient-earth">Kenya&apos;s ASALs</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-2xl">
            Operationalizing Earth Observation (EO) capabilities to support disaster risk reduction,
            rangeland restoration, and sustainable food systems across the 10 ASAL counties.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/map-frame"
              className="group flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-8 py-3.5 text-sm font-bold text-white transition-all hover-lift"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open Map Workspace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-white px-8 py-3.5 text-sm font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              County Reports
            </Link>
          </div>

          {/* Mini Partner Logos */}
          <div className="mt-10 pt-8 border-t border-[var(--line)] flex items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Partners</p>
            <div className="flex gap-4">
              <div className="flex h-10 w-20 items-center justify-center rounded-xl border border-[var(--line)] bg-white shadow-sm px-3">
                <Image src="/ksa.PNG" alt="KSA" width={64} height={24} className="max-h-6 w-auto object-contain" />
              </div>
              <div className="flex h-10 w-20 items-center justify-center rounded-xl border border-[var(--line)] bg-white shadow-sm px-3">
                <Image src="/wfp.PNG" alt="WFP" width={64} height={24} className="max-h-6 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase Tracker */}
      <PhaseTracker />

      {/* County Grid */}
      <CountyGrid />

      {/* Core Capabilities */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-7 w-1.5 bg-[var(--accent)] rounded-full" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Core Technical Capabilities</h2>
            <p className="text-sm text-slate-500 mt-1">Specialized tools for environmental monitoring and disaster risk reduction.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {keyFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-[var(--line)] bg-white p-7 transition-all hover-lift hover:border-transparent hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-[100px] opacity-30 pointer-events-none transition-opacity group-hover:opacity-60"
                style={{ backgroundColor: feature.bg }} />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-all group-hover:scale-110"
                style={{ background: feature.bg, color: feature.color }}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold tracking-tight mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Left Dark Panel */}
        <div className="rounded-[2.5rem] bg-[var(--sidebar-bg)] p-10 text-white relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="h-4 w-4 text-[var(--savanna-gold)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--savanna-gold)]">Impact Analysis</p>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">From Pixels to Policy</h2>
            <p className="text-[var(--sidebar-muted)] leading-relaxed max-w-md mb-8">
              By integrating spatial data with local ground-truth observations, we empower county governments
              to make proactive, data-driven decisions.
            </p>

            <div className="space-y-3">
              {impacts.map((impact) => (
                <div
                  key={impact.title}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--sidebar-surface)] p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <impact.icon className="h-4 w-4 text-[var(--sky-blue)]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{impact.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--sidebar-muted)] leading-relaxed">{impact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Shared Data Repository */}
          <div className="flex-1 rounded-[2.5rem] border border-[var(--line)] bg-white p-8 shadow-sm relative overflow-hidden hover-lift">
            <Database className="absolute -bottom-8 -right-8 h-48 w-48 text-slate-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--earth-green)]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--earth-green)]">Infrastructure</p>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-3">Shared Data Repository</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-xs">
                Centralized digital hub at KSA bridging satellite imagery, real-time weather, and ground-truth data.
              </p>
              <ul className="space-y-2.5">
                {["GeoServer Integration", "Machine Learning Pipeline", "Automated NDVI / VCI Indexing"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--earth-green)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Youth Engagement CTA */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[var(--savanna-gold)] to-[var(--earth-green)] p-7 flex items-center justify-between text-white shadow-lg hover-lift">
            <div>
              <p className="font-bold text-lg leading-snug">Capacity &amp; Youth Engagement</p>
              <p className="text-sm text-white/75 mt-1 max-w-xs">
                Partnering with EMPACT to create geospatial employment pathways through digital annotation.
              </p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-white shrink-0">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Water Resources CTA */}
          <div className="rounded-[2.5rem] border border-[var(--sky-blue)]/30 bg-[var(--sky-blue-soft)] p-6 flex items-center justify-between hover-lift">
            <div>
              <p className="font-bold text-[var(--sidebar-bg)]">Surface Water Dynamics</p>
              <p className="text-sm text-slate-600 mt-1">Track seasonal water pan depletion and emerging hydrological risks.</p>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--sky-blue)] text-white shrink-0">
              <Droplets className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Expected Outcomes Slider */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-7 w-1.5 bg-[var(--secondary)] rounded-full" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Project Expected Outcomes</h2>
            <p className="text-sm text-slate-500 mt-1">Long-term impact and strategic goals of this initiative.</p>
          </div>
        </div>
        <OutcomesSlider />
      </section>
    </div>
  );
}
