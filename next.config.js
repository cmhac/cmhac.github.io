/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Configure for GitHub Pages
  basePath: process.env.NODE_ENV === "production" ? "/portfolio-site" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/portfolio-site/" : "",
};

module.exports = nextConfig;
