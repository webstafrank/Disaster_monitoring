import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output so the Docker frontend image is self-contained (Dockerfile.frontend).
  output: "standalone",
};

export default nextConfig;
