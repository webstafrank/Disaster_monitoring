import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Satellite } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 rounded-[2.5rem] border border-[var(--line)] bg-white p-8 md:p-12 overflow-hidden relative shadow-sm">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--surface-strong)] to-transparent pointer-events-none" />
      
      <div className="relative z-10 grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
        {/* Project Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <Image src="/ksa.PNG" alt="KSA Logo" width={48} height={48} className="object-contain" />
             <div className="h-8 w-px bg-[var(--line)]" />
             <Image src="/wfp.PNG" alt="WFP Logo" width={48} height={48} className="object-contain" />
          </div>
          <div className="space-y-1">
             <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Rangeland Intelligence Hub</h3>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--earth-green)]">Disaster Monitoring Framework</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 max-w-md">
            A state-of-the-art geospatial intelligence system designed to monitor drought indicators, land cover shifts, and vegetation health across Kenya&apos;s Arid and Semi-Arid Lands (ASALs).
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
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Platform Navigation</h4>
          <ul className="grid grid-cols-2 gap-y-4 gap-x-2">
            <li>
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/map-frame" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Spatial Command
              </Link>
            </li>
            <li>
              <Link href="/reports" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                ASAL Analytics
              </Link>
            </li>
            <li>
              <Link href="/topics-under-study" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Research Topics
              </Link>
            </li>
            <li>
              <Link href="/alerts" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Alerts & Warnings
              </Link>
            </li>
            <li>
              <Link href="/field-data" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Field Data
              </Link>
            </li>
            <li>
              <Link href="/data-library" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Data Library
              </Link>
            </li>
            <li>
              <Link href="/satellites" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                EO Satellites
              </Link>
            </li>
            <li>
              <Link href="/settings" className="text-sm font-medium text-slate-600 hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--line)]" />
                Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Contact & Support</h4>
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--earth-green-soft)] text-[var(--earth-green)]">
                <Mail className="h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600 font-medium">contact@ksa.go.ke</p>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--savanna-gold-soft)] text-[var(--savanna-gold)]">
                <Phone className="h-4 w-4" />
              </div>
              <p className="text-sm text-slate-600 font-medium">+254 20 123 4567</p>
            </li>
          </ul>

          <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--sidebar-bg)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
             <Satellite className="h-3 w-3 text-[var(--sky-blue)]" />
             Powered by Earth Observation
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="mt-16 pt-8 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-xs font-medium text-slate-500">
          © {currentYear} KSA & WFP Joint Initiative. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[var(--accent)] transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[var(--accent)] transition-colors">Data Sharing Terms</a>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--earth-green)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-[var(--sky-blue)]/10 blur-3xl pointer-events-none" />
    </footer>
  );
}
