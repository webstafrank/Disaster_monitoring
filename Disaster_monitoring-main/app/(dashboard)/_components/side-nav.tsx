"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  FileBarChart,
  Layers,
  Globe2,
  Menu,
  X,
  Bell,
  BookOpen,
  Settings,
  ChevronRight,
  Satellite,
  Activity,
} from "lucide-react";
import Image from "next/image";

const mainNavItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/map-frame",
    label: "Spatial Command",
    icon: Map,
  },
  {
    href: "/reports",
    label: "ASAL Analytics",
    icon: FileBarChart,
  },
  {
    href: "/topics-under-study",
    label: "Research Topics",
    icon: Layers,
  },
];

const extraNavItems = [
  {
    href: "/alerts",
    label: "Alerts & Warnings",
    icon: Bell,
    badge: "3",
  },
  {
    href: "/field-data",
    label: "Field Data",
    icon: Activity,
  },
  {
    href: "/data-library",
    label: "Data Library",
    icon: BookOpen,
  },
  {
    href: "/satellites",
    label: "EO Satellites",
    icon: Satellite,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  badge,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
        ${isActive
          ? "bg-[var(--accent)] !text-white font-bold shadow-md"
          : "!text-white hover:bg-white/10 font-medium"
        }
      `}
    >
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors
        ${isActive ? "bg-white/20 text-white" : "text-current"}
      `}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm flex-1 !text-white">{label}</span>
      {badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--terracotta)] px-1.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
      {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
    </Link>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 rounded-xl bg-[var(--sidebar-bg)] p-3 text-white shadow-lg lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:static lg:w-auto lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        sidebar-panel flex h-full flex-col rounded-[2rem] overflow-hidden shadow-2xl lg:shadow-none
      `}>

        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md">
              <Image src="/ksa.PNG" alt="KSA" width={28} height={28} style={{ width: 'auto', height: 28 }} className="object-contain" />
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md">
              <Image src="/wfp.PNG" alt="WFP" width={28} height={28} style={{ width: 'auto', height: 28 }} className="object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <Globe2 className="h-3 w-3 text-[var(--savanna-gold)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] !text-white">
              KSA · WFP Initiative
            </p>
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">
            Rangeland Intelligence Hub
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

          {/* Main Nav */}
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] !text-white opacity-80">
            Navigation
          </p>
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
              onClick={() => setIsOpen(false)}
            />
          ))}

          {/* Divider */}
          <div className="my-3 mx-3 border-t border-[var(--sidebar-border)]" />

          {/* Extra Nav */}
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] !text-white opacity-80">
            Tools & Data
          </p>
          {extraNavItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
              badge={item.badge}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>

        {/* Footer Tag */}
        <div className="px-5 py-4 border-t border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2 text-[var(--sidebar-muted)]">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            <p className="text-[11px] font-medium !text-white">GeoServer Online · Live</p>
          </div>
        </div>
      </nav>
    </>
  );
}
