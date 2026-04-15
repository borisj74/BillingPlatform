import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.paper.design",
        pathname: "/file-assets/**",
      },
    ],
  },
};

export default nextConfig;
