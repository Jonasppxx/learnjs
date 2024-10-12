/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    runtime: 'edge',
    serverComponents: true,
  },
}

module.exports = nextConfig
