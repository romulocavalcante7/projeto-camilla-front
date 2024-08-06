/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public'
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['utfs.io', 'cloud-1-minio.vaa6nk.easypanel.host','cloud.portalstoryplus.com']
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = withPWA(nextConfig);
