import { MapFramePanel } from "./_components/map-frame-panel";

export default function MapFramePage() {
    return (
        <div className="space-y-6">
            <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none" />
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent)] mb-4">
                    Spatial Command Center
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
                    Interactive <span className="text-gradient-earth">Map Workspace</span>
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
                    Explore high-resolution Earth Observation (EO) layers, analyze vegetation trends, and monitor disaster impacts across Kenya&apos;s Arid and Semi-Arid Lands (ASALs).
                </p>
            </section>

            <MapFramePanel />
        </div>
    );
}
