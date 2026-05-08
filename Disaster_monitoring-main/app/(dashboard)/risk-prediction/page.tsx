"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Radar,
  MapPin,
  Activity,
  ChevronRight,
  Shield,
  Droplets,
  Wind,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Bell,
  Filter,
  Search,
  MoreHorizontal,
  Thermometer,
  Waves,
  BarChart3,
  Globe,
  Zap,
  CircleDot,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface RegionData {
  id: string;
  region: string;
  risk: "High" | "Medium" | "Low" | "Critical";
  score: number;
  trend: "Increasing" | "Stable" | "Decreasing";
  disaster: "Flood" | "Drought" | "Wildfire" | "Landslide" | "Storm";
  lastUpdate: string;
  population: number;
  alerts: number;
}

// ─── Data ────────────────────────────────────────────────────────────
const riskData: RegionData[] = [
  {
    id: "1",
    region: "Nairobi West",
    risk: "Critical",
    score: 87,
    trend: "Increasing",
    disaster: "Flood",
    lastUpdate: "2 min ago",
    population: 245000,
    alerts: 3,
  },
  {
    id: "2",
    region: "Kajiado County",
    risk: "High",
    score: 62,
    trend: "Stable",
    disaster: "Drought",
    lastUpdate: "15 min ago",
    population: 120000,
    alerts: 1,
  },
  {
    id: "3",
    region: "Mombasa Coast",
    risk: "Medium",
    score: 28,
    trend: "Decreasing",
    disaster: "Storm",
    lastUpdate: "1 hr ago",
    population: 890000,
    alerts: 0,
  },
  {
    id: "4",
    region: "Kisumu Central",
    risk: "High",
    score: 74,
    trend: "Increasing",
    disaster: "Flood",
    lastUpdate: "5 min ago",
    population: 180000,
    alerts: 2,
  },
  {
    id: "5",
    region: "Turkana North",
    risk: "Medium",
    score: 45,
    trend: "Stable",
    disaster: "Drought",
    lastUpdate: "30 min ago",
    population: 65000,
    alerts: 0,
  },
  {
    id: "6",
    region: "Mt. Elgon",
    risk: "Critical",
    score: 91,
    trend: "Increasing",
    disaster: "Landslide",
    lastUpdate: "Just now",
    population: 34000,
    alerts: 4,
  },
];

const kpiData = [
  {
    label: "Critical Zones",
    value: "2",
    subtext: "Require immediate action",
    icon: AlertTriangle,
    color: "red",
    change: "+1 from yesterday",
    changeType: "up" as const,
  },
  {
    label: "Risk Trend",
    value: "Rising",
    subtext: "3 regions escalated",
    icon: TrendingUp,
    color: "amber",
    change: "+12% this week",
    changeType: "up" as const,
  },
  {
    label: "Monitored Regions",
    value: "12",
    subtext: "Active surveillance",
    icon: Radar,
    color: "blue",
    change: "+2 new this month",
    changeType: "neutral" as const,
  },
  {
    label: "Active Alerts",
    value: "10",
    subtext: "Across 4 disaster types",
    icon: Bell,
    color: "purple",
    change: "3 resolved today",
    changeType: "down" as const,
  },
];

const disasterTypes = [
  { type: "Flood", icon: Droplets, count: 3, color: "blue" },
  { type: "Drought", icon: Thermometer, count: 2, color: "amber" },
  { type: "Wildfire", icon: Flame, count: 1, color: "red" },
  { type: "Storm", icon: Wind, count: 2, color: "indigo" },
  { type: "Landslide", icon: Waves, count: 2, color: "orange" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function getRiskColor(risk: string) {
  switch (risk) {
    case "Critical":
      return {
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-700 border-red-300",
        dot: "bg-red-500",
        bar: "bg-red-500",
      };
    case "High":
      return {
        text: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
        badge: "bg-orange-100 text-orange-700 border-orange-300",
        dot: "bg-orange-500",
        bar: "bg-orange-500",
      };
    case "Medium":
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700 border-amber-300",
        dot: "bg-amber-500",
        bar: "bg-amber-500",
      };
    default:
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
        dot: "bg-emerald-500",
        bar: "bg-emerald-500",
      };
  }
}

function getTrendIcon(trend: string) {
  if (trend === "Increasing")
    return <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />;
  if (trend === "Decreasing")
    return <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

function getDisasterIcon(type: string) {
  const found = disasterTypes.find((d) => d.type === type);
  return found ? found.icon : AlertTriangle;
}

function formatPopulation(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

// ─── Components ────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  const colors: Record<string, string> = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
  };
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colors[color] || "bg-slate-400"}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredData = riskData.filter((item) => {
    const matchesTab = activeTab === "all" || item.risk.toLowerCase() === activeTab;
    const matchesSearch = item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Risk<span className="text-blue-600">Guard</span> AI
                </h1>
                <p className="text-[11px] text-slate-500 -mt-0.5">Disaster Prediction Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <CircleDot className="h-3 w-3 text-emerald-500 fill-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Live Monitoring</span>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700">AD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header Section ─────────────────────────────── */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded">
                Dashboard
              </span>
              <span className="text-xs text-slate-400">Updated 2 minutes ago</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Risk Prediction Overview
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              AI-powered disaster risk forecasting and real-time regional monitoring across Kenya
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Clock className="h-4 w-4" />
              Last 24 Hours
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 -rotate-90" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
              <Zap className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, i) => {
            const Icon = kpi.icon;
            const colorMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
              red: { bg: "bg-red-500", text: "text-red-700", border: "border-red-200", light: "bg-red-50" },
              amber: { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", light: "bg-amber-50" },
              blue: { bg: "bg-blue-500", text: "text-blue-700", border: "border-blue-200", light: "bg-blue-50" },
              purple: { bg: "bg-purple-500", text: "text-purple-700", border: "border-purple-200", light: "bg-purple-50" },
            };
            const c = colorMap[kpi.color] || colorMap.blue;

            return (
              <div
                key={kpi.label}
                className={`group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-500 cursor-pointer ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${c.light}`}>
                    <Icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {kpi.changeType === "up" && <ArrowUpRight className="h-3 w-3 text-red-500" />}
                    {kpi.changeType === "down" && <ArrowDownRight className="h-3 w-3 text-emerald-500" />}
                    {kpi.changeType === "neutral" && <Minus className="h-3 w-3 text-slate-400" />}
                    <span
                      className={`font-medium ${
                        kpi.changeType === "up" ? "text-red-600" : kpi.changeType === "down" ? "text-emerald-600" : "text-slate-500"
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-0.5">
                  {isNaN(Number(kpi.value)) ? kpi.value : <AnimatedCounter target={Number(kpi.value)} />}
                </h3>
                <p className="text-sm font-medium text-slate-700">{kpi.label}</p>
                <p className="text-xs text-slate-400 mt-1">{kpi.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* ── Disaster Type Distribution ─────────────────── */}
        <div
          className={`bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-600" />
              Active Disaster Types
            </h3>
            <span className="text-xs text-slate-400">Real-time distribution</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {disasterTypes.map((disaster) => {
              const Icon = disaster.icon;
              const colorMap: Record<string, string> = {
                blue: "bg-blue-50 text-blue-700 border-blue-200",
                amber: "bg-amber-50 text-amber-700 border-amber-200",
                red: "bg-red-50 text-red-700 border-red-200",
                indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
                orange: "bg-orange-50 text-orange-700 border-orange-200",
              };
              return (
                <div
                  key={disaster.type}
                  className={`flex flex-col items-center p-4 rounded-xl border ${colorMap[disaster.color]} hover:shadow-md transition-all cursor-pointer`}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <span className="text-lg font-bold">{disaster.count}</span>
                  <span className="text-xs font-medium">{disaster.type}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main Content Grid ──────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Risk Table (2/3) ─────────────────────────── */}
          <div
            className={`lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-700 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* Table Header */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Regional Risk Forecast</h3>
                    <p className="text-xs text-slate-500">{filteredData.length} regions monitored</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search regions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 transition-all"
                    />
                  </div>
                  <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                    <Filter className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 mt-4">
                {["all", "critical", "high", "medium", "low"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      activeTab === tab
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100">
              {filteredData.map((item, i) => {
                const colors = getRiskColor(item.risk);
                const DisasterIcon = getDisasterIcon(item.disaster);
                const isSelected = selectedRegion === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRegion(isSelected ? null : item.id)}
                    className={`p-4 sm:p-5 cursor-pointer transition-all duration-300 ${
                      isSelected ? "bg-blue-50/50 border-l-4 border-l-blue-500" : "hover:bg-slate-50 border-l-4 border-l-transparent"
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Region Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-xl ${colors.bg} ${colors.border} border`}>
                          <MapPin className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 truncate">{item.region}</p>
                            {item.alerts > 0 && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                                <Bell className="h-2.5 w-2.5" />
                                {item.alerts}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <DisasterIcon className="h-3 w-3" />
                              {item.disaster}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="text-xs text-slate-500">
                              <Globe className="h-3 w-3 inline mr-0.5" />
                              {formatPopulation(item.population)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score with Bar */}
                      <div className="flex items-center gap-4 sm:w-48">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600">Risk Score</span>
                            <span className="text-sm font-bold text-slate-900">{item.score}</span>
                          </div>
                          <ScoreBar score={item.score} color={item.risk === "Critical" ? "red" : item.risk === "High" ? "orange" : item.risk === "Medium" ? "amber" : "emerald"} />
                        </div>
                      </div>

                      {/* Trend & Badge */}
                      <div className="flex items-center gap-3 sm:w-40">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                          {getTrendIcon(item.trend)}
                          <span className="text-xs font-medium text-slate-600">{item.trend}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors.badge}`}>
                          {item.risk}
                        </span>
                      </div>

                      {/* Expand */}
                      <div className="hidden sm:block">
                        <ChevronRight
                          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isSelected ? "rotate-90" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {item.lastUpdate}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-xs text-slate-500 mb-1">Population at Risk</p>
                          <p className="text-sm font-medium text-slate-900">{item.population.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-xs text-slate-500 mb-1">Active Alerts</p>
                          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                            {item.alerts} alert{item.alerts !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <Search className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No regions match your filters</p>
              </div>
            )}
          </div>

          {/* ── Sidebar (1/3) ──────────────────────────────── */}
          <div className="space-y-6">
            {/* AI Insight Card */}
            <div
              className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-700 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">AI Insight</h3>
                <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <Activity className="h-3 w-3 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Critical Alert</p>
                      <p className="text-xs text-red-600 mt-1 leading-relaxed">
                        Nairobi West and Mt. Elgon have reached critical risk levels. Immediate evacuation protocols recommended.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Trending Up</p>
                      <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                        Flood probability increased 23% in Nairobi West due to sustained rainfall and soil saturation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Recommendation</p>
                      <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                        Deploy emergency response teams to critical zones. Activate early warning systems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-700 delay-600 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-600" />
                System Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Model Accuracy", value: "94.2%", bar: 94, color: "bg-emerald-500" },
                  { label: "Prediction Speed", value: "< 2s", bar: 88, color: "bg-blue-500" },
                  { label: "Data Freshness", value: "Real-time", bar: 100, color: "bg-purple-500" },
                  { label: "Coverage", value: "87%", bar: 87, color: "bg-amber-500" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-600">{stat.label}</span>
                      <span className="text-xs font-bold text-slate-900">{stat.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-full rounded-full ${stat.color}`}
                        style={{ width: `${stat.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-700 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { time: "2 min ago", text: "Nairobi West risk escalated to Critical", type: "critical" },
                  { time: "15 min ago", text: "New flood prediction model deployed", type: "info" },
                  { time: "1 hr ago", text: "Mombasa Coast risk decreased to Medium", type: "success" },
                  { time: "3 hr ago", text: "Mt. Elgon landslide warning issued", type: "warning" },
                ].map((activity, i) => {
                  const typeColors: Record<string, { dot: string; bg: string }> = {
                    critical: { dot: "bg-red-500", bg: "bg-red-50" },
                    warning: { dot: "bg-amber-500", bg: "bg-amber-50" },
                    info: { dot: "bg-blue-500", bg: "bg-blue-50" },
                    success: { dot: "bg-emerald-500", bg: "bg-emerald-50" },
                  };
                  const tc = typeColors[activity.type];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1.5 h-2 w-2 rounded-full ${tc.dot} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-snug">{activity.text}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}