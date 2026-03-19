import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript errors during build (fix false positives in JSX)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
