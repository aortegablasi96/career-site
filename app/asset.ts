/**
 * The one route from a binary asset's path to the address a browser fetches it from, per ADR-004.
 *
 * ADR-003 served the site from GitHub Pages under `/career-site`, and passed that path to the build
 * as `PAGES_BASE_PATH`, which `next.config.ts` hands to `basePath`. ADR-023's Vercel serves it from
 * the root, so the variable is unset everywhere, but the rule stands for any host that serves the
 * site under a path. Next.js applies the base path to
 * `next/link` hrefs and to the assets it emits itself, but not to a root-relative string written
 * into a plain `src`, `href` or `poster` attribute. Such a string is correct locally, where the
 * variable is unset, and 404s on the live site. That asymmetry is why this helper exists and why
 * `components/assets.test.ts` insists on it: the mistake is invisible on the machine that makes it.
 *
 * The variable is read here rather than captured at module scope so that the value is the one the
 * build was given. A Server Component resolves it during the export. A Client Component, such as
 * `components/larger-picture.tsx` (ADR-018), also renders in the browser when a link opens its view,
 * so `next.config.ts` hands the variable to its `env` as well, and the build writes the path into
 * the browser's code. Without that, the browser's value was empty and its pictures 404ed (#261).
 *
 * Paths themselves are data and live in `content/`, beside the alternative text they belong with,
 * per ADR-002. A component receives one as a prop and passes it through here.
 */
export function asset(path: string): string {
  return `${process.env.PAGES_BASE_PATH ?? ''}${path}`;
}
