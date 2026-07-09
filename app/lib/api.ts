// Frontend client for the KSA Rangeland Intelligence API.
// Types come from the contract (contracts/openapi.yaml -> contracts/types.ts).
// The base URL points at the Nginx-proxied backend; override with
// NEXT_PUBLIC_API_BASE at build time.

import type {
  Health,
  Indicator,
  Insight,
  InsightRequest,
  Location,
  ObservationSeries,
} from "@/contracts/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${BASE}${path}${qs}`, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiRequestError(res.status, body.detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export class ApiRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export const api = {
  health: () => get<Health>("/health"),
  locations: () => get<Location[]>("/locations"),
  indicators: () => get<Indicator[]>("/indicators"),

  observations: (location: string, indicator: string, from?: string, to?: string) => {
    const params: Record<string, string> = { location, indicator };
    if (from) params.from = from;
    if (to) params.to = to;
    return get<ObservationSeries>("/observations", params);
  },

  insight: async (req: InsightRequest): Promise<Insight> => {
    const res = await fetch(`${BASE}/insight`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ detail: res.statusText }));
      throw new ApiRequestError(res.status, body.detail ?? res.statusText);
    }
    return res.json() as Promise<Insight>;
  },
};

export type { Health, Indicator, Insight, InsightRequest, Location, ObservationSeries };
