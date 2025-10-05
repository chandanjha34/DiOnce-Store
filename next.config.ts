import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",    // Example - Unsplash
      "ipfs.io",                // Example - IPFS gateway
      "gateway.pinata.cloud",   // Another IPFS gateway
      "cdn.example.com",       // Replace/add your actual image domains here
      "images.pexels.com",
      "res.cloudinary.com"
    ],
    
  },
  reactStrictMode: true,
  swcMinify: true,
} satisfies NextConfig;

export default nextConfig;
