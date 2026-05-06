import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Satellite, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-12 rounded-2xl border border-[var(--line)] bg-white p-8 md:p-10 overflow-hidden relative"
    >
      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr]">
        {/* Brand */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-strong)] text-white">
              <Satellite className="h-4 w-4" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              KSA Disaster
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
            A geospatial intelligence system designed to monitor drought indicators,
            land cover shifts, and vegetation health across Kenya.
          </p>
          <div className="flex gap-3">
            {[Globe, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all border border-[var(--line)]"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {[
              { href: "/",           label: "Home Overview"    },
              { href: "/map-frame",  label: "Map Workspace"    },
              { href: "/reports",    label: "Analysis Reports" },
              { href: "#",           label: "Documentation", external: true },
            ].map(link => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-500 hover:text-[var(--accent)] transition-colors flex items-center gap-2 group"
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--line)] group-hover:bg-[var(--accent)] transition-colors" />
                  {link.label}
                  {link.external && <ExternalLink className="h-3 w-3 opacity-40" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
            Contact
          </h4>
          <ul className="space-y-4">
            {[
              { icon: MapPin, text: "Kenya Space Agency HQ,\nNairobi, Kenya", multiline: true },
              { icon: Mail,   text: "contact@ksa.go.ke" },
              { icon: Phone,  text: "+254 20 123 4567" },
            ].map(({ icon: Icon, text, multiline }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          © {currentYear} KSA Disaster Monitoring. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(l => (
            <a key={l} href="#" className="text-xs text-slate-400 hover:text-[var(--accent)] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[var(--accent-soft)]/15 blur-3xl pointer-events-none" />
    </footer>
  );
}
