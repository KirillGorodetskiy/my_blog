import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  agentRules: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 100],
  },
};

export default nextConfig;
