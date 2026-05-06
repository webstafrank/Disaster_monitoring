"use client";

import { memo, useCallback, useMemo, useState } from "react";
import {
  Info,
  BarChart3,
  Layers,
  Map as MapIcon,
  ChevronRight,
  TrendingUp,
  Activity,
  Droplets,
  Trees,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface StudyTab {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly layers: readonly string[];
  readonly chartTitle: string;
  readonly chartSeries: readonly number[];
  readonly chartLabels: readonly string[];
  readonly insight: string;
  readonly color: string;
  readonly colorSoft: string;
  readonly colorStrong: string;
  readonly icon: React.ElementType;
  readonly accentIcon: React.ElementType;
}

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const STUDY_TABS: readonly StudyTab[] = [
  {
    id: "land-use",
    label: "Land Use",
    summary:
      "Track built-up expansion, cropland shifts, and land cover transitions within the study area.",
    layers: [
      "Land cover classification",
      "Built-up footprint change",
      "Agricultural zones",
      "Administrative boundaries",
    ],
    chartTitle: "Land Cover Share",
    chartSeries: [68, 44, 36, 22],
    chartLabels: ["Urban", "Crop", "Forest", "Water"],
    insight:
      "GeoServer can publish land cover mosaics and change polygons for time-based comparison.",
    color: "var(--accent)",
    colorSoft: "var(--accent-soft)",
    colorStrong: "var(--accent-strong)",
    icon: Layers,
    accentIcon: TrendingUp,
  },
  {
    id: "vegetation-monitoring",
    label: "Vegetation",
    summary:
      "Observe vegetation vigor, seasonal greenness, and recovery from satellite-derived rasters.",
    layers: [
      "NDVI composite",
      "Vegetation anomaly",
      "Water bodies",
      "Observation stations",
    ],
    chartTitle: "Greenness Trend",
    chartSeries: [32, 48, 61, 57],
    chartLabels: ["Q1", "Q2", "Q3", "Q4"],
    insight:
      "Charts derived from NDVI and anomaly layers are served through GeoServer and summarised by area.",
    color: "var(--success)",
    colorSoft: "var(--success-soft)",
    colorStrong: "var(--success)",
    icon: Trees,
    accentIcon: Activity,
  },
  {
    id: "drought-indicators",
    label: "Drought",
    summary:
      "Review rainfall deficits, moisture stress, and exposure to flag areas under drought pressure.",
    layers: [
      "SPI severity classes",
      "Soil moisture anomaly",
      "Rainfall deficit grid",
      "Population exposure",
    ],
    chartTitle: "Drought Severity Index",
    chartSeries: [18, 30, 54, 71],
    chartLabels: ["Mild", "Mod", "Sev", "Ext"],
    insight:
      "Use for drought composites, threshold alerts, and district summaries from GeoServer layers.",
    color: "var(--warning)",
    colorSoft: "var(--warning-soft)",
    colorStrong: "var(--warning)",
    icon: Droplets,
    accentIcon: Sparkles,
  },
] as const;

// ─────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const barVariants = {
  hidden: { scaleY: 0 },
  visible: (height: number) => ({
    scaleY: 1,
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 },
  }),
};

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

const TabButton = memo(function TabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: StudyTab;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive
          ? "text-white shadow-lg"
          : "bg-[var(--surface-strong)] text-slate-500 hover:bg-white hover:text-[var(--foreground)] border border-transparent hover:border-[var(--line)]",
      ].join(" ")}
      style={
        isActive
          ? {
              backgroundColor: tab.colorStrong,
              boxShadow: `0 4px 20px ${tab.color}40`,
              focusRingColor: tab.colorStrong,
            }
          : undefined
      }
    >
      <Icon
        className={[
          "h-4 w-4 transition-transform duration-300",
          isActive ? "scale-110" : "text-slate-400 group-hover:text-[var(--accent)]",
        ].join(" ")}
      />
      {tab.label}
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 rounded-full ring-2 ring-white/20"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
});

const MapVisualization = memo(function MapVisualization({
  tab,
}: {
  tab: StudyTab;
}) {
  const blobs = useMemo(
    () => [
      { left: "14%", top: "28%", size: 112, delay: 0, color: "var(--warning)" },
      { left: "44%", top: "18%", size: 144, delay: 0.2, color: "var(--accent)" },
      { left: "68%", top: "52%", size: 96, delay: 0.4, color: "var(--secondary)" },
      { left: "24%", top: "62%", size: 80, delay: 0.6, color: tab.color },
    ],
    [tab.color]
  );

  return (
    <div className="map-grid contour-lines relative min-h-[400px] overflow-hidden rounded-2xl border border-[var(--line)]">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${tab.colorSoft}40 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, var(--secondary-soft)30 0%, transparent 50%)`,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top bar */}
      <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)] shadow-sm backdrop-blur-md border border-white/60">
          <MapIcon className="h-3 w-3" />
          Spatial Projection
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)] shadow-sm backdrop-blur-md border border-white/60">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          </span>
          Live Preview
        </div>
      </div>

      {/* Animated blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={`${tab.id}-blob-${i}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 0.25,
            x: [0, 8, -8, 0],
            y: [0, -6, 6, 0],
          }}
          transition={{
            scale: { duration: 0.6, delay: blob.delay },
            opacity: { duration: 0.6, delay: blob.delay },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: blob.delay },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: blob.delay + 0.5 },
          }}
          className="absolute rounded-full border-2 border-dashed"
          style={{
            left: blob.left,
            top: blob.top,
            width: blob.size,
            height: blob.size,
            borderColor: blob.color,
            backgroundColor: `${blob.color}15`,
          }}
        />
      ))}

      {/* Center crosshair */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border border-[var(--accent)]/20" />
          <div className="absolute inset-2 rounded-full border border-[var(--accent)]/15" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--accent)]/10" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--accent)]/10" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/30" />
        </div>
      </div>

      {/* Scale indicator */}
      <div className="absolute right-5 top-1/2 z-10 -translate-y-1/2">
        <div className="flex flex-col items-center gap-1 rounded-lg bg-white/80 px-2 py-3 backdrop-blur-sm border border-white/50">
          <div className="h-16 w-px bg-slate-300" />
          <span className="text-[9px] font-bold text-slate-400 rotate-90 whitespace-nowrap origin-center translate-x-2">
            10 km
          </span>
        </div>
      </div>

      {/* Bottom overlay */}
      <div className="absolute inset-x-5 bottom-5 z-10 grid gap-3 lg:grid-cols-[1fr_200px]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl bg-white/95 p-5 shadow-lg backdrop-blur-md border border-white/60"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Active Layers
          </p>
          <div className="flex flex-wrap gap-2">
            {tab.layers.map((layer, i) => (
              <motion.span
                key={layer}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="group/layer relative flex items-center gap-1.5 rounded-lg bg-[var(--surface-strong)] px-3 py-1.5 text-[11px] font-medium text-slate-600 border border-[var(--line)] transition-colors hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/30"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: tab.color }}
                />
                {layer}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="group flex cursor-pointer flex-col justify-between rounded-xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: tab.colorStrong }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Action
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug">
              Explore full map workspace
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-white/60">Open in viewer</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-colors group-hover:bg-white/25">
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

const ChartPanel = memo(function ChartPanel({ tab }: { tab: StudyTab }) {
  const maxVal = Math.max(...tab.chartSeries);
  const total = tab.chartSeries.reduce((a, b) => a + b, 0);

  return (
    <motion.div
      key={tab.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col rounded-2xl p-7 text-white shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${tab.colorStrong} 0%, ${tab.color} 100%)`,
        boxShadow: `0 8px 32px ${tab.color}30`,
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <BarChart3 className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Derived Insights
            </p>
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/70">
          Total: {total}
        </div>
      </div>

      <h4 className="mb-6 mt-2 text-lg font-bold tracking-tight">
        {tab.chartTitle}
      </h4>

      <div className="flex flex-1 items-end gap-3">
        {tab.chartSeries.map((value, i) => {
          const height = (value / maxVal) * 100;
          return (
            <div
              key={`${tab.id}-bar-${i}`}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <motion.div
                className="relative w-full overflow-hidden rounded-t-xl"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.2 + i * 0.1,
                }}
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
                  }}
                />
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(180deg, ${tab.color} 0%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </motion.div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold text-white/80 transition-colors group-hover:text-white">
                  {value}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/35">
                  {tab.chartLabels[i]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

const InsightCard = memo(function InsightCard({ tab }: { tab: StudyTab }) {
  const AccentIcon = tab.accentIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border-2 bg-white p-6 transition-colors hover:border-[var(--accent)]/30"
      style={{ borderColor: tab.colorSoft }}
    >
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-150"
        style={{ backgroundColor: tab.color }}
      />
      <div className="relative flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: tab.colorSoft, color: tab.colorStrong }}
        >
          <AccentIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Analysis Note
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            {tab.insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const StatPill = memo(function StatPill({
  label,
  value,
  trend,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm border border-white/60">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <TrendingUp className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-[var(--foreground)]">
            {value}
          </span>
          <span className="text-[10px] font-semibold text-[var(--success)]">
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export const AreaStudyTabs = memo(function AreaStudyTabs() {
  const [activeTab, setActiveTab] = useState<StudyTab>(STUDY_TABS[0]);

  const handleTabChange = useCallback((tab: StudyTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden rounded-[2.25rem] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]"
    >
      {/* Decorative top gradient */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${STUDY_TABS[0].color} 0%, ${STUDY_TABS[1].color} 50%, ${STUDY_TABS[2].color} 100%)`,
        }}
      />

      <div className="p-8 lg:p-10">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2"
              style={{
                backgroundColor: activeTab.colorSoft,
                color: activeTab.colorStrong,
              }}
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Area of Study
              </span>
            </motion.div>

            <h3 className="text-3xl font-bold tracking-tight text-[var(--foreground)] lg:text-4xl">
              Thematic Map Layers &{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${activeTab.colorStrong} 0%, ${activeTab.color} 100%)`,
                }}
              >
                GeoServer Data
              </span>
            </h3>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Specialised map layers and derived analysis charts to support
              decision-making within specific disaster contexts.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3">
            <StatPill
              label="Coverage"
              value="2,450 km²"
              trend="+12%"
              color={activeTab.colorStrong}
            />
            <StatPill
              label="Resolution"
              value="10m"
              trend="High"
              color="var(--success)"
            />
            <StatPill
              label="Updated"
              value="2h ago"
              trend="Live"
              color="var(--accent)"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="mb-8 flex flex-wrap gap-2">
          {STUDY_TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTab.id}
              onClick={() => handleTabChange(tab)}
            />
          ))}
        </motion.div>

        {/* Content grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid gap-6 xl:grid-cols-[1fr_380px]"
          >
            {/* Left: Map */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: activeTab.colorSoft,
                      color: activeTab.colorStrong,
                    }}
                  >
                    <activeTab.icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-[var(--foreground)]">
                    {activeTab.label} Summary
                  </h4>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-[var(--success)]/20 bg-[var(--success-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--success)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  </span>
                  Ready
                </span>
              </div>

              <p className="mb-5 text-xs italic leading-relaxed text-slate-400">
                &ldquo;{activeTab.summary}&rdquo;
              </p>

              <MapVisualization tab={activeTab} />
            </div>

            {/* Right: Chart + Insight */}
            <div className="flex flex-col gap-5">
              <ChartPanel tab={activeTab} />
              <InsightCard tab={activeTab} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
});