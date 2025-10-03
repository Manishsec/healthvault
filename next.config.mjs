/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Allow warnings during build
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking during builds
  },
  images: {
    unoptimized: false, // Enable image optimization
    domains: ['vercel.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains for flexibility
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification for better performance
  experimental: {
    forceSwcTransforms: true,
  },
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

export default nextConfig