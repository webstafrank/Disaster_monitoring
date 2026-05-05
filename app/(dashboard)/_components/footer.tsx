import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Zap, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 rounded-[2.5rem] border border-[var(--line)] bg-white p-8 md:p-12 overflow-hidden relative">
      <div className="relative z-10 grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
        {/* Project Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-strong)] text-white">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">KSA Disaster</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 max-w-md">
            The KSA Disaster Monitoring framework is a state-of-the-art geospatial intelligence system designed to monitor drought indicators, land cover shifts, and vegetation health across Kenya. Our mission is to provide actionable insights for environmental resilience.
          </p>
          <div className="flex gap-4">
            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all border border-[var(--line)]">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all border border-[var(--line)]">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--line)]" />
                Home Overview
              </Link>
            </li>
            <li>
              <Link href="/map-frame" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--line)]" />
                Map Workspace
              </Link>
            </li>
            <li>
              <Link href="/reports" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--line)]" />
                Analysis Reports
              </Link>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--line)]" />
                Documentation
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                <MapPin className="h-4 w-4" />
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Kenya Space Agency HQ,<br />
                Nairobi, Kenya
              </p>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                <Mail className="h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600">contact@ksa.go.ke</p>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                <Phone className="h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600">+254 20 123 4567</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="mt-16 pt-8 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-slate-500">
          © {currentYear} KSA Disaster Monitoring. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-xs font-medium text-slate-400 hover:text-[var(--accent)]">Privacy Policy</a>
          <a href="#" className="text-xs font-medium text-slate-400 hover:text-[var(--accent)]">Terms of Service</a>
          <a href="#" className="text-xs font-medium text-slate-400 hover:text-[var(--accent)]">Cookie Settings</a>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--accent-soft)]/20 blur-3xl" />
    </footer>
  );
}
