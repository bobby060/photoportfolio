import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    distDir: '.next', // Default Next.js build output directory
    images: {
        domains: [process.env.IMAGEDELIVERYHOST || 'd3fxm8v2c5j7cl.cloudfront.net'], // Fallback to default if env var not set
        unoptimized: true, // This will prevent the 404 errors for static images
    },
    // If you're not deploying to root domain, uncomment and set your base path
    // basePath: '/your-base-path',
}

export default nextConfig