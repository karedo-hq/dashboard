/** @type {import('next').NextConfig} */

const dotenvExpand = require('dotenv-expand');

dotenvExpand.expand({ parsed: { ...process.env } });

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
