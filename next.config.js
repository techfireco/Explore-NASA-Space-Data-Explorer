/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'apod.nasa.gov',
      'mars.nasa.gov',
      'images-assets.nasa.gov',
      'images.nasa.gov',
      'www.nasa.gov'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NASA_API_KEY: process.env.NASA_API_KEY || 'DEMO_KEY',
  },
}

module.exports = nextConfig