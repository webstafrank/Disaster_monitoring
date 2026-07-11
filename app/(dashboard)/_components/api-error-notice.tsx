import { AlertTriangle } from "lucide-react";

// Placeholder shown wherever a live-data surface has no wired API endpoint yet.
// Renders the literal fallback text "API error" so the UI never presents
// fabricated monitoring data as if it were real. `context` adds a muted line
// naming which feed is missing; it does not change the primary text.
export function ApiErrorNotice({ context }: { context?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[2rem] border border-[var(--terracotta)]/30 bg-[var(--terracotta-soft)] p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60">
        <AlertTriangle className="h-5 w-5 text-[var(--terracotta)]" />
      </div>
      <div>
        <p className="text-sm font-bold text-[var(--terracotta)]">API error</p>
        {context && (
          <p className="mt-0.5 text-xs font-medium text-[var(--terracotta)]/80">{context}</p>
        )}
      </div>
    </div>
  );
}
