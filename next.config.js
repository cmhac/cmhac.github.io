/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Configure for GitHub Pages root domain (cmhac.github.io)
  basePath: "", // No basePath needed for root domain
  assetPrefix: process.env.NODE_ENV === "production" ? "/" : "",
  // Ensure trailing slash is consistent
  trailingSlash: true,
};

module.exports = nextConfig;
