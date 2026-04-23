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
  // These packages use native Node.js modules and must NOT be bundled by webpack.
  // Required for correct operation on Vercel serverless functions.
  serverExternalPackages: ["@prisma/client", "bcryptjs", "nodemailer"],
  // Silence the multi-lockfile workspace root warning
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
