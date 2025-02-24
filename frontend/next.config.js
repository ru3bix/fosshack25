
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_GROQ_API_KEY: "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"
  }
};

module.exports = nextConfig;
