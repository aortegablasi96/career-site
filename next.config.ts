import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ADR-001: every page is built to HTML at build time and served as a static file.
  output: 'export',
};

export default nextConfig;
