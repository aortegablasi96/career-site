import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolves the `@/*` import alias from tsconfig.json, so tests import modules the same way
  // the application does.
  resolve: { tsconfigPaths: true },
  test: {
    // Components are rendered to static markup, as they are at build time, so no DOM
    // environment is needed.
    environment: 'node',
  },
});
