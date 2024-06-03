/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    url: 'https://mpc-sample.vercel.app/',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
