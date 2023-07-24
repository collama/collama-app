import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  experimental: { serverActions: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
    ],
  },
  webpack: (config) => {
    if (config.name === "server") {
      config.optimization.concatenateModules = false
    }

    return config
  }
};
export default config;
