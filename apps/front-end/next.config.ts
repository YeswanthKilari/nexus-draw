import type { NextConfig } from "next";
import withTM from "next-transpile-modules-plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withTM(["@repo/db", "@repo/backend-common"])(nextConfig);
