const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "files.stripe.com" },
      { hostname: "framerusercontent.com" },
      { hostname: "res.cloudinary.com" },
    ],
  },
  env: {
    API_URL: process.env.API_URL
  },
}

module.exports = withContentlayer(nextConfig)
