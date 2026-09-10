import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ADR-001: every page is built to HTML at build time and served as a static file.
  output: 'export',
  // ADR-003: the deploy workflow sets this to the path GitHub Pages serves the site under.
  // It is unset locally, so development and local builds are served from the root.
  basePath: process.env.PAGES_BASE_PATH,
};

export default nextConfig;
