const topics = [
  {
    title: "Hydrological risk",
    description: "Track flood-prone basins, rainfall anomalies, and drainage congestion.",
  },
  {
    title: "Population exposure",
    description: "Estimate affected settlements, sensitive groups, and service demand.",
  },
  {
    title: "Infrastructure resilience",
    description: "Monitor transport links, health sites, utilities, and access corridors.",
  },
  {
    title: "Environmental pressure",
    description: "Watch terrain instability, heat stress, and land cover degradation.",
  },
];

export default function TopicsUnderStudyPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-[var(--surface-strong)] p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent)]">
          Topics Under Study
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Organize the analytical themes that drive the dashboard.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Use this route to frame the questions the map should answer. Each
          topic can later connect to dedicated indicators, filters, charts, and
          map layers.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {topics.map((topic, index) => (
          <article
            key={topic.title}
            className="rounded-[2rem] border border-[var(--line)] bg-white/70 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold tracking-tight">{topic.title}</p>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                Topic {index + 1}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {topic.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
