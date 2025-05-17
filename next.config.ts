import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    distDir: '.next', // Default Next.js build output directory
    trailingSlash: true, // Ensures trailing slashes for all routes
    images: {
        domains: ['d3fxm8v2c5j7cl.cloudfront.net'], // Need to make this an amplify secret or something
    },
    // If you're not deploying to root domain, uncomment and set your base path
    // basePath: '/your-base-path',
}

export default nextConfig