import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Ensure Prisma works correctly in serverless (Vercel) environments
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;

