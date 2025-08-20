/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"], // add other workspace packages if needed
  experimental: {
    esmExternals: true, // required for ESM workspace modules
  },
  output: "standalone", // good for deployment on Vercel
};

module.exports = nextConfig;
