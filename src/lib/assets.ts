/**
 * src/lib/assets.ts
 * Resolves public asset paths against the configured `base`, so the catalog
 * works both at the domain root and under a subpath (GitHub Pages project
 * site: https://leonelalej.github.io/suministropc/).
 */

/** Normalized base path, always ending with "/" (e.g. "/suministropc/"). */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Prefixes a public asset path with the deploy base. Accepts an optional leading slash. */
export function assetPath(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}
