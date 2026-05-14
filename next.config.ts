import type { NextConfig } from "next";
import withPWA from "next-pwa";
const config: NextConfig = { reactStrictMode: true };
const nextConfig = withPWA({ dest: "public", disable: process.env.NODE_ENV === "development", register: true, skipWaiting: true })(config);
export default nextConfig;
