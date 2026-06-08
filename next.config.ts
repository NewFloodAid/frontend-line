import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" is only needed for Docker self-hosting.
  // Vercel handles this automatically — no output config needed.
  // For Docker deployment, uncomment: output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
