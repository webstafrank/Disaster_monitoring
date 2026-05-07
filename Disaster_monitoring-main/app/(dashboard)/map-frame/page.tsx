"use client";
import { MapFramePanel } from "./_components/map-frame-panel";

export default function MapFramePage() {
    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] bg-[var(--surface-strong)] p-6 md:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent)]">
                    Map Frame
                </p>
            </section>

            <MapFramePanel />
        </div>
    );
}
