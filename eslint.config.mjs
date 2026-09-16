import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // ADR-004 rules out next/image: with output: 'export' it needs unoptimized images or a
      // custom loader, after which it offers nothing a plain <img> with fixed dimensions does not,
      // and the assets are prepared by hand at the size they are shown. The rule that steers
      // towards it is therefore arguing with an accepted decision at every image, so it is off
      // here once rather than silenced at each one.
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);

export default eslintConfig;
