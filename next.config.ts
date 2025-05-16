import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // output: 'export', // Outputs a Single-Page Application (SPA)
    distDir: 'build', // Changes the build output directory to `build`
    images: {
        domains: ['d3fxm8v2c5j7cl.cloudfront.net'] // Need to make this an amplify secret or something
    }
}

export default nextConfig