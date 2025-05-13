/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.WORDPRESS_URL || 'localhost'],
  },
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/graphql',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 