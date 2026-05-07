"use client";

import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Radar,
  MapPin,
  Activity,
} from "lucide-react";

const riskData = [
  {
    region: "Nairobi West",
    risk: "High",
    score: 87,
    trend: "Increasing",
  },
  {
    region: "Kajiado",
    risk: "Medium",
    score: 62,
    trend: "Stable",
  },
  {
    region: "Mombasa Coast",
    risk: "Low",
    score: 28,
    trend: "Decreasing",
  },
];

function getRiskColor(risk: string) {
  if (risk === "High") return "text-red-600 bg-red-50 border-red-200";
  if (risk === "Medium") return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-green-600 bg-green-50 border-green-200";
}

export default function page() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Risk Prediction
          </h1>
          <p className="text-sm text-slate-500">
            AI-assisted disaster risk forecasting
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-green-600">
          <Activity className="h-4 w-4 animate-pulse" />
          Live Analysis
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="p-4 rounded-2xl bg-white shadow border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">High Risk Zones</p>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">4</h2>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Risk Trend</p>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">Rising</h2>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Monitored Regions</p>
            <Radar className="h-5 w-5 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold mt-2">12</h2>
        </div>

      </div>

      {/* Prediction Table */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-600" />
            Regional Risk Forecast
          </h2>
        </div>

        <div className="divide-y">

          {riskData.map((item, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
            >

              {/* Region */}
              <div>
                <p className="font-medium">{item.region}</p>
                <p className="text-xs text-slate-500">
                  Trend: {item.trend}
                </p>
              </div>

              {/* Score */}
              <div className="text-center">
                <p className="text-xs text-slate-500">Risk Score</p>
                <p className="text-lg font-bold">{item.score}</p>
              </div>

              {/* Risk badge */}
              <div
                className={`px-3 py-1 rounded-full text-xs border ${getRiskColor(
                  item.risk
                )}`}
              >
                {item.risk}
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Insight Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-white border rounded-2xl p-5 shadow">

        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-600" />
          AI Insight
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Current models indicate increased flood probability in Nairobi West due to
          rising rainfall anomalies and soil saturation levels. Immediate monitoring
          recommended in high-risk zones.
        </p>

      </div>

    </div>
  );
}