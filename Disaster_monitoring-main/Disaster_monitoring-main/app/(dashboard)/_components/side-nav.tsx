"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, FileBarChart, Zap } from "lucide-react";

const navigationItems = [
  {
    href: "/",
    label: "Home",
    description: "Mission overview and dashboard summary",
    icon: Home,
  },
  {
    href: "/map-frame",
    label: "Map Frame",
    description: "Map viewport, layers, and basemap setup",
    icon: Map,
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Area-based insight charts and summaries",
    icon: FileBarChart,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel fade-in flex h-full flex-col rounded-[2rem] p-4 lg:p-6">
      <div className="mb-8 border-b border-[var(--line)] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-strong)] text-white shadow-lg mb-4">
          <Zap className="h-6 w-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          KSA DISASTER
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Spatial Command
        </h1>
      </div>

      <div className="flex-1 space-y-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group block rounded-[1.8rem] border px-5 py-5 transition-all duration-300",
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent-strong)] text-white shadow-xl shadow-[color:rgba(23,78,166,0.15)]"
                  : "border-transparent bg-white/40 hover:border-[var(--line)] hover:bg-white",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className={[
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  isActive ? "bg-white/20 text-white" : "bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white"
                ].join(" ")}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold tracking-tight">{item.label}</p>
              </div>
              <p
                className={[
                  "mt-3 text-xs leading-relaxed",
                  isActive ? "text-white/70" : "text-slate-500",
                ].join(" ")}
              >
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl bg-[var(--surface-strong)] p-4 border border-[var(--line)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Status</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            <p className="text-xs font-medium text-slate-600">GeoServer Online</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
