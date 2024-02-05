/** @type {import('next').NextConfig} */

const dotenvExpand = require('dotenv-expand');

dotenvExpand.expand({ parsed: { ...process.env } });

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
