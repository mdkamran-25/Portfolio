import type { NextConfig } from "next";

// Bundle analyzer setup for performance optimization
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    domains: ["localhost", "vercel.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:path*.vue.map",
        destination: "/_not-found",
      },
    ];
  },
  // Ensure static files are handled correctly
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|jpeg)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
