"use client";

import { useMemo, useState } from "react";

type AreaReport = {
  id: string;
  label: string;
  summary: string;
  landUse: number[];
  vegetation: number[];
  drought: number[];
};

const areaReports: AreaReport[] = [
  {
    id: "ksa-wide",
    label: "KSA wide",
    summary: "Countrywide reporting for annual land cover, greenness, and drought pressure comparisons.",
    landUse: [42, 47, 54, 58, 63],
    vegetation: [36, 41, 49, 56, 60],
    drought: [22, 30, 38, 45, 52],
  },
  {
    id: "northern-rangelands",
    label: "Northern rangelands",
    summary: "Dryland reporting focused on grazing pressure, vegetation stress, and persistent moisture deficits.",
    landUse: [30, 34, 39, 43, 46],
    vegetation: [28, 32, 37, 35, 40],
    drought: [40, 48, 57, 61, 68],
  },
  {
    id: "eastern-agricultural-corridor",
    label: "Eastern agricultural corridor",
    summary: "Track cultivation patterns, greenness response, and drought exposure across irrigated districts.",
    landUse: [46, 52, 57, 61, 66],
    vegetation: [40, 45, 53, 59, 63],
    drought: [18, 24, 31, 37, 44],
  },
  {
    id: "southwestern-highlands",
    label: "Southwestern highlands",
    summary: "Monitor mountain land use transitions, vegetation recovery, and seasonal drought stress.",
    landUse: [34, 38, 41, 45, 49],
    vegetation: [44, 50, 58, 62, 67],
    drought: [20, 26, 35, 41, 47],
  },
];

const periods = ["2016", "2018", "2020", "2022", "2024"];

function InsightChart({
  title,
  description,
  values,
  tone,
  lineClass,
  pointClass,
}: {
  title: string;
  description: string;
  values: number[];
  tone: string;
  lineClass: string;
  pointClass: string;
}) {
  const points = values
    .map((value, index) => `${index * 25},${100 - value}`)
    .join(" ");

  return (
    <article className="rounded-[2rem] border border-[var(--line)] bg-white/75 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            Insight Graph
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h3>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>
          active
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 rounded-[1.5rem] bg-[var(--surface-strong)] p-4">
        <svg viewBox="0 0 100 100" className="h-44 w-full overflow-visible">
          <polyline
            fill="none"
            stroke="rgba(7,27,77,0.14)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className={lineClass}
          />
          {values.map((value, index) => (
            <circle
              key={`${title}-${periods[index]}`}
              cx={index * 25}
              cy={100 - value}
              r="3.5"
              className={pointClass}
            />
          ))}
        </svg>

        <div className="mt-2 grid grid-cols-5 gap-2 text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {periods.map((period) => (
            <span key={period}>{period}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ReportsPage() {
  const [selectedArea, setSelectedArea] = useState(areaReports[0]);

  const reportCards = useMemo(
    () => [
      {
        title: "Land use",
        description: "Land cover transition and built-up expansion trends for the selected area of study.",
        values: selectedArea.landUse,
        tone: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
        lineClass: "text-[var(--accent-strong)]",
        pointClass: "fill-[var(--accent-strong)]",
      },
      {
        title: "Vegetation monitoring",
        description: "Greenness and vegetation condition patterns derived from time-based satellite indicators.",
        values: selectedArea.vegetation,
        tone: "bg-[var(--secondary-soft)] text-[var(--secondary-strong)]",
        lineClass: "text-[var(--secondary-strong)]",
        pointClass: "fill-[var(--secondary-strong)]",
      },
      {
        title: "Drought indicators",
        description: "Reported drought pressure using annual severity and exposure summaries for the chosen area.",
        values: selectedArea.drought,
        tone: "bg-[var(--warning-soft)] text-[var(--warning)]",
        lineClass: "text-[var(--warning)]",
        pointClass: "fill-[var(--warning)]",
      },
    ],
    [selectedArea],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-[var(--surface-strong)] p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent)]">
          Reports
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Insight reports for any selected area of study.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Switch between study areas to update the reporting view. Each report
          card summarizes land use, vegetation monitoring, and drought
          indicators as charts that can later be connected to GeoServer-derived
          aggregations.
        </p>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/70 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
              Area Selector
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">
              Reports by area of study
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {selectedArea.summary}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {areaReports.map((area) => {
            const isActive = area.id === selectedArea.id;

            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={[
                  "rounded-full px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-[var(--accent-strong)] text-white"
                    : "border border-[var(--line)] bg-[var(--surface-strong)] text-slate-700 hover:border-[var(--accent)]",
                ].join(" ")}
              >
                {area.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {reportCards.map((card) => (
          <InsightChart
            key={card.title}
            title={card.title}
            description={card.description}
            values={card.values}
            tone={card.tone}
            lineClass={card.lineClass}
            pointClass={card.pointClass}
          />
        ))}
      </section>
    </div>
  );
}
