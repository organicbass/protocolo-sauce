/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    async rewrites() {
      return [
        {
          source: '/ogbass',
          destination: 'https://organic-bass-site.vercel.app/ogbass/',
        },
        {
          source: '/ogbass/:path*',
          destination: 'https://organic-bass-site.vercel.app/ogbass/:path*',
        },
      ];
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
