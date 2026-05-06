"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, FileBarChart, Satellite } from "lucide-react";

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
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      className="glass-panel fade-in flex h-full flex-col rounded-[1.75rem] p-5 lg:p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Brand */}
      <div className="mb-8 pb-6 border-b border-[var(--line)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-strong)] shadow-lg mb-4 text-white">
          <Satellite className="h-5 w-5" />
        </div>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          KSA Disaster
        </p>
        <h1
          className="mt-1 text-xl font-bold tracking-tight text-[var(--foreground)]"
          style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
        >
          Spatial Command
        </h1>
      </div>

      {/* Nav Items */}
      <div className="flex-1 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group block rounded-2xl border px-4 py-4 transition-all duration-200",
                isActive
                  ? "border-[var(--accent-strong)] bg-[var(--accent-strong)] text-white shadow-[var(--shadow-accent)]"
                  : "border-transparent bg-white/30 hover:bg-white hover:border-[var(--line)] hover:shadow-[var(--shadow-sm)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p
                  className="text-sm font-semibold tracking-tight text  text-blue-500"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {item.label}
                </p>
              </div>
              <p
                className={[
                  "mt-2 text-xs leading-snug pl-11",
                  isActive ? "text-white/65" : "text-slate-400",
                ].join(" ")}
              >
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Status Footer */}
      <div className="mt-auto pt-6 space-y-3">
        <div className="rounded-xl bg-[var(--surface-strong)] px-4 py-3 border border-[var(--line)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            System Status
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
            </span>
            <p className="text-xs font-medium text-slate-600">GeoServer Online</p>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--accent-soft)] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
            Data Feed
          </p>
          <p className="text-xs text-[var(--accent-strong)] font-medium">
            Live satellite imagery · 6h refresh
          </p>
        </div>
      </div>
    </nav>
  );
}
