import type { NextConfig } from 'next';

const djangoOrigin = (
  process.env.INTERNAL_API_URL ?? 'http://127.0.0.1:8000'
).replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  agentRules: false,
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 100],
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'backend' },
      { protocol: 'https', hostname: 'gkablog.com' },
      { protocol: 'https', hostname: 'www.gkablog.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${djangoOrigin}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${djangoOrigin}/media/:path*`,
      },
      {
        source: '/admin',
        destination: `${djangoOrigin}/admin/`,
      },
      {
        source: '/admin/:path*',
        destination: `${djangoOrigin}/admin/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${djangoOrigin}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;
