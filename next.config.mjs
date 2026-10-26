/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/dev.db', './prisma/schema.prisma'],
    },
  },
};

export default nextConfig;
