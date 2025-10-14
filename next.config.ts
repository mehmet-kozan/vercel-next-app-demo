import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pdf-parse","@napi-rs/canvas"],
};

export default nextConfig;
