/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qkijiblvnciaxyqstnuq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
}

module.exports = nextConfig