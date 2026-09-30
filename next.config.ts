import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ADR-001: every page is built to HTML at build time and served as a static file.
  output: 'export',
  // ADR-003: the deploy workflow sets this to the path GitHub Pages serves the site under.
  // It is unset locally, so development and local builds are served from the root.
  basePath: process.env.PAGES_BASE_PATH,
  // ADR-004: app/asset.ts prefixes the same path. Without the prefix NEXT_PUBLIC_, a variable
  // reaches only the server, so a Client Component that calls asset() lost the path in the browser
  // and its pictures 404ed once a link rendered the view there (#261). Written here, the build
  // writes the value into the browser's code too.
  env: { PAGES_BASE_PATH: process.env.PAGES_BASE_PATH ?? '' },
};

export default nextConfig;
