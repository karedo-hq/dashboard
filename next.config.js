/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // temporary redirect
      {
        source: '/',
        destination: '/guides/create',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/guides/create',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
