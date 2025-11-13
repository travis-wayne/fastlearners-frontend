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
  // Fix Contentlayer file-watching on Windows
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      poll: true,
      ignored: /node_modules/,
    };
    return config;
  },
};

module.exports = withContentlayer(nextConfig);
