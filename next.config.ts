import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `npm run dev` writes to .next-dev so it never clashes with `npm run build` (.next).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
