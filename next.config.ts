import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s6ekf53f3c.ufs.sh", 
      },
      {
        protocol: "https",
        hostname: "we2plp04mq.ufs.sh", 
      },
      {
        protocol: "https",
        hostname: "s6ekf53f3c.ufs.sh", 
      },
    ],
  },
};

export default nextConfig;