"use client";

import {
  memo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  Database,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Server,
  Activity,
} from "lucide-react";


interface DataSourceStatus {
  readonly id: string;
  readonly name: string;
  readonly status: "connected" | "degraded" | "offline" | "loading";
  readonly lastSync: string;
  readonly recordsCount: number;
  readonly latencyMs: number;
}

interface ReportExport {
  readonly id: string;
  readonly format: "pdf" | "csv" | "json";
  readonly status: "idle" | "generating" | "ready" | "error";
  readonly progress: number;
  readonly url?: string;
  readonly error?: string;
  readonly generatedAt?: string;
}

interface AnomalyAlert {
  readonly id: string;
  readonly severity: "info" | "warning" | "critical";
  readonly metric: string;
  readonly message: string;
  readonly detectedAt: string;
  readonly acknowledged: boolean;
}

interface SolutionState {
  readonly dataSources: DataSourceStatus[];
  readonly exports: ReportExport[];
  readonly alerts: AnomalyAlert[];
  readonly isRefreshing: boolean;
  readonly autoRefresh: boolean;
}

// ─── Kenya Space Agency Color Palette ────────────────────────
const KSA_COLORS = {
  primary: "#1E40AF",
  primaryFade: "rgba(30,64,175,0.08)",
  secondary: "#0F172A",
  accent: "#2563EB",
  success: "#059669",
  warning: "#D97706",
  destructive: "#DC2626",
  muted: "#64748B",
  surface: "#EFF6FF",
  line: "#BFDBFE",
} as const;
async function fetchDataSourceStatus(): Promise<DataSourceStatus[]> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 800));
  return [
    {
      id: "satellite-ndvi",
      name: "Satellite NDVI Feed",
      status: "connected",
      lastSync: new Date().toISOString(),
      recordsCount: 124_580,
      latencyMs: 245,
    },
    {
      id: "weather-stations",
      name: "Weather Station Network",
      status: "degraded",
      lastSync: new Date(Date.now() - 3600_000).toISOString(),
      lastSync: new Date(Date.now() - 3600_000).toISOString(),
      recordsCount: 89_230,
      latencyMs: 1200,
    },
    {
      id: "land-registry",
      name: "Land Registry API",
      status: "connected",
      lastSync: new Date().toISOString(),
      recordsCount: 45_100,
      latencyMs: 180,
    },
    {
      id: "drought-monitor",
      name: "Drought Monitor (KMD)",
      status: "offline",
      lastSync: new Date(Date.now() - 86400_000).toISOString(),
      recordsCount: 0,
      latencyMs: 0,
    },
  ];
}

async function triggerExport(format: "pdf" | "csv" | "json"): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  return `export-${Date.now()}`;
}

async function pollExportStatus(exportId: string): Promise<ReportExport> {
  await new Promise((r) => setTimeout(r, 600));
  const progress = Math.min(100, Math.floor(Math.random() * 100) + 20);
  return {
    id: exportId,
    format: "pdf",
    status: progress >= 100 ? "ready" : "generating",
    progress,
    url: progress >= 100 ? `/api/v1/reports/download/${exportId}` : undefined,
    generatedAt: progress >= 100 ? new Date().toISOString() : undefined,
  };
}

async function fetchAnomalies(): Promise<AnomalyAlert[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [
    {
      id: "anom-1",
      severity: "warning",
      metric: "Vegetation Health",
      message: "NDVI drop detected in Northern Frontier (-12% vs baseline)",
      detectedAt: new Date(Date.now() - 7200_000).toISOString(),
      acknowledged: false,
    },
    {
      id: "anom-2",
      severity: "critical",
      metric: "Drought Pressure",
      message: "Critical drought index exceeded in 3 ASAL counties",
      detectedAt: new Date(Date.now() - 1800_000).toISOString(),
      acknowledged: false,
    },
    {
      id: "anom-3",
      severity: "info",
      metric: "Land Use",
      message: "Urban expansion rate within expected parameters",
      detectedAt: new Date(Date.now() - 14400_000).toISOString(),
      acknowledged: true,
    },
  ];
}

async function refreshDataSources(): Promise<void> {
  await new Promise((r) => setTimeout(r, 2000));
  // In real implementation: POST /api/v1/data-sources/refresh
}

// ─── Utilities ───────────────────────────────────────────────

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getStatusColor(status: DataSourceStatus["status"]) {
  const map = {
    connected: KSA_COLORS.success,
    degraded: KSA_COLORS.warning,
    offline: KSA_COLORS.destructive,
    loading: KSA_COLORS.muted,
  };
  return map[status];
}

function getStatusIcon(status: DataSourceStatus["status"]) {
  if (status === "connected") return CheckCircle2;
  if (status === "degraded") return AlertTriangle;
  if (status === "offline") return WifiOff;
  return Loader2;
}

// ─── Sub-components ──────────────────────────────────────────

const DataSourceCard = memo(function DataSourceCard({
  source,
}: {
  source: DataSourceStatus;
}) {
  const StatusIcon = getStatusIcon(source.status);
  const color = getStatusColor(source.status);

  return (
    <div
      className="group relative flex items-center gap-3 rounded-xl border p-3.5 transition-all hover:shadow-md"
      style={{
        borderColor: KSA_COLORS.line,
        backgroundColor: "white",
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}12`, color }}
      >
        <StatusIcon className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#1A1A1A] truncate">
            {source.name}
          </p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {source.status}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(source.lastSync)}
          </span>
          {source.status !== "offline" && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#BFDBFE]" />
              <span>{source.recordsCount.toLocaleString()} records</span>
              <span className="h-1 w-1 rounded-full bg-[#BFDBFE]" />
              <span>{source.latencyMs}ms</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const ExportButton = memo(function ExportButton({
  format,
  exportState,
  onExport,
}: {
  format: "pdf" | "csv" | "json";
  exportState: ReportExport | undefined;
  onExport: (format: "pdf" | "csv" | "json") => void;
}) {
  const icons = { pdf: FileText, csv: FileSpreadsheet, json: FileDown };
  const Icon = icons[format];
  const isGenerating = exportState?.status === "generating";
  const isReady = exportState?.status === "ready";

  return (
    <button
      onClick={() => !isGenerating && onExport(format)}
      disabled={isGenerating}
      className={[
        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
        isReady
          ? "text-white shadow-md"
          : "border bg-white text-[#1A1A1A] hover:text-[#1E40AF]",
        isGenerating && "opacity-70 cursor-wait",
      ].join(" ")}
      style={
        isReady
          ? { backgroundColor: KSA_COLORS.success, borderColor: KSA_COLORS.success }
          : { borderColor: KSA_COLORS.line }
      }
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {isGenerating
        ? `${exportState.progress}%`
        : isReady
        ? "Download Ready"
        : `Export ${format.toUpperCase()}`}
    </button>
  );
});

const AnomalyItem = memo(function AnomalyItem({
  alert,
  onAcknowledge,
}: {
  alert: AnomalyAlert;
  onAcknowledge: (id: string) => void;
}) {
  const severityColors = {
    info: KSA_COLORS.primary,
    warning: KSA_COLORS.warning,
    critical: KSA_COLORS.destructive,
  };
  const color = severityColors[alert.severity];

  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-3.5 transition-all"
      style={{
        borderColor: alert.acknowledged ? "#E5E7EB" : `${color}30`,
        backgroundColor: alert.acknowledged ? "#F9FAFB" : `${color}08`,
        opacity: alert.acknowledged ? 0.7 : 1,
      }}
    >
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#1A1A1A]">
            {alert.metric}
          </p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {alert.severity}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#64748B] leading-relaxed">
          {alert.message}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#94A3B8]">
            {timeAgo(alert.detectedAt)}
          </span>
          {!alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="text-[11px] font-semibold transition-colors hover:underline"
              style={{ color: KSA_COLORS.primary }}
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// ─── Main ReportSolutions Component ──────────────────────────

export default function ReportSolutions() {
  const [state, setState] = useState<SolutionState>({
    dataSources: [],
    exports: [],
    alerts: [],
    isRefreshing: false,
    autoRefresh: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load all data
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [sources, anomalies] = await Promise.all([
        fetchDataSourceStatus(),
        fetchAnomalies(),
      ]);
      setState((prev) => ({
        ...prev,
        dataSources: sources,
        alerts: anomalies,
      }));
    } catch (err) {
      console.error("Failed to load report data:", err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh data sources every 30s
  useEffect(() => {
    if (!state.autoRefresh) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.autoRefresh, loadData]);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefreshing: true }));
    try {
      await refreshDataSources();
      await loadData(true);
    } finally {
      setState((prev) => ({ ...prev, isRefreshing: false }));
    }
  }, [loadData]);

  // Handle export
  const handleExport = useCallback(async (format: "pdf" | "csv" | "json") => {
    const exportId = await triggerExport(format);
    
    // Add to exports list as generating
    setState((prev) => ({
      ...prev,
      exports: [
        ...prev.exports.filter((e) => e.format !== format),
        {
          id: exportId,
          format,
          status: "generating",
          progress: 0,
        },
      ],
    }));

    // Poll for completion
    const pollInterval = setInterval(async () => {
      const status = await pollExportStatus(exportId);
      setState((prev) => ({
        ...prev,
        exports: prev.exports.map((e) =>
          e.id === exportId ? status : e
        ),
      }));
      if (status.status === "ready" || status.status === "error") {
        clearInterval(pollInterval);
      }
    }, 1500);

    // Cleanup after 30s max
    setTimeout(() => clearInterval(pollInterval), 30000);
  }, []);

  // Handle acknowledge
  const handleAcknowledge = useCallback((alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    }));
  }, []);

  const unacknowledgedAlerts = state.alerts.filter((a) => !a.acknowledged);
  const criticalCount = unacknowledgedAlerts.filter(
    (a) => a.severity === "critical"
  ).length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 rounded-2xl border bg-white"
        style={{ borderColor: KSA_COLORS.line }}
      >
        <Loader2 className="h-5 w-5 animate-spin text-[#1E40AF]" />
        <span className="text-sm font-medium text-[#64748B]">
          Initializing Report Solutions...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div
        className="flex flex-col gap-4 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: KSA_COLORS.line }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, #DBEAFE 0%, ${KSA_COLORS.surface} 100%)`,
              color: KSA_COLORS.primary,
            }}
          >
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">
              Report Solutions & Data Integrity
            </h3>
            <p className="text-sm text-[#64748B]">
              Live data connections, exports, and anomaly detection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: KSA_COLORS.destructive }}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={state.isRefreshing}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:text-[#1E40AF] disabled:opacity-50"
            style={{ borderColor: KSA_COLORS.line, backgroundColor: "white" }}
          >
            <RefreshCw
              className={["h-4 w-4", state.isRefreshing && "animate-spin"].join(" ")}
            />
            {state.isRefreshing ? "Syncing..." : "Sync Data"}
          </button>
        </div>
      </div>

      {/* Three Column Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: Data Sources */}
        <div
          className="rounded-2xl border bg-white p-5"
          style={{ borderColor: KSA_COLORS.line }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#1E40AF]" />
              <h4 className="text-sm font-bold text-[#1A1A1A]">
                Data Sources
              </h4>
            </div>
            <span className="text-[11px] font-medium text-[#64748B]">
              {state.dataSources.filter((s) => s.status === "connected").length}/
              {state.dataSources.length} Active
            </span>
          </div>
          <div className="space-y-2.5">
            {state.dataSources.map((source) => (
              <DataSourceCard key={source.id} source={source} />
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-[#F8FAFC] p-3">
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              <Zap className="inline h-3 w-3 mr-1 text-[#D97706]" />
              <strong>Action needed:</strong> Drought Monitor (KMD) is offline.
              Reports will use cached data from 24h ago.
            </p>
          </div>
        </div>

        {/* Column 2: Export Controls */}
        <div
          className="rounded-2xl border bg-white p-5"
          style={{ borderColor: KSA_COLORS.line }}
        >
          <div className="mb-4 flex items-center gap-2">
            <FileDown className="h-4 w-4 text-[#1E40AF]" />
            <h4 className="text-sm font-bold text-[#1A1A1A]">
              Export Reports
            </h4>
          </div>
          <div className="space-y-2.5">
            <ExportButton
              format="pdf"
              exportState={state.exports.find((e) => e.format === "pdf")}
              onExport={handleExport}
            />
            <ExportButton
              format="csv"
              exportState={state.exports.find((e) => e.format === "csv")}
              onExport={handleExport}
            />
            <ExportButton
              format="json"
              exportState={state.exports.find((e) => e.format === "json")}
              onExport={handleExport}
            />
          </div>
          <div className="mt-4 rounded-lg bg-[#F8FAFC] p-3">
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              <Shield className="inline h-3 w-3 mr-1 text-[#059669]" />
              Exports include full audit trail and data lineage metadata for
              compliance verification.
            </p>
          </div>
        </div>

        {/* Column 3: Anomaly Alerts */}
        <div
          className="rounded-2xl border bg-white p-5"
          style={{ borderColor: KSA_COLORS.line }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#1E40AF]" />
              <h4 className="text-sm font-bold text-[#1A1A1A]">
                Anomaly Detection
              </h4>
            </div>
            <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[10px] font-bold text-[#1E40AF]">
              {unacknowledgedAlerts.length} Active
            </span>
          </div>
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {state.alerts.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-[#059669]" />
                <p className="text-sm font-medium text-[#64748B]">
                  No anomalies detected
                </p>
              </div>
            ) : (
              state.alerts.map((alert) => (
                <AnomalyItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledge}
                />
              ))
            )}
          </div>
        </div>
      </div>

      
        
    </div>
  );
}