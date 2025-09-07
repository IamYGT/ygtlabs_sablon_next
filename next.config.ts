import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Image optimizasyonu - Next.js 16 uyumlu
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Quality ayarları - Next.js 16 uyarısını çözer
    qualities: [75, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Performans optimizasyonları
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Strict Mode development'ta açık, production'da kapalı
  reactStrictMode: process.env.NODE_ENV === 'development',


  // Compiler optimizasyonları
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Headers for caching


};

export default withNextIntl(nextConfig);
