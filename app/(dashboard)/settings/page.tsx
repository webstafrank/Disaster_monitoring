export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white border border-[var(--line)] p-8 md:p-10 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400 mb-3">Configuration</p>
        <h2 className="text-4xl font-bold tracking-tight">Settings</h2>
        <p className="mt-3 text-slate-600">Manage platform preferences, data sources, and user access controls.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: "Data Sources", desc: "Configure GeoServer endpoints and EO data pipelines.", action: "Manage" },
          { title: "Notifications", desc: "Set thresholds for automated drought and flood alerts.", action: "Configure" },
          { title: "User Access", desc: "Manage roles and permissions for county officers.", action: "Manage Users" },
          { title: "Export Preferences", desc: "Set default formats for PDF and GeoJSON exports.", action: "Update" },
        ].map((item) => (
          <div key={item.title} className="rounded-[2.5rem] border border-[var(--line)] bg-white p-8 hover-lift shadow-sm flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
            <button className="shrink-0 rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-slate-600 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all">
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
