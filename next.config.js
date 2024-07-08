/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public'
});

const nextConfig = {
  images: {
    domains: ['utfs.io', 'cloud-1-minio.vaa6nk.easypanel.host']
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = withPWA(nextConfig);
