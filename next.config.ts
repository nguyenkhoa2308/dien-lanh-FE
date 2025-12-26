import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic optimizations
  reactCompiler: true,

  // Enable gzip/brotli compression
  compress: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnv2.tgdd.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Use modern formats
    formats: ['image/avif', 'image/webp'],
    // Optimize image quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header

  // Experimental features for performance
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
};

export default nextConfig;
