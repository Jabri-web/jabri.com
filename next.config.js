/** @type {import('next').NextConfig} */
const nextConfig = {
  // Since you're using static HTML files, we need to handle them properly
  // This is for Next.js with static exports
  
  // If you're using Next.js App Router:
  // output: 'export', // Uncomment if you want static export
  
  // For redirects and rewrites
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar/',
        permanent: true, // 308 redirect (or use false for 302)
      },
      {
        source: '/en',
        destination: '/en/',
        permanent: true,
      },
    ];
  },
  
  async rewrites() {
    return [
      // Try to serve from /ar/ first, then /en/, then root
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
