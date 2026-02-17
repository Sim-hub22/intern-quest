import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: false, // Temporarily disabled until /dashboard route is implemented
};

export default nextConfig;
