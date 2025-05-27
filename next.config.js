/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Disable using experimental features like Turbopack
  experimental: {
    // Use empty object for now - no experimental features enabled
  },
  // Explicitly declare environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

module.exports = nextConfig;
