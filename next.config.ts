import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d14px57phpx7ds.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },

  compiler: {
    removeConsole: !isDevelopment
      ? {
          exclude: ["error", "info", "warn"],
        }
      : false,
  },

  staticPageGenerationTimeout: 300,
};

export default nextConfig;
