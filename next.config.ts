import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Important pour les hébergeurs comme Hostinger
  reactStrictMode: false, // Désactive le mode strict React
  images: {
    domains: ["spendwise.fun"], // Remplace "yourdomain.com" par ton vrai domaine
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore les erreurs ESLint pendant la construction
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore les erreurs TypeScript pendant la construction
  },
};

export default nextConfig;
