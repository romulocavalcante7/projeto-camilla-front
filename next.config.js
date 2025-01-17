/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public'
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['utfs.io', 'milla-lashes-minio.pnfqhc.easypanel.host']
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = withPWA(nextConfig);
