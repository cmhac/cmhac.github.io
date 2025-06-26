/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Configure for GitHub Pages
  basePath: process.env.NODE_ENV === "production" ? "/portfolio-site" : "", // Adjust this to match your repo name
  assetPrefix: process.env.NODE_ENV === "production" ? "/portfolio-site/" : "",
  // Ensure trailing slash is consistent
  trailingSlash: true,
};

module.exports = nextConfig;
