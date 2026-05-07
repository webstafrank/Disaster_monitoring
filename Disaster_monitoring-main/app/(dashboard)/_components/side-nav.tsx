"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Map,
  FileBarChart,
  LogOut,
  FactoryIcon,
  Satellite,
  Menu,
  X,
  ChevronRight,
  Brain,
} from "lucide-react";

// ─── Theme Colors (hardcoded for reliability) ──────────────
const THEME = {
  primary: "#1E40AF",
  primaryFade: "#EFF6FF",
  accent: "#2563EB",
  accentStrong: "#1D4ED8",
  accentSoft: "#DBEAFE",
  foreground: "#0F172A",
  line: "#BFDBFE",
  success: "#059669",
  surface: "#F8FAFC",
  surfaceStrong: "#F1F5F9",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  redLight: "#FEE2E2",
} as const;

// ─── Navigation Data ───────────────────────────────────────

const navigationItems = [
  {
    href: "/",
    label: "Home",
    description: "Mission overview & dashboard",
    icon: Home,
  },
  {
    href: "/map-frame",
    label: "Map Frame",
    description: "Layers, basemap & spatial view",
    icon: Map,
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Area-based charts & summaries",
    icon: FileBarChart,
  },
  // {
  //   href: "/",
  //   label: "Return to Main Site",
  //   description: "Visit the public-facing website",
  //   icon: FactoryIcon,
  // },
];

const bottomItems = [
  {
    href: "/risk-prediction",
    label: "Risk prediction",
    description: "Run geospatial models and view forecasts",
    icon: Brain,
    variant: "danger" as const,
  },
];

// ─── Types ─────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
  variant?: "danger";
}

// ─── Sub-components ────────────────────────────────────────

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const isDanger = item.variant === "danger";

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        "group relative block rounded-2xl border px-4 py-3.5 transition-all duration-300 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        isDanger
          ? isActive
            ? "border-red-200 bg-red-50 shadow-sm"
            : "border-transparent bg-white/40 hover:bg-red-50/80 hover:border-red-200 hover:shadow-sm"
          : isActive
          ? "border-blue-700 bg-gradient-to-br from-blue-400 to-black/90 text-white shadow-lg shadow-blue-900/20"
          : "border-transparent bg-white/10 hover:bg-white hover:border-blue-200 hover:shadow-md",
      ].join(" ")}
    >
      {/* Active indicator strip */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full"
          style={{ backgroundColor: isDanger ? "#FCA5A5" : "rgba(255,255,255,0.8)" }}
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            isDanger
              ? isActive
                ? "bg-red-100 text-red-600"
                : "bg-red-50/50 text-red-400 group-hover:bg-red-100 group-hover:text-red-600"
              : isActive
              ? "bg-white/15 text-white"
              : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md",
          ].join(" ")}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={[
                "text-sm font-semibold tracking-tight",
                isDanger
                  ? isActive
                    ? "text-red-700"
                    : "text-red-500 group-hover:text-red-600"
                  : isActive
                  ? "text-white"
                  : "text-slate-600 group-hover:text-slate-900",
              ].join(" ")}
            >
              {item.label}
            </p>
            <ChevronRight
              className={[
                "h-3.5 w-3.5 shrink-0 transition-all duration-300",
                isDanger
                  ? "text-red-300 group-hover:text-red-400 group-hover:translate-x-0.5"
                  : isActive
                  ? "text-white/60 translate-x-0"
                  : "text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5",
              ].join(" ")}
            />
          </div>
          <p
            className={[
              "mt-0.5 text-[11px] leading-snug truncate",
              isDanger
                ? isActive
                  ? "text-red-400"
                  : "text-red-300/70 group-hover:text-red-400"
                : isActive
                ? "text-white/60"
                : "text-slate-400 group-hover:text-slate-500",
            ].join(" ")}
          >
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ────────────────────────────────────────

export function SideNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ─── Mobile Header ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 shadow-lg text-white">
              <Satellite className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600">
                KSA Disaster
              </p>
              <p className="text-sm font-bold text-slate-800 -mt-0.5">
                Spatial Command
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Overlay ─── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* ─── Side Navigation ─── */}
      <nav
        className={[
          "flex h-full flex-col rounded-[1.75rem] p-5 lg:p-6 transition-all duration-300",
          "bg-white/70 backdrop-blur-xl border border-blue-100 shadow-sm",
          // Mobile positioning
          "lg:translate-x-0 lg:static lg:w-auto",
          mobileOpen
            ? "fixed inset-y-4 left-4 z-50 w-[280px] translate-x-0 shadow-2xl"
            : "fixed lg:static -translate-x-full lg:translate-x-0",
        ].join(" ")}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Brand */}
        <div className="mb-6 pb-5 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 shadow-lg shadow-blue-900/20 text-white">
              <Satellite className="h-5 w-5" />
            </div>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                KSA Disaster
              </p>
              <h1
                className="text-xl font-bold tracking-tight text-slate-900"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Spatial Command
              </h1>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-2 overflow-y-auto nav-scroll">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">
            Navigation
          </p>
          {navigationItems.map((item) => (
            <NavLink
              key={item.href + item.label}
              item={item}
              isActive={pathname === item.href}
              onClick={closeMobile}
            />
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-blue-100" />

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">
            Account
          </p>
          {bottomItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onClick={closeMobile}
            />
          ))}
        </div>

        {/* Status Footer */}
        <div className="mt-auto pt-5 space-y-3">
          {/* Decorative gradient line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* System Status */}
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white px-4 py-3 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                System Status
              </p>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <p className="text-xs font-medium text-slate-600">GeoServer Online</p>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              <p className="text-xs font-medium text-slate-600">Drought Monitor Syncing</p>
            </div>
          </div>

          {/* Data Feed */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 px-4 py-3 border border-blue-100">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                Data Feed
              </p>
              <Satellite className="h-3 w-3 text-blue-500" />
            </div>
            <p className="text-xs font-medium text-blue-700">
              Live satellite imagery · 6h refresh
            </p>
          </div>

          {/* Version badge */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-100" />
            <span className="text-[9px] font-medium text-slate-300 tracking-wider">
              v2.4.1
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-100" />
          </div>
        </div>
      </nav>

      {/* Mobile content spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
}