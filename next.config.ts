import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output so the Docker frontend image is self-contained (Dockerfile.frontend).
  output: "standalone",

  // Dev only: proxy /api to the local backend so the frontend can call it without
  // CORS. In production Nginx routes /api to the api service, so this never runs.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    const target = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8000";
    return [{ source: "/api/:path*", destination: `${target}/:path*` }];
  },
};

export default nextConfig;
