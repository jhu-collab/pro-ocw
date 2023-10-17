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
}

module.exports = withContentlayer(nextConfig)
