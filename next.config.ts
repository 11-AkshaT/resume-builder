import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  serverExternalPackages: ["razorpay"],
};

export default nextConfig;
