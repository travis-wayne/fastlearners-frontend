const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  // TODO: Uncomment this rewrite after removing app/(protected)/dashboard/blog/page.tsx
  // once analytics show negligible traffic to /dashboard/blog (monitor for 2-3 months)
  // async rewrites() {
  //   return [
  //     {
  //       source: '/dashboard/blog',
  //       destination: '/dashboard/subject',
  //     },
  //   ];
  // },
};

module.exports = withContentlayer(nextConfig);
