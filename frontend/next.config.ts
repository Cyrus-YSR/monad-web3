/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许从IPFS网关加载图片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;
