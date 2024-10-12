/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Fügen Sie diese Zeile hinzu
  experimental: { runtime: 'edge' },
}

module.exports = nextConfig
